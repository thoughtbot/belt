import { input } from '@inquirer/prompts';
import { execSync, spawnSync } from 'child_process';
import createScaffold from './createScaffold';
import addEslint from './eslint';
import addTypescript from './typescript';

export async function createApp(name: string | undefined) {
  const appName = name || (await getAppName());

  spawnSync('npx', ['--yes', 'create-expo-app@latest', appName], {
    stdio: 'inherit',
  });

  process.chdir(`./${appName}`);

  execSync('git init');
  execSync('git add .');
  execSync('git commit -m "Initial commit"');

  await addTypescript();
  execSync('git add .');
  execSync('git commit -m "Add TypeScript"');

  await addEslint();
  execSync('git add .');
  execSync('git commit -m "Configure ESLint"');

  await createScaffold();
  execSync('git add .');
  execSync('git commit -m "Add app scaffold"');
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
  return createApp(appNameArg);
}
