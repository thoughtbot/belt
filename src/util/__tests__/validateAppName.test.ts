import { input } from '@inquirer/prompts';
import { vol } from 'memfs';
import { Mock, afterEach, describe, expect, test, vi } from 'vitest';
import print from '../print';
import validateAppName from '../validateAppName';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  confirm: vi.fn(),
}));
vi.mock('../../util/print', () => ({ default: vi.fn() }));

afterEach(() => {
  vol.reset();
  (print as Mock).mockReset();
});

describe('validateAppName', () => {
  test('returns the correct camelized application name', async () => {
    (input as Mock).mockReturnValue('my_app');
    const appName = await validateAppName(undefined);

    expect(appName).toBe('MyApp');
  });

  test('returns the correct camelized app name when the application name includes letters and numbers', async () => {
    (input as Mock).mockReturnValue('my321App ');
    const appName = await validateAppName(undefined);

    expect(appName).toBe('My321App');
  });

  test('returns the correct camelized app name when the application name includes spaces', async () => {
    (input as Mock).mockReturnValue('my ');
    const appName = await validateAppName(undefined);

    expect(appName).toBe('My');
  });

  test('returns the correct camelized app name when the application name includes illegal characters', async () => {
    (input as Mock).mockReturnValue('my***App ');
    const appName = await validateAppName(undefined);

    expect(appName).toBe('MyApp');
  });

  test('returns a warning when the application name does not start with a letter', async () => {
    (print as Mock).mockReset();
    vi.spyOn(process, 'exit');
    process.exit = vi.fn();
    (input as Mock).mockReturnValue('123MyApp');
    await validateAppName(undefined);

    expect(print).toHaveBeenCalledWith(
      expect.stringMatching('App name must start with a letter.'),
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(process.exit).toHaveBeenCalledWith(0);
  });
});
