import { fs, vol } from 'memfs';
import { afterEach, describe, expect, test } from 'vitest';
import addNpmrc from '../addNpmrc';

afterEach(() => {
  vol.reset();
});

describe('addNpmrc', () => {
  test('creates .npmrc file in current directory', async () => {
    await addNpmrc();

    const npmrcContent = fs.readFileSync('.npmrc', 'utf8');
    expect(npmrcContent).toContain('legacy-peer-deps=true');
  });
});
