import path from 'path';
import fs from 'fs-extra';
import { PackageJson } from '../types';
import getProjectDir from './getProjectDir';

export default async function readPackageJson() {
  const rootDir = await getProjectDir();
  const pkg = await fs.readFile(path.join(rootDir, 'package.json'));
  return JSON.parse(pkg.toString()) as PackageJson;
}
