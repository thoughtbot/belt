import { vol } from 'memfs';
import { expect, test, vi } from 'vitest';
import addDependency from '../../util/addDependency';
import copyTemplateDirectory from '../../util/copyTemplateDirectory';
import addNavigation from '../navigation';

vi.mock('../../util/addDependency');
vi.mock('../../util/copyTemplateDirectory');

test('installs React Navigation', async () => {
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

  await addNavigation();

  expect(addDependency).toHaveBeenCalledWith(
    '@react-navigation/native @react-navigation/native-stack',
  );
  expect(copyTemplateDirectory).toHaveBeenCalledWith({
    templateDir: 'reactNavigation',
  });
});
