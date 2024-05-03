import { screen } from '@testing-library/react-native';

import mock from 'src/test/mock';
import { renderApplication } from 'src/test/render';

test('renders', async () => {
  // We would not normally recommend fake timers, but the tests are currently
  // throwing a "not wrapped in act" warning after this test finishes. One
  // option is to put a `await waitForUpdates()` at the end of the test, but
  // fake timers also work here until we find a better solution. The stack trace
  // seems to point to React Navigation bottom tabs.
  jest.useFakeTimers();

  const mocks = [mockCoffees()];

  renderApplication({ mocks });

  expect(await screen.findByRole('header', { name: 'Mocha' })).toBeDefined();
});

function mockCoffees() {
  return mock.get('coffee/hot', {
    response: [
      {
        id: 1,
        title: 'Mocha',
        image: 'htps://placehold.it/200x200',
      },
    ],
  });
}
