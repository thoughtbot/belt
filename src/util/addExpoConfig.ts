import { ExpoConfig } from '@expo/config';
import mergeWith from 'lodash/mergeWith.js';
import isArray from 'lodash/isArray.js';
import readAppJson from './readAppJson';
import writeFile from './writeFile';

/**
 * add entries to the expo configuration property in app.json
 * @param config - object where key is name, value is command
 */
export default async function addExpoConfig(config: Partial<ExpoConfig>) {
  const appJson = await readAppJson();

  // Merge the config into the appJson
  const updatedAppJson = mergeWith(
    appJson,
    { expo: config },
    (objValue, srcValue) => {
      if (isArray(objValue)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
        return [...new Set([...objValue, ...srcValue])];
      }

      return undefined;
    },
  );

  return writeFile('app.json', JSON.stringify(updatedAppJson), {
    format: true,
  });
}
