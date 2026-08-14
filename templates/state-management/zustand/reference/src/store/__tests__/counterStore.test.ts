import { act, renderHook } from '@testing-library/react-native';
import useCounterStore from 'src/store/counterStore';

beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

test('increment increases count by 1', () => {
  const { result } = renderHook(() => useCounterStore());

  act(() => result.current.increment());

  expect(result.current.count).toBe(1);
});

test('decrement decreases count by 1', () => {
  const { result } = renderHook(() => useCounterStore());

  act(() => result.current.decrement());

  expect(result.current.count).toBe(-1);
});
