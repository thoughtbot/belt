import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';

export default async function addNavigation() {
  const spinner = ora().start('Installing React Navigation');
  const expo = await isExpo();

  if (expo) {
    await exec(
      'npx expo install react-native-screens react-native-safe-area-context',
    );
  }
  // what if it is not expo?

  await addDependency(
    '@react-navigation/native @react-navigation/native-stack',
  );

  await copyTemplateDirectory({
    templateDir: 'reactNavigation',
  });

  spinner.succeed(
    'Successfully installed React Navigation and Native Stack navigator',
  );
}
