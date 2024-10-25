import { test, vi, describe, expect, beforeEach } from 'vitest';
import chalk from 'chalk';
import printWelcome from '../printWelcome';

const consoleSpy = vi.spyOn(console, 'log');

describe('printWelcome', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  test('prints introduction message', () => {
    process.argv = ['node', 'script.js', 'create'];
    printWelcome();
    expect(console.log).toHaveBeenCalledWith(chalk.bold('\n\n\t👖 Belt 👖\n'));
  });

  describe('does not print introduction message for version', () => {
    test('works for --version', () => {
      process.argv = ['node', 'script.js', '--version'];
      printWelcome();
      expect(consoleSpy.mock.calls.length).toBe(0);
    });
    test('works for -V', () => {
      process.argv = ['node', 'script.js', '-V'];
      printWelcome();
      expect(consoleSpy.mock.calls.length).toBe(0);
    });
  });
});
