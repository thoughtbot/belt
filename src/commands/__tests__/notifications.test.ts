import { fs, vol } from 'memfs';
import { Mock, expect, test, vi } from 'vitest';
import addNotifications from '../notifications';
import addDependency from '../../util/addDependency';
import copyTemplateDirectory from '../../util/copyTemplateDirectory';
import { input } from '@inquirer/prompts';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
}));
vi.mock('../../util/addDependency');
vi.mock('../../util/copyTemplateDirectory');
vi.mock('../../util/getProjectDir', () => ({ default: vi.fn(() => './') }));

test('install React Native Firebase and dependencies', async () => {
  (input as Mock).mockResolvedValueOnce('com.myapp');
  (input as Mock).mockResolvedValueOnce('com.myapp');
  const json = {
    'package.json': JSON.stringify({
      scripts: {},
      dependencies: {},
      devDependencies: {},
    }),
    'yarn.lock': '',
    'App.tsx': '// CODEGEN:BELT:HOOKS - do not remove',
    'app.json': JSON.stringify({}),
  };
  vol.fromJSON(json, './');

  await addNotifications();

  expect(addDependency).toHaveBeenCalledWith(
    '@react-native-firebase/app @react-native-firebase/messaging expo-build-properties',
  );

  expect(copyTemplateDirectory).toHaveBeenCalledWith({
    templateDir: 'notifications',
  });

  const app = fs.readFileSync('App.tsx', 'utf8');
  expect(app).toMatch(
    '// CODEGEN:BELT:HOOKS - do not remove\nuseNotifications();',
  );

  const config = fs.readFileSync('app.json', 'utf8');
  expect(config).toMatch(
    '"googleServicesFile":"./config/google-services.json"',
  );
  expect(config).toMatch(
    '"googleServicesFile":"./config/GoogleService-Info.plist"',
  );
  expect(config).toMatch('"package":"com.myapp"');
  expect(config).toMatch('plugins');
});
