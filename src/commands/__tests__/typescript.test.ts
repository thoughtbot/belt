import { fs, vol } from 'memfs';
import { Mock, afterEach, expect, test, vi } from 'vitest';
import addDependency from '../../util/addDependency';
import print from '../../util/print';
import addTypescript from '../typescript';

vi.mock('fs-extra');
vi.mock('../../util/addDependency');
vi.mock('../../util/print', () => ({
  // __esModule: true,
  default: vi.fn(),
}));

afterEach(() => {
  vol.reset();
  (print as Mock).mockReset();
});

test('exits with message if tsconfig.json already exists', async () => {
  const json = {
    'package.json': '{}',
    'tsconfig.json': '1',
  };
  vol.fromJSON(json, './');

  await addTypescript();
  expect(print).toHaveBeenCalledWith(
    expect.stringMatching(/tsconfig\.json already exists/),
  );

  // doesn't modify
  expect(fs.readFileSync('tsconfig.json', 'utf8')).toEqual('1');
});

test('writes new tsconfig.json, adds dependencies', async () => {
  vol.fromJSON({
    'package.json': JSON.stringify({
      dependencies: {
        expo: '1.0.0',
      },
    }),
  });

  await addTypescript();

  expect(addDependency).toHaveBeenCalledWith('typescript @types/react', {
    dev: true,
  });

  expect(fs.readFileSync('tsconfig.json', 'utf8')).toMatch(
    '"extends": "expo/tsconfig.base"',
  );

  expect(print).not.toHaveBeenCalledWith(
    expect.stringMatching(/already exists/),
  );
});

test("doesn't extend expo/tsconfig.base if not an Expo project", async () => {
  vol.fromJSON({
    'package.json': JSON.stringify({
      dependencies: {},
    }),
  });

  await addTypescript();

  expect(addDependency).toHaveBeenCalledWith('typescript @types/react', {
    dev: true,
  });

  expect(fs.readFileSync('tsconfig.json', 'utf8')).not.toMatch(
    'expo/tsconfig.base',
  );
});
