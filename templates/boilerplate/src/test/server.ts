import { setupServer } from 'msw/node';

/**
 * MSW server for mocking network requests
 * server is started in jest.setup.js
 * individual tests can pass mocks to 'render' function
 */
const server = setupServer();
export default server;
