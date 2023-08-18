import { program } from 'commander';
import buildAction from './util/buildAction';

export default function runCli() {
  program
    .name('thoughtbelt')
    .description(
      'Perform React Native and Expo setup and redundant tasks without your pants falling down!',
    )

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

  program.showHelpAfterError().parse();
}

runCli();
