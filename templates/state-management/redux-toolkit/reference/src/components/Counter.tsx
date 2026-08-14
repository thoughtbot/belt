import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { decrement, increment } from 'src/store/counterSlice';

// Demonstrates the counter slice end to end. Built from plain React Native
// primitives rather than this app's own themed components — the target
// repo isn't guaranteed to have adopted those conventions, so this stays
// self-contained.
export default function Counter() {
  const count = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.count}>
        {count}
      </Text>
      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrement"
          onPress={() => dispatch(decrement())}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>−</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increment"
          onPress={() => dispatch(increment())}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  count: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonLabel: {
    fontSize: 20,
  },
});
