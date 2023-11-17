import print from './print';
import readPackageJson from './readPackageJson';
import writeFile from './writeFile';

type Params = {
  overwrite?: boolean;
};
/**
 * add entries to the "scripts" property in Package.json
 * @param values - object where key is name, value is command
 */
export default async function addPackageJsonScripts(
  values: Record<string, string>,
  { overwrite = false }: Params = {},
) {
  const packageJson = await readPackageJson();

  Object.entries(values).forEach(([name, command]) => {
    if (packageJson.scripts[name]) {
      if (overwrite) {
        print(`Overwriting package.json script "${name}".`);
      } else {
        print(
          `package.json already has script "${name}", skipping adding script with value: ${command}`,
        );
      }
    }
    // eslint-disable-next-line no-param-reassign
    packageJson.scripts[name] = command;
  });

  return writeFile('package.json', JSON.stringify(packageJson), {
    format: true,
  });
}
