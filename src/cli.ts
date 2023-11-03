import { program } from 'commander';
import buildAction from './util/buildAction';
import printWelcome from './util/print/printWelcome';

export default function runCli() {
  program
    .name('thoughtbelt')
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

  printWelcome();
  program.parse();
}
