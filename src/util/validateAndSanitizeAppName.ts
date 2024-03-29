import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import _ from 'lodash';
import { globals } from '../constants';
import print from './print';

const startWithLetter = /^[a-zA-Z].*$/i;

export default async function validateAndSanitizeAppName(
  name: string | undefined,
) {
  const appName = camelize(name || (await getAppName()));

  if (!appName) {
    printWarning("\nPants required! App name can't be blank.");
    process.exit(0);
  }

  if (!startWithLetter.test(appName)) {
    printWarning('\nApp name must start with a letter.');
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
  return _.upperFirst(_.camelCase(appName.trim()));
}

function printWarning(message: string) {
  return print(chalk.yellow(message));
}
