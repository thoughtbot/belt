import fse from 'fs-extra';
import { fs, vol } from 'memfs';
import { describe, expect, test, vi } from 'vitest';
import copyTemplateDirectory from '../../copyTemplateDirectory';

vi.mock('../../print', () => ({ default: vi.fn() }));

test('copies directory structure to destination, including binary files (based on the extension)', async () => {
  fse.mockTemplates();
  const json = {
    'templates/testing/jest.config.js': '1',
    'templates/testing/src/test/render.ts': '2',
    'templates/testing/assets/splash.png': '3',
  };
  vol.fromJSON(json, './');

  await copyTemplateDirectory({ templateDir: 'testing', destinationDir: '.' });

  expect(fs.readFileSync('jest.config.js', 'utf8')).toEqual('1');
  expect(fs.readFileSync('src/test/render.ts', 'utf8')).toEqual('2');
  expect(fs.readFileSync('assets/splash.png', 'utf8')).toEqual('3');
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
    variables: { expo: true },
  });

  expect(fs.readFileSync('jest.config.js', 'utf8')).toEqual('is expo');
  expect(fs.readFileSync('src/test/render.ts', 'utf8')).toEqual('not foo');

  expect(fs.existsSync('src/test/render.ts.eta')).toBe(false);
});

describe('string substitutions', () => {
  test('performs string substitutions', async () => {
    fse.mockTemplates();
    const json = {
      'templates/boilerplate/app.json': '{ "appName": "BELT_APP_NAME" }',
    };
    vol.fromJSON(json, './');

    await copyTemplateDirectory({
      templateDir: 'boilerplate',
      stringSubstitutions: {
        'app.json': {
          BELT_APP_NAME: 'MyApp',
        },
      },
    });

    expect(fs.readFileSync('app.json', 'utf8')).toEqual(
      '{ "appName": "MyApp" }',
    );
  });

  test('matches file name using regex', async () => {
    fse.mockTemplates();
    const json = {
      'templates/boilerplate/src/app1.json': '{ "appName": "BELT_APP_NAME" }',
    };
    vol.fromJSON(json, './');

    await copyTemplateDirectory({
      templateDir: 'boilerplate',
      stringSubstitutions: {
        'src/app.*.json': {
          BELT_APP_NAME: 'MyApp',
        },
      },
    });

    expect(fs.readFileSync('src/app1.json', 'utf8')).toEqual(
      '{ "appName": "MyApp" }',
    );
  });

  test('matches string to replace using regex', async () => {
    fse.mockTemplates();
    const json = {
      'templates/boilerplate/app.json': '{ "appName": "BELT_APP_NAME" }',
    };
    vol.fromJSON(json, './');

    await copyTemplateDirectory({
      templateDir: 'boilerplate',
      stringSubstitutions: { 'app.json': { 'BELT_.*_NAME': 'MyApp' } },
    });

    expect(fs.readFileSync('app.json', 'utf8')).toEqual(
      '{ "appName": "MyApp" }',
    );
  });
});
