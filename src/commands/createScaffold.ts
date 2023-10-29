import chalk from 'chalk';
import { log } from 'console';
import fs from 'fs-extra';
import path from 'path';
import { URL, fileURLToPath } from 'url';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default async function createScaffold() {
  console.log(chalk.bold('👖 Creating directory structure'));
  console.log(`
    src/
      components/
      util/
        hooks/
      test/
  `);
  fs.copySync(path.join(dirname, 'templates', 'scaffold', 'src'), './src');
  log('✅ Created directories');
}
