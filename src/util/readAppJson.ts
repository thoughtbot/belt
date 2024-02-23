import fs from 'fs-extra';
import path from 'path';
import { AppJson } from '../types';
import getProjectDir from './getProjectDir';

export default async function readAppJson() {
  const rootDir = await getProjectDir();
  const pkg = await fs.readFile(path.join(rootDir, 'app.json'));
  return JSON.parse(pkg.toString()) as AppJson;
}
