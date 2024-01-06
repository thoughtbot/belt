import { vol } from 'memfs';
import { expect, test, vi } from 'vitest';
import addDependency from '../../util/addDependency';
import copyTemplateDirectory from '../../util/copyTemplateDirectory';
import addNavigation from '../navigation';
import { confirm } from '@inquirer/prompts';

vi.mock('@inquirer/prompts', () => ({
  confirm: vi.fn(),
}));
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

  await addNavigation({ bottomTabs: false });

  expect(addDependency).toHaveBeenCalledWith(
    '@react-navigation/native @react-navigation/native-stack',
  );
  expect(copyTemplateDirectory).toHaveBeenCalledWith({
    templateDir: 'reactNavigation',
  });
});

test('installs React Navigation with Bottom Tabs', async () => {
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

  await addNavigation({ bottomTabs: true });

  expect(addDependency).toHaveBeenCalledWith(
    '@react-navigation/native @react-navigation/native-stack',
  );
  expect(confirm).toHaveBeenCalledWith(
    '@react-navigation/material-bottom-tabs react-native-paper react-native-vector-icons',
  );
  expect(addDependency).toHaveBeenCalledWith(
    '@react-navigation/material-bottom-tabs react-native-paper react-native-vector-icons',
  );
  expect(copyTemplateDirectory).toHaveBeenCalledWith({
    templateDir: 'reactNavigationBottomTabs',
  });
});
