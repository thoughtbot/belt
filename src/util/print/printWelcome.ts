import chalk from 'chalk';
import print from '../print';

export default function printWelcome() {
  const showVersionCommand =
    process.argv.includes('--version') || process.argv.includes('-V');
  if (showVersionCommand) {
    return;
  }
  print(chalk.bold('\n\n\t👖 Belt 👖\n'));
  print(
    'Perform project setup and redundant tasks\n    without your pants falling down!\n\n',
  );
}
