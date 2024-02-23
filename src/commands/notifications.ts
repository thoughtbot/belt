import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';

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
      '@react-native-firebase/app @react-native-firebase/messaging',
    );
  }

  await copyTemplateDirectory({
    templateDir: 'notifications',
  });

  spinner.succeed(
    'Successfully installed React Native Firebase and added notification handlers',
  );
}
