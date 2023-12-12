import { screen } from '@testing-library/react-native';
import mock from 'src/test/mock';
import { renderApplication } from 'src/test/render';

test('renders', async () => {
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
