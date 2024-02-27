import merge from 'lodash/merge.js';
import print from './print';
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
  merge(appJson, values);

  return writeFile('app.json', JSON.stringify(appJson), {
    format: true,
  });
}
