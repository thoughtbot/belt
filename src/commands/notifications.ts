import { input } from '@inquirer/prompts';
import ora from 'ora';
import { globals } from '../constants';
import addExpoConfig from '../util/addExpoConfig';
import commit, { handleCommitError } from '../util/commit';
import confirmToProceed from '../util/confirmToProceed';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import injectHooks from '../util/injectHooks';
import readAppJson from '../util/readAppJson';

type Options = {
  bundleId?: string;
  interactive?: boolean;
};

const INTRO_MESSAGE = `Let's get started!

  We will now add notifications support to your app. This will include the following changes:

  - Add React Native Firebase, Messaging and Expo Build Properties dependencies
  - Add notification handlers to your app
  - Configure your app.json file with the necessary information

  NOTE: React Native Firebase cannot be used in the pre-compiled Expo Go app because React Native Firebase uses native code that is not compiled into Expo Go. This will switch the app build process to use Continuos Native Generation (CGN), for more details please refer to the documentation (https://docs.expo.dev/workflow/continuous-native-generation).
  `;

const SUCCESS_MESSAGE = `Successfully added notifications support to project.

  In order to finish the setup please complete the following steps:
  - Add your google-service.json and GoogleService-Info.plist files to your project's config folder
  - Run the command "npx expo prebuild --clean" to rebuild the app
  - Add the ios/ and android/ folders to your .gitignore file if you don't need to track them

  For more details please refer to the official documentation: https://rnfirebase.io/#configure-react-native-firebase-modules.
  `;

export async function addNotifications(options: Options = {}) {
  const { interactive = true } = options;

  globals.interactive = interactive;

  const { bundleId = !interactive ? 'com.myapp' : undefined } = options;

  await confirmToProceed(INTRO_MESSAGE);

  const spinner = ora().start('Adding React Native Firebase and dependencies');

  try {
    await exec(
      'npx expo install @react-native-firebase/app @react-native-firebase/messaging expo-build-properties',
    );

    spinner.succeed('Added React Native Firebase and dependencies');

    spinner.start('Adding notification handlers');

    await copyTemplateDirectory({
      templateDir: 'notifications',
    });

    await injectHooks(
      'App.tsx',
      'useNotifications();',
      "import useNotifications from 'src/hooks/useNotifications';\n",
    );

    spinner.succeed('Added notification handlers');

    const appJson = await readAppJson();

    const packageName =
      appJson.expo?.android?.package ??
      bundleId ??
      (await input({
        message: 'Define your Android package name:',
        default: 'com.myapp',
      }));

    const bundleIdentifier =
      appJson.expo?.ios?.bundleIdentifier ??
      bundleId ??
      (await input({
        message: 'Define your iOS bundle identifier:',
        default: packageName,
      }));

    spinner.start('Configuring app.json');

    await addExpoConfig({
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
    });

    await commit('Add push notifications support.').catch(handleCommitError);

    spinner.succeed(SUCCESS_MESSAGE);
  } catch (error) {
    spinner.fail((error as Error).message);
    throw error;
  }
}

/**
 * Commander requires this signature to be ...args: unknown[]
 * Actual args are:
 *   ([<Options hash>, <Command>])
 */
export default function addNotificationsAction(...args: unknown[]) {
  // if argument ommitted, args[0] is options
  const options = (args[0] as unknown[])[0] as Options;
  return addNotifications(options);
}
