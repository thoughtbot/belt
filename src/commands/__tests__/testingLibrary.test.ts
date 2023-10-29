import { vol } from 'memfs';
import { expect, test, vi } from 'vitest';
import addDependency from '../../util/addDependency';
import addTestingLibrary from '../testingLibrary';

vi.mock('../../util/addDependency');
vi.mock('../../util/print', () => ({
  // __esModule: true,
  default: vi.fn(),
}));

test('installs Testing Library', async () => {
  vol.fromJSON({
    'package.json': JSON.stringify({
      dependencies: {
        expo: '1.0.0',
      },
      devDependencies: {},
    }),
  });

  await addTestingLibrary();

  expect(addDependency).toHaveBeenCalled();
});
