import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';
import { globals } from '../constants';

type Options = {
  bottomTabs?: boolean;
};

export default async function addNavigation(options: Options) {
  const spinner = ora().start('Installing React Navigation');
  const expo = await isExpo();

  const { bottomTabs = false } = options;
  globals.addBottomTabs = bottomTabs;

  if (expo) {
    await exec(
      'npx expo install react-native-screens react-native-safe-area-context',
    );
  } else {
    await addDependency('react-native-screens react-native-safe-area-context');
  }

  await addDependency(
    '@react-navigation/native @react-navigation/native-stack',
  );

  if (bottomTabs) {
    const bottomTabsSpinner = ora().start('Adding Bottom Tabs Navigation');

    await addDependency(
      '@react-navigation/material-bottom-tabs react-native-paper react-native-vector-icons',
    );
    bottomTabsSpinner.succeed();
  }

  await copyTemplateDirectory({
    templateDir: bottomTabs ? 'reactNavigationBottomTabs' : 'reactNavigation',
  });

  spinner.succeed(
    `Successfully installed React Navigation ${
      bottomTabs ? 'Bottom Tab Navigation,' : ''
    } and Native Stack navigator`,
  );
}
