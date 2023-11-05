import fse from 'fs-extra';
import { fs, vol } from 'memfs';
import path from 'path';
import { expect, test, vi } from 'vitest';
import copyTemplateDirectory from '../../copyTemplateDirectory';

vi.mock('../../print', () => ({ default: vi.fn() }));

test('copies directory structure to destination', async () => {
  fse.mockTemplates();
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
  fse.mockTemplates();
  const json = {
    'package.json': '{}',
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
  expect(fs.readFileSync('src/test/render.ts', 'utf8')).toEqual('not foo');

  expect(fs.existsSync('./src/test/render.ts.eta')).toBe(false);
});

test('deletes .keep files if they are no longer necessary', async () => {
  fse.mockTemplates();
  const json = {
    'src/test/.keep': '',
    'templates/sample/src/test/file.txt': '1',
  };
  vol.fromJSON(json, './');

  await copyTemplateDirectory({
    templateDir: 'sample',
    destinationDir: '.',
  });

  expect(fs.readFileSync('./src/test/file.txt', 'utf8')).toEqual('1');
  expect(fs.existsSync('./src/test/.keep')).toBe(false);
});
