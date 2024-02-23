import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import { globals } from '../constants';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import getUserPackageManager from '../util/getUserPackageManager';
import print from '../util/print';

type PackageManagerOptions = {
  bun?: boolean;
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
};
type Options = {
  interactive?: boolean;
} & PackageManagerOptions;

export async function createApp(
  name: string | undefined,
  options: Options = {},
) {
  const { interactive = true } = options;

  globals.interactive = interactive;

  const appName = name || (await getAppName());

  await ensureDirectoryDoesNotExist(appName);
  await printIntro();

  const spinner = ora('Creating app with Belt').start();

  await exec(`mkdir ${appName}`);
  await copyTemplateDirectory({
    templateDir: 'boilerplate',
    destinationDir: appName,
    stringSubstitutions: {
      BELT_APP_NAME: appName,
      belt_app_name: appName.toLowerCase(),
    },
  });

  spinner.succeed('Created new Belt app with Expo');

  process.chdir(`./${appName}`);

  spinner.start('Installing dependencies');
  const packageManager = getPackageManager(options);
  await exec(`${packageManager} install`);

  await exec('git init');
  await commit('Initial commit');
  spinner.succeed('Installed dependencies');

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

function getPackageManager(options: Options) {
  return options.bun
    ? 'bun'
    : options.yarn
    ? 'yarn'
    : options.pnpm
    ? 'pnpm'
    : options.npm
    ? 'npm'
    : getUserPackageManager();
}

async function ensureDirectoryDoesNotExist(appName: string) {
  if (await fs.exists(appName)) {
    print(
      chalk.yellow(
        `Whoopsy. The directory ${process.cwd()}/${appName} already exists. Please choose a different name or delete the existing directory.\n`,
      ),
    );
    process.exit(0);
  }
}
