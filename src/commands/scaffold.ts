import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '../constants';
import print from '../util/print';

export default async function createScaffold() {
  print(chalk.bold('👖 Creating directory structure'));
  print(`
    src/
      components/
      util/
        hooks/
      test/
  `);
  fs.copySync(path.join(PACKAGE_ROOT, 'templates/scaffold/src'), './src');
  print('✅ Created directories');
}
