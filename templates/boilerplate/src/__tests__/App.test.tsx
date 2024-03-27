import { screen } from '@testing-library/react-native';
import RootNavigator from 'src/navigators/RootNavigator';
import render from 'src/test/render';

test('renders', async () => {
  jest.useFakeTimers();
  render(<RootNavigator />);
  expect(await screen.findByText(/Open up App.tsx/)).toBeDefined();
});
