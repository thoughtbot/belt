import addDependency from '../util/addDependency';
import appendToFile from '../util/appendToFile';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import prependToFile from '../util/prependToFile';

export default async function addReactQuery() {
  await addDependency('@tanstack/react-query axios msw');
  await copyTemplateDirectory({ templateDir: 'reactQuery' });
  await prependToFile('jest.setup.js', "import server from 'src/test/server';");
  await appendToFile(
    'jest.setup.js',
    `
// listen with MSW server. Individual tests can pass mocks to 'render' function
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

beforeEach(() => {
  server.resetHandlers()
});
`,
  );
}
