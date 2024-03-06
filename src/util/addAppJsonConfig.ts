import mergeWith from 'lodash/mergeWith.js';
import isArray from 'lodash/isArray.js';
import readAppJson from './readAppJson';
import writeFile from './writeFile';
import { AppJson } from '../types';

/**
 * add entries to the expo configuration property in app.json
 * @param values - object where key is name, value is command
 */
export default async function addAppJsonConfig(values: AppJson) {
  const appJson = await readAppJson();

  // Merge the values into the appJson
  mergeWith(appJson, values, (objValue, srcValue) => {
    if (isArray(objValue)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
      return [...new Set([...objValue, ...srcValue])];
    }

    return undefined;
  });

  return writeFile('app.json', JSON.stringify(appJson), {
    format: true,
  });
}
