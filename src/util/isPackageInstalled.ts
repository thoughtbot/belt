import readPackageJson from './readPackageJson';

export default async function isPackageInstalled(packageName: string) {
  const packageJson = await readPackageJson();

  const isPackageInDevdependencies = packageJson.devDependencies?.hasOwnProperty(packageName);
  const isPackageInDependencies = packageJson.dependencies?.hasOwnProperty(packageName);
  return isPackageInDevdependencies || isPackageInDependencies;
}
