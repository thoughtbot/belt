import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import copyTemplate from '../util/copyTemplate';
import getProjectDir from '../util/getProjectDir';
import isPrettierConfigured from '../util/isPrettierConfigured';
import print from '../util/print';

export default async function addPrettier() {
  const spinner = ora().start('Installing and configuring Prettier');
  const projectDir = await getProjectDir();
  const eslintJsFile = path.join(projectDir, '.eslintrc.js');
  const eslintJSONFile = path.join(projectDir, '.eslintrc.json');
  let hasEslint = false;

  if (await isPrettierConfigured()) {
    spinner.warn('prettier config file already exists, exiting');
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

  spinner.succeed('Prettier successfully configured');

  if (hasEslint) {
    print(`
'We noticed ESLint is already set up, you might consider updating your ESLint
configuration to use eslint-config-prettier:
https://github.com/prettier/eslint-config-prettier. This turns off all ESLint
rule that are unnecessary or might conflict with Prettier.
`);
  }
}
