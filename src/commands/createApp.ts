import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { globals } from '../constants';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import exec from '../util/exec';
import print from '../util/print';
import addEslint from './eslint';
import addPrettier from './prettier';
import createScaffold from './scaffold';
import addTestingLibrary from './testingLibrary';
import addTypescript from './typescript';

type Options = {
  testing?: boolean;
  interactive?: boolean;
  isTest?: boolean;
};

export async function createApp(
  name: string | undefined,
  { interactive = true, isTest = false, testing = false }: Options,
) {
  globals.interactive = interactive;
  globals.isTest = isTest;

  const appName = name || (await getAppName());
  await printIntro();

  const spinner = ora('Creating new app with create-expo-app').start();
  await exec(`npx --yes create-expo-app@latest ${appName}`);
  spinner.succeed('Created new app with Expo');

  process.chdir(`./${appName}`);

  if (isTest) {
    // since is inside our git repo, the project git repo is not initialized
    await exec('git init');
    await commit('Initial commit');
  }
  spinner.start('Adding dependencies');
  // add dependencies that every project will use
  await addDependency(
    [
      'react-native-keyboard-aware-scrollview',
      'react-native-safe-area-context',
      '@react-native-async-storage/async-storage',
    ].join(' '),
  );
  await commit('Add dependencies');
  spinner.succeed('Added dependencies');

  // must add TS before ESLint
  await addTypescript();
  await commit('Add and configure TypeScript');

  await addPrettier();
  await commit('Add and configure Prettier');

  await addEslint();
  await commit('Add and configure ESLint');

  await exec('yarn fix:prettier');
  await commit('Run Prettier on project');

  await addDependency('npm-run-all', { dev: true });
  await addPackageJsonScripts({
    lint: 'run-p lint:eslint lint:types lint:prettier',
  });

  await createScaffold();
  await commit('Add app scaffold');

  if (testing) {
    await addTestingLibrary();
    await commit('Add jest, Testing Library');
  }

  print(chalk.green(`\n\n👖 ${appName} successfully configured!`));

  print(`
Your pants are now secure! Each tool was configured as an individual commit.
Take a look at the commits to understand what all was done. For more information
about thoughtbelt, visit https://github.com/thoughtbot/thoughtbelt.
`);
}

async function getAppName() {
  if (!globals.interactive) {
    throw new Error(
      'App name not provided and running in non-interactive mode, aborting..',
    );
  }

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
  print('Let’s get started!');
  print(`\nWe will now perform the following tasks:
  - Create a new app using the latest create-expo-app
  - Add and configure TypeScript
  - Add and configure Prettier
  - Add and configure ESLint
  - Create the project directory structure
  - Install and configure Jest and Testing Library
  `);

  if (!globals.interactive) {
    return;
  }

  const proceed = await confirm({ message: 'Ready to proceed?' });
  if (!proceed) {
    process.exit(0);
  }

  print(''); // add new line
}

async function commit(message: string) {
  await exec('git add .');
  await exec(`git commit -m "${message}"`);
}
