import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import ora from 'ora';
import path from 'path';
import { PACKAGE_ROOT, globals } from '../constants';
import commit from '../util/commit';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import { lockFileNames } from '../util/getPackageManager';
import getUserPackageManager from '../util/getUserPackageManager';
import print from '../util/print';
import validateAndSanitizeAppName from '../util/validateAndSanitizeAppName';

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
  const appName = await validateAndSanitizeAppName(name);

  await ensureDirectoryDoesNotExist(appName);
  await printIntro(appName);
  const spinner = ora('Creating app with Belt').start();

  try {
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
          belt_app_name: _.kebabCase(appName),
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
Your pants are now secure! To get started with your new app:

cd ${appName}
${packageManager} run ios
${packageManager} run android

For more information about Belt, visit https://github.com/thoughtbot/belt.
`);
  } catch (e) {
    spinner.fail('An error occurred creating the app\n');
    if (e instanceof Error) {
      print(chalk.red(e.message));
    }
    process.exit(1);
  }
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

async function printIntro(appName: string) {
  print('Let’s get started!');
  print(`\nWe will now create a new app in ./${chalk.bold(
    appName,
  )} for you with all of the following goodies:

  - Expo
  - TypeScript
  - Prettier
  - ESLint
  - Jest, React Native Testing Library
  - React Navigation
  - TanStack Query (formerly known as React Query)
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
    'templates/boilerplate/.gitignore.eta',
  );
  return `
   ${(await fs.readFile(gitignorePath, 'utf8')).toString()}
   ${lockFileNames.join('\n')}
  `;
}
