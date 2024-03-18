import { globals } from '../constants';
import { input } from '@inquirer/prompts';
import print from './print';
import chalk from 'chalk';

export default async function validatedAppName(
  name: string | undefined,
): Promise<string> {
  if (!name) {
    return getAppName();
  }

  if (name.includes(' ')) {
    const parsedName = parseName(name);

    return validate(parsedName);
  }

  return validate(name);
}

async function getAppName() {
  if (!globals.interactive) {
    throw new Error(
      'App name not provided and running in non-interactive mode, aborting..',
    );
  }

  return input({ message: 'What is the name of your app?' });
}

function validate(name: string) {
  if (name.toLowerCase() === 'belt') {
    printWarning('Please choose a different name than "belt"');
    return getAppName();
  }

  if (/^\d+$/.test(name)) {
    printWarning('App name cannot be a number');
    return getAppName();
  }

  if (!/^[a-z_][a-z0-9_-]+$/i.test(parseName(name))) {
    printWarning('App name can only include letters, numbers, and underscores');
    return getAppName();
  }

  return name;
}

function parseName(appName: string) {
  return appName
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function printWarning(message: string) {
  return print(chalk.yellow(message));
}
