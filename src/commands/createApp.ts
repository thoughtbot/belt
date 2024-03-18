import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { PACKAGE_ROOT, globals } from '../constants';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import { lockFileNames } from '../util/getPackageManager';
import getUserPackageManager from '../util/getUserPackageManager';
import print from '../util/print';
import validatedAppName from '../util/validateAppName';

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

  const appName = await validatedAppName(name);

  await ensureDirectoryDoesNotExist(appName);
  await printIntro();

  const spinner = ora('Creating app with Belt').start();

  await exec(`mkdir ${appName}`);
  await copyTemplateDirectory({
    templateDir: 'boilerplate',
    destinationDir: appName,
    gitignore: await boilerplateIgnoreFiles(),
    stringSubstitutions: {
      'app.json': {
        BELT_APP_NAME: appName,
      },
      'package.json': {
        belt_app_name: appName.toLowerCase(),
      },
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
Your pants are now secure! For more information about Belt,
visit https://github.com/thoughtbot/belt.
`);
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
  print(`\nWe will now create a new app for you with all of the following goodies:
  - Expo
  - TypeScript
  - Prettier
  - ESLint
  - Jest, React Native Testing Library
  - React Navigation
  - Intuitive directory structure
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

/**
 * Don't copy any files over that are in the boilerplate gitignore.
 * Additionally, don't copy any package manager lockfiles over. This is
 * primarily helpful for development in the case that the developer has run the
 * app directly from the `boilerplate` directory and might have a node_modules
 * directory and lockfile
 */
async function boilerplateIgnoreFiles() {
  const gitignorePath = path.join(
    PACKAGE_ROOT,
    'templates/boilerplate/.gitignore',
  );
  return `
   ${(await fs.readFile(gitignorePath, 'utf8')).toString()}
   ${lockFileNames.join('\n')}
  `;
}
