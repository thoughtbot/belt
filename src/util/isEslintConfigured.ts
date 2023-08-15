import path from 'path';
import fsExtra from 'fs-extra';
import getProjectDir from './getProjectDir';
import readPackageJson from './readPackageJson';

export default async function isEslintConfigured() {
  const packageJson = await readPackageJson();

  const projectDir = await getProjectDir();

  const hasEslintConfigInPackageJson = Object.prototype.hasOwnProperty.call(packageJson, 'eslint');
  const hasEslintrcJsFile = await fsExtra.exists(path.join(projectDir, '.eslintrc.js'));
  const hasEslintJsonFile = await fsExtra.exists(path.join(projectDir, '.eslintrc.json'));

  return hasEslintConfigInPackageJson || hasEslintrcJsFile || hasEslintJsonFile;
}
