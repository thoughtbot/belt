import { log } from 'console';
import fsExtra from 'fs-extra';
import fs from 'fs';
import getProjectDir from '../util/getProjectDir';
import path from 'path';
import chalk from 'chalk';
import * as eta from 'eta';
import formatFile from '../util/formatFile';
import addDependency from '../util/addDependency';
import isPackageInstalled from '../util/isPackageInstalled';

export default async function runEslint() {
  log('Setup your EsLint config!');

  const projectDir = await getProjectDir();

  const eslintJsFile = path.join(projectDir, '.eslintrc.js');
  const eslintJSONFile = path.join(projectDir, '.eslintrc.json');

  if (await fsExtra.exists(eslintJsFile)) {
    log('.eslintrc.js config file already exists');
  } else if (await fsExtra.exists(eslintJSONFile)) {
    log('.eslintrc.json config file already exists');
  } else {
    const hasPrettier = await isPackageInstalled('prettier');
    const hasEslint = await isPackageInstalled('eslint');
    const hasTypeScript = await isPackageInstalled('typescript');

    const eslintConfigTemplate = await fs.readFileSync(
      path.join(projectDir, 'src', 'templates', '.eslintrc.js.template.eta'),
      { encoding: 'utf8' }
    );

    await fs.writeFileSync(
      path.join(projectDir, '.eslintrc.js'),
      eta.render(eslintConfigTemplate.toString(), {
        typescript: hasTypeScript,
      })
    );

    const deps = `${hasPrettier ? '' : 'prettier'} ${
      hasEslint ? '' : 'eslint'
    } @typescript-eslint/eslint-plugin @typescript-eslint/parser`;

    addDependency(deps, { dev: true });

    // !hasPrettier && await fs.writeFileSync(path.join(projectDir, '.prettierrc'), JSON.stringify(answers));

    await formatFile(path.join(projectDir, '.eslintrc.js'));
    log(chalk.green('🎉 ESLint successfully configured'));
  }
}
