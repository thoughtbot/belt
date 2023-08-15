import readPackageJson from './readPackageJson';

export default async function isPackageInstalled(packageName: string) {
  const packageJson = await readPackageJson();

  const isPackageInDevdependencies = Object.prototype.hasOwnProperty.call(
    packageJson.dependencies,
    packageName,
  );
  const isPackageInDependencies = Object.prototype.hasOwnProperty.call(
    packageJson.devDependencies,
    packageName,
  );
  return isPackageInDevdependencies || isPackageInDependencies;
}
