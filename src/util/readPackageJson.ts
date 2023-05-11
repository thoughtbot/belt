import * as path from 'path';
import getProjectDir from './getProjectDir';
import * as fs from 'fs';

export default async function readPackageJson() {
  const rootDir = await getProjectDir();
  const pkg = await fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8');

  return JSON.parse(pkg.toString());
}
