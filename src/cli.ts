import { program } from 'commander';
import buildAction from './util/buildAction';
import printWelcome from './util/print/printWelcome';
import packageJson from '../package.json';

const typedPackageJson = packageJson;

export default function runCli() {
  program
    .name('Belt')
    .description(
      'Perform React Native and Expo setup and redundant tasks without your pants falling down!',
    )
    .showHelpAfterError();

  program
    .command('create', { isDefault: true })
    .description('Create new app')
    .argument(
      '[appName]',
      'The name of the app and directory it will be created in',
      '',
    )
    .option('--bun', 'Use Bun package manager')
    .option('--yarn', 'Use Yarn package manager')
    .option('--pnpm', 'Use PNPM package manager')
    .option('--npm', 'Use NPM package manager')
    .option('--no-interactive', 'Pass true to skip all prompts')
    .action(buildAction(import('./commands/createApp')));

  program
    .command('eslint')
    .description('Configure ESLint')
    .action(buildAction(import('./commands/eslint')));

  program
    .command('prettier')
    .description('Configure Prettier')
    .action(buildAction(import('./commands/prettier')));

  program
    .command('typescript')
    .description('Install and configure TypeScript')
    .action(buildAction(import('./commands/typescript')));

  program
    .command('testing')
    .description('Install and configure Jest and Testing Library')
    .action(buildAction(import('./commands/testingLibrary')));

  program
    .command('add')
    .description('Add a new feature to your project')
    .command('notifications')
    .description(
      'Install and configure React Native Firebase with Notifications',
    )
    .option(
      '--bundleId',
      'The bundle identifier for your app to be used on both iOS and Android',
    )
    .option(
      '--no-interactive',
      'Pass true to skip all prompts and use default values',
    )
    .action(buildAction(import('./commands/notifications')));

  program.version(
    `The current version of Belt is: ${typedPackageJson.version}`,
  );

  printWelcome();
  program.parse();
}
