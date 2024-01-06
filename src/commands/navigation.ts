import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';
import { confirm } from '@inquirer/prompts';
import print from '../util/print';

type Options = {
  bottomTabs?: boolean;
};

export default async function addNavigation({ bottomTabs }: Options) {
  const spinner = ora().start('Installing React Navigation');
  const expo = await isExpo();

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

  let addBottomTabsPrompt = false;
  if (!bottomTabs) {
    spinner.succeed();
    addBottomTabsPrompt = await confirm({
      message: 'Would you like to add Bottom Tabs Navigation?',
    });
    if (!addBottomTabsPrompt) {
      process.exit(0);
    }
  }

  const addBottomTabs = bottomTabs || addBottomTabsPrompt;
  if (addBottomTabs) {
    const bottomTabsSpinner = ora().start('Adding Bottom Tabs Navigation');

    await addDependency(
      '@react-navigation/material-bottom-tabs react-native-paper react-native-vector-icons',
    );
    bottomTabsSpinner.succeed();
  }

  await copyTemplateDirectory({
    templateDir: addBottomTabs
      ? 'reactNavigationBottomTabs'
      : 'reactNavigation',
  });

  spinner.succeed(
    'Successfully installed React Navigation and Native Stack navigator',
  );
}
