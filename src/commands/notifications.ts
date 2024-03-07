import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';
import addAppJsonConfig from '../util/addAppJsonConfig';
import injectHooks from '../util/injectHooks';
import readAppJson from '../util/readAppJson';
import { input } from '@inquirer/prompts';
import commit from '../util/commit';

const handleCommitError = (error: { stdout: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  if (!error.stdout.includes('nothing to commit')) {
    throw error;
  }
};

export default async function addNotifications() {
  const spinner = ora().start('Adding React Native Firebase and dependencies');

  const expo = await isExpo();

  // Install dependencies
  if (expo) {
    await exec(
      'npx expo install @react-native-firebase/app @react-native-firebase/messaging expo-build-properties',
    );
  } else {
    await addDependency(
      '@react-native-firebase/app @react-native-firebase/messaging expo-build-properties',
    );
  }

  await commit('Add React Native Firebase and dependencies').catch(
    handleCommitError,
  );

  spinner.succeed('Added React Native Firebase and dependencies');

  spinner.start('Adding notification handlers');

  await copyTemplateDirectory({
    templateDir: 'notifications',
  });

  await injectHooks(
    'useNotifications();',
    "import useNotifications from 'src/hooks/useNotifications';\n",
  );

  await commit('Add notification handlers').catch(handleCommitError);

  spinner.succeed('Added notification handlers');

  // Verify for bundle identifier and package name in the AppJsonConfig
  const appJson = await readAppJson();

  const packageName =
    appJson.expo?.android?.package ??
    (await input({
      message: 'Define your Android package name:',
      default: 'com.myapp',
    }));

  const bundleIdentifier =
    appJson.expo?.ios?.bundleIdentifier ??
    (await input({
      message: 'Define your iOS bundle identifier:',
      default: packageName,
    }));

  spinner.start('Configuring app.json');

  await addAppJsonConfig({
    expo: {
      android: {
        googleServicesFile: './config/google-services.json',
        package: packageName,
      },
      ios: {
        googleServicesFile: './config/GoogleService-Info.plist',
        bundleIdentifier,
      },
      plugins: [
        '@react-native-firebase/app',
        '@react-native-firebase/messaging',
        [
          'expo-build-properties',
          {
            ios: {
              useFrameworks: 'static',
            },
          },
        ],
      ],
    },
  });

  await commit('Configure app.json').catch(handleCommitError);

  spinner.succeed(
    `Successfully added notifications support to project.

  In order to finish the setup, you need to:
  - Add your google-service.json and GoogleService-Info.plist files to your project's config folder
  - Define your package and bundle identifier in the app.json file
  - Run the command "npx expo prebuild --clean" to rebuild the app
  - Add the ios/ and android/ folders to your .gitignore file if you don't need to track them

  For more details please refer to the official documentation: https://rnfirebase.io/#configure-react-native-firebase-modules.
  `,
  );
}
