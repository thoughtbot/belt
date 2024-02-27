import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';
import addAppJsonConfig from '../util/addAppJsonConfig';
import injectHooks from '../util/injectHooks';
import addToGitignore from '../util/addToGitignore';

export default async function addNotifications() {
  const spinner = ora().start('Installing React Native Firebase');
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

  await copyTemplateDirectory({
    templateDir: 'notifications',
  });

  await injectHooks(
    'useNotifications();',
    "import useNotifications from 'src/hooks/useNotifications';\n",
  );

  await addToGitignore('android/\nios/');

  await addAppJsonConfig({
    expo: {
      android: {
        googleServicesFile: './config/google-services.json',
        package: '<Define your package here (e.g. com.myapp)>',
      },
      ios: {
        googleServicesFile: './config/GoogleService-Info.plist',
        bundleIdentifier:
          '<Define your bundle identifier here (e.g. com.myapp)>',
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

  spinner.succeed(
    `Successfully installed React Native Firebase and added notification handlers.

In order to finish the setup, you need to:
- Add your google-service.json and GoogleService-Info.plist files to your project's config folder
- Define your package and bundle identifier in the app.json file
- Run the command "npx expo prebuild --clean" to rebuild the app

For more details please refer to the official documentation: https://rnfirebase.io/#configure-react-native-firebase-modules.
`,
  );
}
