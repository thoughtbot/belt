import chalk from 'chalk';
import * as eta from 'eta';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '../constants';
import addDependency from '../util/addDependency';
import getProjectDir from '../util/getProjectDir';
import getProjectType from '../util/getProjectType';
import print from '../util/print';
import writeFile from '../util/writeFile';

export default async function addTypescript() {
  const projectDir = await getProjectDir();

  if (await fs.exists(path.join(projectDir, 'tsconfig.json'))) {
    print(
      chalk.yellow(
        'tsconfig.json already exists, exiting.\nIf you would like to perform a fresh TypeScript install, delete this file and rerun the script.\n',
      ),
    );
    return;
  }

  await addDependency('typescript @types/react', { dev: true });

  const projectType = await getProjectType();
  const template = await fs.readFile(
    path.join(PACKAGE_ROOT, 'templates/tsconfig.json.eta'),
  );
  const fileContents = eta.render(template.toString(), {
    expo: projectType === 'expo-bare' || projectType === 'expo-managed',
  });

  await writeFile(path.join(projectDir, 'tsconfig.json'), fileContents, {
    format: true,
  });

  print(
    chalk.green(
      '\n🎉 TypeScript successfully configured\nConsider renaming your existing JS files as .ts or .tsx.\n',
    ),
  );
}
