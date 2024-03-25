import { globals } from '../constants';
import { input } from '@inquirer/prompts';
import print from './print';
import chalk from 'chalk';
import { camelCase, upperFirst } from 'lodash';

export default async function validateAppName(name: string | undefined) {
  const appName = camelize(name || (await getAppName()));
  console.log(appName)
  if (/^\d+$/.test(appName)) {
    printWarning('App name cannot be all numbers.');
    process.exit(0);
  }

  if (!/^[a-zA-Z].*$/i.test(appName)) {
    printWarning(
      'App name must start with a letter.',
    );
    process.exit(0);
  }

  return appName;
}

async function getAppName() {
  if (!globals.interactive) {
    throw new Error(
      'App name not provided and running in non-interactive mode, aborting..',
    );
  }

  return input({ message: 'What is the name of your app?' });
}

function camelize(appName: string) {
  const trimmedAppName = appName.trim();
  const camelizedName = camelCase(trimmedAppName);
  return upperFirst(camelizedName);
}

function printWarning(message: string) {
  return print(chalk.yellow(message));
}
