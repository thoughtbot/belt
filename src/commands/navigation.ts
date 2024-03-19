import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';
import { globals } from '../constants';

type Options = {
  bottomTabs?: boolean;
};

export async function addNavigation(options: Options = {}) {
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
      '@react-navigation/material-bottom-tabs react-native-paper react-native-vector-icons @expo/vector-icons',
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

// TODO: Document this as a common error/easy fix!

/**
 * Commander requires this signature to be ...args: unknown[]
 * Actual args are:
 *   ([<Options hash>])
 *
 */
export default function addNavigationAction(...args: unknown[]) {
  // if argument ommitted, args[0] is options
  const options = (args[0] as unknown[])[0] as Options;
  return addNavigation(options);
}
