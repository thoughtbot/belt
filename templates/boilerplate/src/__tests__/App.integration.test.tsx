import { screen, userEvent } from '@testing-library/react-native';

import mock from 'src/test/mock';
import { renderApplication } from 'src/test/render';
import { GithubProjectsResponse } from 'src/util/api/api';

// Testing philosophy:
// - Tests that render the entire application with `renderApplication` go in the
//   top level `src/__tests__` directory and are named with `mytest.integration.test.tsx`.
//   These are ideal for when you need to test flows that include navigation between screens
// - Tests that render a single screen or component are colocated in
//   `__tests__/MyComponent.test.tsx`. These call `render` and are not able to
//   navigate between screens, since the Navigator is not mounted
test('renders app, can navigate between screens', async () => {
  jest.useFakeTimers();

  const mocks = [mockGitHubProjects()];

  // load the app on the Home screen
  renderApplication({ mocks });
  expect(
    await screen.findByRole('header', { name: /Welcome to your new app/ }),
  ).toBeDefined();

  // go to About tab
  await userEvent.press(screen.getByRole('button', { name: /About/ }));
  expect(
    await screen.findByRole('header', { name: 'Open Source' }),
  ).toBeDefined();

  // expect GitHub project loaded via API
  expect(await screen.findByText(/Belt is a CLI/)).toBeDefined();
});

// TODO: sample data, remove
// creates a mock for a GET request to the GitHub projects API.
// Pass this mock to `render` or `renderApplication` to register it with MSW.
// Recommended to place these mocks in a central location like `src/test/mocks`
function mockGitHubProjects() {
  return mock.get<GithubProjectsResponse, null>(
    'https://github-projects-api.vercel.app/api/projects',
    {
      response: {
        projects: [
          {
            id: 635980144,
            name: 'belt',
            description:
              'Belt is a CLI for starting a new React Native Expo app and will even keep your pants secure as you continue development.',
            url: 'https://github.com/thoughtbot/belt',
            stars: 8,
            forks: 0,
          },
        ],
      },
    },
  );
}
