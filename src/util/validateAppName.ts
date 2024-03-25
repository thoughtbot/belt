import { globals } from '../constants';
import { input } from '@inquirer/prompts';
import print from './print';
import chalk from 'chalk';
import pkg from 'lodash';

const allNumbersString = /^\d+$/;
const startWithLetter = /^[a-zA-Z].*$/i;

export default async function validateAppName(name: string | undefined) {
  const appName = camelize(name || (await getAppName()));
  console.log('appName', appName);
  if (allNumbersString.test(appName)) {
    printWarning('App name cannot be all numbers.');
    process.exit(0);
  }

  if (!startWithLetter.test(appName)) {
    printWarning('App name must start with a letter.');
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
  const camelizedName = pkg.camelCase(trimmedAppName);
  return pkg.upperFirst(camelizedName);
}

function printWarning(message: string) {
  return print(chalk.yellow(message));
}
