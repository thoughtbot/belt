import chalk from 'chalk';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import isEslintConfigured from '../util/isEslintConfigured';
import isPackageInstalled from '../util/isPackageInstalled';
import print from '../util/print';

export default async function addEslint() {
  if (await isEslintConfigured()) {
    print('eslint config already exists');
  } else {
    const hasTypeScript = await isPackageInstalled('typescript');

    await addDependency('eslint @thoughtbot/eslint-config', { dev: true });

    await copyTemplateDirectory({
      templateDir: 'eslint',
      variables: { typescript: hasTypeScript },
    });

    await addPackageJsonScripts({
      'lint:eslint': 'eslint --max-warnings=0 --ext js,jsx,ts,tsx .',
    });

    print(chalk.green('🎉 ESLint successfully configured'));
  }
}
