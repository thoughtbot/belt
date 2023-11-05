import { vol } from 'memfs';
import { expect, test, vi } from 'vitest';
import addDependency from '../../util/addDependency';
import addTestingLibrary from '../testingLibrary';

vi.mock('../../util/addDependency');
vi.mock('../../util/print', () => ({
  default: vi.fn(),
}));

test('installs Testing Library', async () => {
  vol.fromJSON({
    'package.json': JSON.stringify({
      scripts: {},
      dependencies: {
        expo: '1.0.0',
      },
      devDependencies: {},
    }),
    'yarn.lock': '',
  });

  await addTestingLibrary();

  expect(addDependency).toHaveBeenCalled();
});
