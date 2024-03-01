import { vol } from 'memfs';
import { beforeEach, expect, test, vi } from 'vitest';
import getPackageManager from '../getPackageManager';

vi.mock('../../print', () => ({ default: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vol.reset();
});

test('returns yarn when yarn.lock present', async () => {
  mockFileExists('yarn.lock');
  expect(await getPackageManager()).toEqual('yarn');
});

test('returns yarn when .yarn present', async () => {
  mockFileExists('.yarn');
  expect(await getPackageManager()).toEqual('yarn');
});

test('returns npm when package-lock.json present', async () => {
  mockFileExists('package-lock.json');
  expect(await getPackageManager()).toEqual('npm');
});

test('returns pnpm when pnpm-lock.yaml present', async () => {
  mockFileExists('pnpm-lock.yaml');
  expect(await getPackageManager()).toEqual('pnpm');
});

test('returns bun when bun.lockb present', async () => {
  mockFileExists('bun.lockb');
  expect(await getPackageManager()).toEqual('bun');
});

test('throws an error if no recognized lockfile', async () => {
  mockFileExists('foobar.lock');
  void expect(async () => getPackageManager()).rejects.toThrowError(
    'Unable to determine package manager.',
  );
});

function mockFileExists(filename: string) {
  vol.fromJSON(
    {
      'package.json': '{}',
      [filename]: '',
    },
    './',
  );
}
