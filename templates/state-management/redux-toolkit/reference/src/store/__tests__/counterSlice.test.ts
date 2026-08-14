import counterReducer, { decrement, increment } from 'src/store/counterSlice';

test('increment increases count by 1', () => {
  const state = counterReducer(undefined, increment());

  expect(state.count).toBe(1);
});

test('decrement decreases count by 1', () => {
  const state = counterReducer(undefined, decrement());

  expect(state.count).toBe(-1);
});
