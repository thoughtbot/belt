import chalk from 'chalk';
import print from '../print';

export default function printWelcome() {
  print(chalk.bold('\n\n\t👖 thoughtbelt 👖\n'));
  print(
    'Perform project setup and redundant tasks\n    without your pants falling down!\n\n',
  );
}
