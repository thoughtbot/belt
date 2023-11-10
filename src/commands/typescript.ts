import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import addDependency from '../util/addDependency';
import addPackageJsonScripts from '../util/addPackageJsonScripts';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import getProjectDir from '../util/getProjectDir';
import isExpo from '../util/isExpo';
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

  await addDependency('typescript @types/react', { dev: true });

  await copyTemplateDirectory({
    templateDir: 'typescript',
    variables: {
      expo: await isExpo(),
    },
  });

  if (fs.existsSync(path.join(projectDir, 'App.js'))) {
    fs.moveSync(
      path.join(projectDir, 'App.js'),
      path.join(projectDir, 'App.tsx'),
    );
  }

  await addPackageJsonScripts({ 'lint:types': 'tsc' });

  print(
    chalk.green(
      '\n🎉 TypeScript successfully configured\nConsider renaming your existing JS files as .ts or .tsx.\n',
    ),
  );
}
