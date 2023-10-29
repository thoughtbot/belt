import { fileURLToPath, URL } from 'url';
import copyTemplate from '../util/copyTemplate';
import isExpo from '../util/isExpo';

// for manual testing, change this to another name so doesn't conflict
// with project's tsconfig.json
const tsConfig = 'tsconfig.json';
const dirname = fileURLToPath(new URL('.', import.meta.url));

export default async function addTestingLibrary() {
  const expo = await isExpo();

  if (expo) {
    // execSync('npx expo install jest jest-expo');
  }

  // await addDependency(
  //   'jest @testing-library/react-native @testing-library/jest-native @types/jest babel-jest',
  //   { dev: true },
  // );

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
