import { confirm, input } from '@inquirer/prompts';
import { execSync, spawnSync } from 'child_process';
import print from '../util/print';
import addEslint from './eslint';
import createScaffold from './scaffold';
import addTestingLibrary from './testingLibrary';
import addTypescript from './typescript';

type Options = {
  testing: boolean;
};

export async function createApp(
  name: string | undefined,
  { testing }: Options,
) {
  const appName = name || (await getAppName());
  await printIntro();

  spawnSync('npx', ['--yes', 'create-expo-app@latest', appName], {
    stdio: 'inherit',
  });

  process.chdir(`./${appName}`);

  await addTypescript();
  execSync('git add .');
  execSync('git commit -m "Add TypeScript"');

  await addEslint();
  execSync('git add .');
  execSync('git commit -m "Configure ESLint"');

  await createScaffold();
  execSync('git add .');
  execSync('git commit -m "Add app scaffold"');

  if (testing) {
    await addTestingLibrary();
    execSync('git add .');
    execSync('git commit -m "Add jest, Testing Library"');
  }
}

async function getAppName() {
  return input({ message: 'What is the name of your app?' });
}

/**
 * Commander requires this signature to be ...args: unknown[]
 * Actual args are:
 *   ([<appName>, <Options hash>, <Command>])
 *   or ([<Options hash>, <Command>]) if <appName> not passed)
 */
export default function createAppAction(...args: unknown[]) {
  // if argument ommitted, args[0] is options
  const appNameArg = (args[0] as string[])[0];
  const options = (args[0] as unknown[])[1] as Options;
  return createApp(appNameArg, options);
}

async function printIntro() {
  print('👖 Let’s get started!');
  print(`\nWe will now perform the following tasks:
  - Create a new app using the latest create-expo-app
  - Add and configure TypeScript
  - Add and configure ESLint
  - Add and configure Prettier
  - Create the project directory structure
  `);

  if (!(await confirm({ message: 'Ready to proceed?' }))) {
    process.exit(0);
  }
}
