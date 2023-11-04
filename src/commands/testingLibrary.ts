import { execSync } from 'child_process';
import addDependency from '../util/addDependency';
import copyTemplate from '../util/copyTemplate';
import isExpo from '../util/isExpo';

export default async function addTestingLibrary() {
  const expo = await isExpo();

  if (expo) {
    execSync('npx expo install jest jest-expo');
  }

  await addDependency(
    'jest @testing-library/react-native @testing-library/jest-native @types/jest babel-jest',
    { dev: true },
  );

  await copyTemplate({
    templateDir: 'testingLibrary',
    templateFile: 'jest.config.js.eta',
    destination: 'jest.config.js',
    variables: { expo },
  });

  await copyTemplate({
    templateDir: 'testingLibrary',
    templateFile: 'jest.setup.js',
    destination: './',
  });

  await copyTemplate({
    templateDir: 'testingLibrary',
    templateFile: 'fileMock.js',
    destination: './src/test/',
  });
}
