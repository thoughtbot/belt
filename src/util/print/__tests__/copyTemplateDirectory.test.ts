import { fs, vol } from 'memfs';
import path from 'path';
import { expect, test } from 'vitest';
import copyTemplateDirectory from '../../copyTemplateDirectory';

test('copies directory structure to destination', async () => {
  const json = {
    'templates/testing/jest.config.js': '1',
    'templates/testing/src/test/render.ts': '2',
  };
  vol.fromJSON(json, './');

  await copyTemplateDirectory({ templateDir: 'testing', destinationDir: '.' });

  expect(fs.readFileSync('jest.config.js', 'utf8')).toEqual('1');
  expect(fs.readFileSync(path.join('./src/test/render.ts'), 'utf8')).toEqual(
    '2',
  );
});

test('compiles files with .eta file extensions', async () => {
  const json = {
    'templates/testing/jest.config.js.eta':
      '<%= it.expo ? "is expo" : "not expo" %>',
    'templates/testing/src/test/render.ts.eta':
      '<%= it.foo ? "is foo" : "not foo" %>',
  };
  vol.fromJSON(json, './');

  await copyTemplateDirectory({
    templateDir: 'testing',
    destinationDir: '.',
    variables: { expo: true },
  });

  expect(fs.readFileSync('jest.config.js', 'utf8')).toEqual('is expo');
  expect(fs.readFileSync(path.join('./src/test/render.ts'), 'utf8')).toEqual(
    'not foo',
  );

  expect(fs.existsSync('./src/test/render.ts.eta')).toBe(false);
});
