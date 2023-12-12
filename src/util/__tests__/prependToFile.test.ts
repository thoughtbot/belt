import { fs, vol } from 'memfs';
import { expect, test } from 'vitest';
import prependToFile from '../prependToFile';

test('prepends contents', async () => {
  const json = {
    'package.json': '1',
    'src/myFile.txt': 'hello world',
  };

  vol.fromJSON(json, './');

  await prependToFile('src/myFile.txt', 'prepended\ntwo');
  expect(fs.readFileSync('src/myFile.txt', 'utf8')).toMatch(
    'prepended\ntwo\nhello world',
  );
});
