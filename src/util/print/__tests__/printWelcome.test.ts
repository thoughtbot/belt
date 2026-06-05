import { test, vi, expect } from 'vitest';
import chalk from 'chalk';
import printWelcome from '../printWelcome';
import print from '../../print';

vi.mock('../../print', () => ({ default: vi.fn() }));

test('prints welcome message', () => {
  printWelcome();
  expect(print).toHaveBeenNthCalledWith(1, chalk.bold('\n\n\t👖 Belt 👖\n'));
  expect(print).toHaveBeenNthCalledWith(
    2,
    'Perform project setup and redundant tasks\n    without your pants falling down!\n\n',
  );
});
