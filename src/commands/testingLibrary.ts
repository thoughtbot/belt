import chalk from 'chalk';
import { execSync } from 'child_process';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import addToGitignore from '../util/addToGitignore';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import getPackageManager from '../util/getPackageManager';
import isExpo from '../util/isExpo';
import print from '../util/print';

export default async function addTestingLibrary() {
  print(chalk.bold('👖 Installing Jest and Testing Library'));
  const expo = await isExpo();

  if (expo) {
    execSync('npx expo install jest jest-expo');
  }

  await addDependency(
    `${
      expo ? '' : 'jest'
    } @testing-library/react-native @testing-library/jest-native @types/jest babel-jest`,
    { dev: true },
  );

  await copyTemplateDirectory({
    templateDir: 'testingLibrary',
    variables: { expo },
  });

  const mgr = await getPackageManager();
  await addPackageJsonScripts(
    {
      test: 'jest',
      'test:ci': `${mgr} test --maxWorkers=2 --silent --ci`,
      'test:cov': `${mgr} test --coverage --coverageDirectory ./.cache/coverage`,
      'test:all': `${mgr} lint && ${mgr} test:cov`,
    },
    { overwrite: true },
  );

  await addToGitignore('/.cache');

  print(
    chalk.green(
      '\n🎉 Successfully installed and configured Jest and Testing Library\n',
    ),
  );
}
