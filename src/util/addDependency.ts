import exec from './exec';
import getPackageManager from './getPackageManager';

export default async function addDependency(
  deps: string,
  { dev = false } = {},
) {
  const mgr = await getPackageManager();

  if (mgr === 'yarn') {
    await exec(`yarn add ${dev ? '--dev' : ''} ${deps}`);
  } else {
    await exec(`${mgr} install ${dev ? '--save-dev' : '--save'} ${deps}`);
  }
}
