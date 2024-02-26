import ora from 'ora';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import isEslintConfigured from '../util/isEslintConfigured';
import isPackageInstalled from '../util/isPackageInstalled';

export default async function addEslint() {
  const spinner = ora().start('Installing and configuring ESLint');

  if (await isEslintConfigured()) {
    spinner.warn('ESLint config already exists, skipping.');
    return;
  }

  const hasTypeScript = await isPackageInstalled('typescript');

  await addDependency('eslint @thoughtbot/eslint-config', { dev: true });

  await copyTemplateDirectory({
    templateDir: 'eslint',
    variables: { typescript: hasTypeScript },
  });

  await addPackageJsonScripts({
    'lint:eslint': 'eslint --max-warnings=0 --ext js,jsx,ts,tsx .',
    'lint:fix': 'eslint --fix --ext js,jsx,ts,tsx .',
  });

  spinner.succeed('ESLint successfully configured');
}
