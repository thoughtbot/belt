import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import copyTemplate from '../util/copyTemplate';
import getProjectDir from '../util/getProjectDir';
import isPrettierConfigured from '../util/isPrettierConfigured';
import print from '../util/print';

export default async function addPrettier() {
  const projectDir = await getProjectDir();
  const eslintJsFile = path.join(projectDir, '.eslintrc.js');
  const eslintJSONFile = path.join(projectDir, '.eslintrc.json');
  let hasEslint = false;

  if (await isPrettierConfigured()) {
    print('prettier config file already exists, exiting');
    return;
  }

  if ((await fs.exists(eslintJsFile)) || (await fs.exists(eslintJSONFile))) {
    hasEslint = true;
  }

  if (await fs.exists(path.join(projectDir, '.prettierignore'))) {
    print('.prettierignore config file already exists, will not overwrite');
  } else {
    await copyTemplate({
      templateDir: 'prettier',
      templateFile: '.prettierignore.eta',
    });
  }

  await addDependency('prettier', { dev: true });

  await copyTemplate({
    templateDir: 'prettier',
    templateFile: '.prettierrc',
  });

  await addPackageJsonScripts({
    'lint:prettier': "prettier --check '**/*' --ignore-unknown",
    'fix:prettier': "prettier --write '**/*' --ignore-unknown",
  });

  if (hasEslint) {
    print(
      'We noticed ESLint is already set up, you might consider adding the Prettier ESLint plugin or regenerating with the eslint command.',
    );
  }

  print(chalk.green('🎉 Prettier successfully configured'));
}
