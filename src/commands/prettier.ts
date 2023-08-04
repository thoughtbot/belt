import { log } from 'console';
import fsExtra from 'fs-extra';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import formatFile from '../util/formatFile';
import isPrettierConfigured from '../util/isPrettierConfigured';
import addDependency from '../util/addDependency';
import getProjectDir from '../util/getProjectDir';

export default async function runPrettier() {
  log('Create your Prettier config!');

  const projectDir = await getProjectDir();

  if (await isPrettierConfigured()) {
    log('prettier config file already exists');
  } else {
    if (await fsExtra.exists(path.join(projectDir, '.prettierignore'))) {
      log('.prettierignore config file already exists');
    } else {
      const prettierIgnoreTemplate = await fs.readFileSync(
        path.join(projectDir, 'src', 'templates', '.prettierignore.template'),
        { encoding: 'utf8' }
      );

      await fs.writeFileSync(
        path.join(projectDir, '.prettierignore'),
        prettierIgnoreTemplate
      );
    }

    addDependency('prettier', { dev: true });

    await fs.writeFileSync(
      path.join(projectDir, '.prettierrc'),
      JSON.stringify({
        singleQuote: true,
      })
    );

    await formatFile(path.join(projectDir, '.prettierrc'));
    await formatFile(path.join(projectDir, '.prettierignore'));
    log(chalk.green('🎉 Prettier successfully configured'));
  }
}
