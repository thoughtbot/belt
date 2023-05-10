import { program } from 'commander';
import buildAction from './util/buildAction';

console.log('React Native 🎉');

export default function runCli() {
  program
    .name('thoughtbelt')
    .description(
      'Perform React Native and Expo setup and redundant tasks without your pants falling down!'
    )

    .command('eslint')
    .description('Configure ESLint')
    .action(buildAction(import('./commands/eslint')));

  program
    .command('prettier')
    .description('Configure Prettier')
    .action(buildAction(import('./commands/prettier')));

  program.showHelpAfterError().parse();
}

runCli();
