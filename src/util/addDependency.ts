import { exec } from 'child_process';
import fs from 'fs-extra';
import * as path from 'path';
import getProjectDir from './getProjectDir';

export default async function addDependency(deps: string, { dev = false }) {
  const isYarn = await fs.exists(path.join(await getProjectDir(), 'yarn.lock'));

  if (isYarn) {
    exec(`yarn add ${dev ? '--dev' : ''} ${deps}`);
  } else {
    exec(`npm install ${dev ? '--save-dev' : '--save'} ${deps}`);
  }
}
