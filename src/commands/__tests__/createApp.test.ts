import { confirm, input } from '@inquirer/prompts';
import { fs, vol } from 'memfs';
import { Mock, afterEach, describe, expect, test, vi } from 'vitest';
import exec from '../../util/exec';
import print from '../../util/print';
import { createApp } from '../createApp';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  confirm: vi.fn(),
}));
vi.mock('../../util/addDependency');
vi.mock('../../util/print', () => ({ default: vi.fn() }));

afterEach(() => {
  vol.reset();
  (print as Mock).mockReset();
});

test('creates app, substituting the app name where appropriate', async () => {
  (confirm as Mock).mockResolvedValueOnce(true);
  vol.fromJSON({ 'file.txt': '{}' }, './');
  await createApp('MyApp');

  expectFileContents('MyApp/package.json', '"name": "my-app"');
  expectFileContents('MyApp/app.json', '"name": "MyApp"');
  expectFileContents('MyApp/app.json', '"slug": "MyApp"');
  expect(exec).toHaveBeenCalledWith('yarn install');
});

test('prompts for app name if not supplied', async () => {
  (confirm as Mock).mockResolvedValueOnce(true);
  (input as Mock).mockReturnValue('MyApp');
  await createApp(undefined);

  expectFileContents('MyApp/package.json', '"name": "my-app"');
  expectFileContents('MyApp/app.json', '"name": "MyApp"');
  expectFileContents('MyApp/app.json', '"slug": "MyApp"');
  expect(exec).toHaveBeenCalledWith('yarn install');
});

test('exits if directory already exists', async () => {
  (print as Mock).mockReset();
  vi.spyOn(process, 'exit');
  process.exit = vi.fn();

  vol.fromJSON({ 'MyApp/package.json': '{}' }, './');

  await createApp('my-app'); // gets sanitized to MyApp

  expect(print).toHaveBeenCalledWith(expect.stringMatching(/already exists/));
  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(process.exit).toHaveBeenCalledWith(0);
});

test('converts directory to camel case and strips special characters', async () => {
  (confirm as Mock).mockResolvedValueOnce(true);
  vol.fromJSON({ 'file.txt': '{}' }, './');
  await createApp('my-$%-app');

  expectFileContents('MyApp/package.json', '"name": "my-app"');
  expectFileContents('MyApp/app.json', '"name": "MyApp"');
  expectFileContents('MyApp/app.json', '"slug": "MyApp"');
  expect(exec).toHaveBeenCalledWith('yarn install');
});

test('exits if app name does not start with a letter', async () => {
  (print as Mock).mockReset();
  vi.spyOn(process, 'exit');
  process.exit = vi.fn();
  vol.fromJSON({ 'MyApp/package.json': '{}' }, './');

  await createApp('555MyApp');

  expect(print).toHaveBeenCalledWith(
    expect.stringMatching('App name must start with a letter.'),
  );
  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(process.exit).toHaveBeenCalledWith(0);
});

describe('package manager options', () => {
  test('creates with NPM', async () => {
    (confirm as Mock).mockResolvedValueOnce(true);
    await createApp('MyApp', { npm: true });
    expect(exec).toHaveBeenCalledWith('npm install');
  });

  test('creates with bun', async () => {
    (confirm as Mock).mockResolvedValueOnce(true);
    await createApp('MyApp', { bun: true });
    expect(exec).toHaveBeenCalledWith('bun install');
  });

  test('creates with pnpm', async () => {
    (confirm as Mock).mockResolvedValueOnce(true);
    await createApp('MyApp', { pnpm: true });
    expect(exec).toHaveBeenCalledWith('pnpm install');
  });
});

function expectFileContents(file: string, expected: string) {
  try {
    const contents = fs.readFileSync(file, 'utf8');
    expect(contents).toMatch(expected);
  } catch (error) {
    Error.captureStackTrace(error as Error, expectFileContents); // remove this function from stack trace
    throw error;
  }
}
