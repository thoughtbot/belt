import { confirm, input } from '@inquirer/prompts';
import { execSync, spawnSync } from 'child_process';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import print from '../util/print';
import addEslint from './eslint';
import addPrettier from './prettier';
import createScaffold from './scaffold';
import addTestingLibrary from './testingLibrary';
import addTypescript from './typescript';

type Options = {
  testing: boolean;
};

export async function createApp(
  name: string | undefined,
  { testing }: Options,
) {
  const appName = name || (await getAppName());
  await printIntro();

  spawnSync('npx', ['--yes', 'create-expo-app@latest', appName], {
    stdio: 'inherit',
  });

  process.chdir(`./${appName}`);

  // add dependencies that every project will use
  await addDependency(
    [
      'react-native-keyboard-aware-scrollview',
      'react-native-safe-area-context',
      '@react-native-async-storage/async-storage',
    ].join(' '),
  );
  commit('Add dependencies');

  // must add TS before ESLint
  await addTypescript();
  execSync('git add .');
  commit('Add TypeScript');

  await addEslint();
  commit('Add and configure ESLint');

  await addPrettier();
  commit('Add and configure Prettier');

  execSync('yarn fix:prettier');
  commit('Run Prettier on project');

  await addDependency('npm-run-all', { dev: true });
  await addPackageJsonScripts({
    lint: 'run-p lint:eslint lint:types lint:prettier',
  });

  await createScaffold();
  commit('Add app scaffold');

  if (testing) {
    await addTestingLibrary();
    commit('Add jest, Testing Library');
  }
}

async function getAppName() {
  return input({ message: 'What is the name of your app?' });
}

/**
 * Commander requires this signature to be ...args: unknown[]
 * Actual args are:
 *   ([<appName>, <Options hash>, <Command>])
 *   or ([<Options hash>, <Command>]) if <appName> not passed)
 */
export default function createAppAction(...args: unknown[]) {
  // if argument ommitted, args[0] is options
  const appNameArg = (args[0] as string[])[0];
  const options = (args[0] as unknown[])[1] as Options;
  return createApp(appNameArg, options);
}

async function printIntro() {
  print('👖 Let’s get started!');
  print(`\nWe will now perform the following tasks:
  - Create a new app using the latest create-expo-app
  - Add and configure TypeScript
  - Add and configure ESLint
  - Add and configure Prettier
  - Create the project directory structure
  - Install and configure Jest and Testing Library
  `);

  if (!(await confirm({ message: 'Ready to proceed?' }))) {
    process.exit(0);
  }
}

function commit(message: string) {
  execSync('git add .');
  execSync(`git commit -m "${message}"`);
}
