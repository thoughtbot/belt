import chalk from 'chalk';
import * as eta from 'eta';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '../constants';
import addDependency from '../util/addDependency';
import getProjectDir from '../util/getProjectDir';
import isEslintConfigured from '../util/isEslintConfigured';
import isPackageInstalled from '../util/isPackageInstalled';
import print from '../util/print';
import writeFile from '../util/writeFile';

export default async function addEslint() {
  const projectDir = await getProjectDir();

  if (await isEslintConfigured()) {
    print('eslint config already exists');
  } else {
    const hasTypeScript = await isPackageInstalled('typescript');

    const eslintConfigTemplate = await fs.readFile(
      path.join(PACKAGE_ROOT, 'templates/eslintrc.js.eta'),
    );

    const fileContents = eta.render(eslintConfigTemplate.toString(), {
      typescript: hasTypeScript,
    });

    await writeFile(path.join(projectDir, '.eslintrc.js'), fileContents, {
      format: true,
    });

    await addDependency('@thoughtbot/eslint-config', { dev: true });

    print(chalk.green('🎉 ESLint successfully configured'));
  }
}
