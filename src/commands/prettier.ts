import { log } from 'console';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';
import * as eta from 'eta';
import isPrettierConfigured from '../util/isPrettierConfigured';
import addDependency from '../util/addDependency';
import getProjectDir from '../util/getProjectDir';
import writeFile from '../util/writeFile';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default async function runPrettier() {
  const projectDir = await getProjectDir();
  const eslintJsFile = path.join(projectDir, '.eslintrc.js');
  const eslintJSONFile = path.join(projectDir, '.eslintrc.json');

  if (await isPrettierConfigured()) {
    log('prettier config file already exists');
  } else if (
    (await fs.exists(eslintJsFile)) ||
    (await fs.exists(eslintJSONFile))
  ) {
    log(
      'We noticed ESLint is already set up, you might consider adding the Prettier ESLint plugin or regenerating with suspenders eslint.',
    );
  } else {
    if (await fs.exists(path.join(projectDir, '.prettierignore'))) {
      log('.prettierignore config file already exists');
    } else {
      const prettierIgnoreTemplate = await fs.readFile(
        path.join(dirname, 'templates', 'prettierignore.eta'),
      );
      const fileContents = eta.render(prettierIgnoreTemplate.toString(), {});

      await writeFile(path.join(projectDir, '.prettierignore'), fileContents, {
        format: true,
      });
    }

    await addDependency('prettier', { dev: true });

    await writeFile(
      path.join(projectDir, '.prettierrc'),
      JSON.stringify({
        singleQuote: true,
      }),
      {
        format: true,
      },
    );

    log(chalk.green('🎉 Prettier successfully configured'));
  }
}
