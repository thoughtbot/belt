import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import getProjectDir from '../util/getProjectDir';
import print from '../util/print';

export default async function addTypescript() {
  const projectDir = await getProjectDir();

  if (fs.existsSync(path.join(projectDir, 'tsconfig.json'))) {
    print(
      chalk.yellow(
        'tsconfig.json already exists, exiting.\nIf you would like to perform a fresh TypeScript install, delete this file and re-run the script.\n',
      ),
    );
    return;
  }

  const spinner = ora().start('Installing and configuring TypeScript');
  await addDependency('typescript @types/react', { dev: true });

  await copyTemplateDirectory({
    templateDir: 'typescript',
  });

  if (await fs.exists(path.join(projectDir, 'App.js'))) {
    await fs.move(
      path.join(projectDir, 'App.js'),
      path.join(projectDir, 'App.tsx'),
    );
  }

  await addPackageJsonScripts({ 'lint:types': 'tsc' });

  spinner.succeed('TypeScript successfully configured');
}
