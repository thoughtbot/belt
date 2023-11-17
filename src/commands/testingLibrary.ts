import ora from 'ora';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import addToGitignore from '../util/addToGitignore';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import getPackageManager from '../util/getPackageManager';
import isExpo from '../util/isExpo';

export default async function addTestingLibrary() {
  const spinner = ora().start('Installing Jest and Testing Library');
  const expo = await isExpo();

  if (expo) {
    await exec('npx expo install jest jest-expo');
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
  const cmd = mgr === 'npm' ? 'npm run' : mgr;
  await addPackageJsonScripts(
    {
      test: 'jest',
      'test:ci': `jest --maxWorkers=2 --silent --ci`,
      'test:cov': `jest --coverage --coverageDirectory ./.cache/coverage`,
      'test:all': `${cmd} lint && ${cmd} test:cov`,
    },
    { overwrite: true },
  );

  await addToGitignore('/.cache');

  spinner.succeed(
    'Successfully installed and configured Jest and Testing Library',
  );
}
