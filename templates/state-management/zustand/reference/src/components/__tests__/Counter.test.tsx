import { fireEvent, screen } from '@testing-library/react-native';
import Counter from 'src/components/Counter';
import useCounterStore from 'src/store/counterStore';
import render from 'src/test/render';

beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

test('renders the current count and increments/decrements on press', () => {
  render(<Counter />);

  expect(screen.getByRole('header')).toHaveTextContent('0');

  fireEvent.press(screen.getByRole('button', { name: 'Increment' }));
  expect(screen.getByRole('header')).toHaveTextContent('1');

  fireEvent.press(screen.getByRole('button', { name: 'Decrement' }));
  fireEvent.press(screen.getByRole('button', { name: 'Decrement' }));
  expect(screen.getByRole('header')).toHaveTextContent('-1');
});
