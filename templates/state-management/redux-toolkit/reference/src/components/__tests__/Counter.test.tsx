import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import Counter from 'src/components/Counter';
import counterReducer from 'src/store/counterSlice';
import render from 'src/test/render';

// A fresh store per test, built from the same reducer as the app's real
// store.ts, keeps tests isolated from each other without needing to reset
// shared state between them.
function renderCounter() {
  const store = configureStore({ reducer: { counter: counterReducer } });

  return render(
    <Provider store={store}>
      <Counter />
    </Provider>,
  );
}

test('renders the current count and increments/decrements on press', () => {
  renderCounter();

  expect(screen.getByRole('header')).toHaveTextContent('0');

  fireEvent.press(screen.getByRole('button', { name: 'Increment' }));
  expect(screen.getByRole('header')).toHaveTextContent('1');

  fireEvent.press(screen.getByRole('button', { name: 'Decrement' }));
  fireEvent.press(screen.getByRole('button', { name: 'Decrement' }));
  expect(screen.getByRole('header')).toHaveTextContent('-1');
});
