import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { globals } from '../constants';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import getUserPackageManager from '../util/getUserPackageManager';
import print from '../util/print';
import addEslint from './eslint';
import addNavigation from './navigation';
import addPrettier from './prettier';
import createScaffold from './scaffold';
import addTestingLibrary from './testingLibrary';
import addTypescript from './typescript';

type PackageManagerOptions = {
  bun?: boolean;
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
};
type Options = {
  testing?: boolean;
  interactive?: boolean;
  isTest?: boolean;
} & PackageManagerOptions;

export async function createApp(name: string | undefined, options: Options) {
  const { interactive = true, isTest = false, testing = false } = options;

  globals.interactive = interactive;
  globals.isTest = isTest;
  globals.isCreateApp = true;

  const appName = name || (await getAppName());
  await printIntro();

  const spinner = ora('Creating new app with create-expo-app').start();
  await createExpoApp(appName, options);
  spinner.succeed('Created new app with Expo');

  process.chdir(`./${appName}`);

  if (isTest) {
    // since is inside our git repo, the project git repo is not initialized
    await exec('git init');
    await commit('Initial commit');
  }

  // add dependencies that every project will use
  spinner.start('Adding dependencies');
  await exec(
    'npx expo install @react-native-async-storage/async-storage react-native-safe-area-context',
  );
  await addDependency('react-native-keyboard-aware-scrollview');
  await addDependency('create-belt-app', { dev: true });
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

  await addNavigation();
  await commit('Add navigation');

  await copyTemplateDirectory({ templateDir: 'createApp' });
  await commit('Add scaffold');

  print(chalk.green(`\n\n👖 ${appName} successfully configured!`));

  print(`
Your pants are now secure! Each tool was configured as an individual commit.
Take a look at the commits to understand what all was done. For more information
about Belt, visit https://github.com/thoughtbot/belt.
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
  - Install and configure React Navigation
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
// Installs Expo using the specified package manager, or if no package manager
// option specified, try to determine based on which packager is running
// create-belt-app eg. `npx create-belt-app` vs. `bunx create-belt-app`
async function createExpoApp(appName: string, options: Options) {
  const mgr = options.bun
    ? 'bun'
    : options.yarn
    ? 'yarn'
    : options.pnpm
    ? 'pnpm'
    : options.npm
    ? 'npm'
    : getUserPackageManager();

  // running with the right command will result in Expo creating the app
  // using the same package manager
  const command =
    mgr === 'yarn'
      ? 'yarn create expo'
      : mgr === 'pnpm'
      ? 'pnpm create expo@latest'
      : mgr === 'bun'
      ? 'bunx create-expo@latest'
      : 'npx --yes create-expo@latest';

  const fullCommand = `${command} ${appName}`;
  await exec(fullCommand);
}
