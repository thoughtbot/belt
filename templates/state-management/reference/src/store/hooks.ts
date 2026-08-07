import useCounterStore from 'src/store/counterStore';

// Typed selector hooks for the counter store. Prefer these over importing
// useCounterStore directly in components: each subscribes to only the slice
// of state it needs, so a component that only calls useIncrement() won't
// re-render when count changes, and vice versa.

export function useCount() {
  return useCounterStore((state) => state.count);
}

export function useIncrement() {
  return useCounterStore((state) => state.increment);
}

export function useDecrement() {
  return useCounterStore((state) => state.decrement);
}
