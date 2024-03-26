import ora from 'ora';
import addDependency from '../util/addDependency';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import exec from '../util/exec';
import isExpo from '../util/isExpo';
import { globals } from '../constants';

type Options = {
  bottomTabs?: boolean;
};

async function addNavigation(options: Options = {}) {
  const { bottomTabs = false } = options;
  globals.addBottomTabs = bottomTabs;

  const spinner = ora().start(
    `Installing React Navigation ${
      bottomTabs ? 'with Bottom Tab Navigation' : ''
    }`,
  );
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

  if (bottomTabs) {
    await addDependency(
      '@react-navigation/bottom-tabs @react-navigation/material-bottom-tabs @react-navigation/stack @expo/vector-icons react-native-paper react-native-vector-icons',
    );
  }

  await copyTemplateDirectory({
    templateDir: bottomTabs ? 'reactNavigationBottomTabs' : 'reactNavigation',
  });

  spinner.succeed(
    `Successfully installed React Navigation and ${
      bottomTabs ? 'Tab' : 'Native'
    } Stack navigator.`,
  );
}

// TODO: Document this as a common error/easy fix!

/**
 * Commander requires this signature to be ...args: unknown[]
 * Actual args are:
 *   ([<Options hash>])
 */
export default function addNavigationAction(...args: unknown[]) {
  // if argument ommitted, args[0] is options
  const options = args[0] as object[] as Options;
  return addNavigation(options);
}
