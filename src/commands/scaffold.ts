import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { URL, fileURLToPath } from 'url';
import print from '../util/print';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default async function createScaffold() {
  print(chalk.bold('👖 Creating directory structure'));
  print(`
    src/
      components/
      util/
        hooks/
      test/
  `);
  fs.copySync(path.join(dirname, 'templates', 'scaffold', 'src'), './src');
  print('✅ Created directories');
}
