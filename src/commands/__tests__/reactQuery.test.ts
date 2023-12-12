import { fs, vol } from 'memfs';
import { Mock, afterEach, expect, test, vi } from 'vitest';
import print from '../../util/print';
import addReactQuery from '../reactQuery';

vi.mock('../../util/addDependency');
vi.mock('../../util/print', () => ({ default: vi.fn() }));

afterEach(() => {
  vol.reset();
  (print as Mock).mockReset();
});

test('installs React Query and copies templates', async () => {
  const json = {
    'package.json': JSON.stringify({
      scripts: {},
      dependencies: {},
    }),
    'tsconfig.json': '1',
    'jest.setup.js': 'import React from "react";\n\n// stuff',
  };

  vol.fromJSON(json, './');

  await addReactQuery();

  expect(fs.existsSync('src/util/api/api.ts')).toBe(true);

  expect(fs.readFileSync('jest.setup.js', 'utf8')).toMatchInlineSnapshot(`
    "import server from 'src/test/server';
    import React from \\"react\\";

    // stuff

    // listen with MSW server. Individual tests can pass mocks to 'render' function
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    afterAll(() => server.close());

    beforeEach(() => {
      server.resetHandlers()
    });
    "
  `);
});

test('creates jest.setup.js if doesnt exist', async () => {
  const json = {
    'package.json': JSON.stringify({
      scripts: {},
      dependencies: {},
    }),
    'tsconfig.json': '1',
    'jest.setup.js': 'import React from "react";\n\n// stuff',
  };

  vol.fromJSON(json, './');

  await addReactQuery();

  expect(fs.existsSync('jest.setup.js')).toBe(true);
});
