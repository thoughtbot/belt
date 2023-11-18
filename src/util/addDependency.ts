import exec from './exec';
import getPackageManager from './getPackageManager';

export default async function addDependency(
  deps: string,
  { dev = false } = {},
) {
  const mgr = await getPackageManager();

  if (['yarn', 'bun'].includes(mgr)) {
    await exec(`${mgr} add ${dev ? '--dev' : ''} ${deps}`);
  } else {
    await exec(`${mgr} install ${dev ? '--save-dev' : '--save'} ${deps}`);
  }
}
