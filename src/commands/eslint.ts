import { log } from 'console';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import * as eta from 'eta';
import { fileURLToPath, URL } from 'url';
import getProjectDir from '../util/getProjectDir';
import formatFile from '../util/formatFile';
import addDependency from '../util/addDependency';
import isPackageInstalled from '../util/isPackageInstalled';
import isEslintConfigured from '../util/isEslintConfigured';
import writeFile from '../util/writeFile';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default async function runEslint() {
  log('Setup your EsLint config!');

  const projectDir = await getProjectDir();

  if (await isEslintConfigured()) {
    log('eslint config already exists');
  } else {
    const hasPrettier = await isPackageInstalled('prettier');
    const hasEslint = await isPackageInstalled('eslint');
    const hasTypeScript = await isPackageInstalled('typescript');

    const eslintConfigTemplate = await fs.readFile(
      path.join(dirname, 'templates', 'eslintrc.js.eta'),
    );

    const fileContents = eta.render(eslintConfigTemplate.toString(), {
      typescript: hasTypeScript,
    });

    await writeFile(path.join(projectDir, '.eslintrc.js'), fileContents, {
      format: true,
    });

    const deps = `${hasPrettier ? '' : 'prettier'} ${
      hasEslint ? '' : 'eslint'
    } @typescript-eslint/eslint-plugin @typescript-eslint/parser`;

    await addDependency(deps, { dev: true });

    await formatFile(path.join(projectDir, '.eslintrc.js'));
    log(chalk.green('🎉 ESLint successfully configured'));
  }
}
