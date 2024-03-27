import { StyleSheet, Pressable, PressableProps, ViewStyle } from 'react-native';

type ButtonProps = PressableProps;

export default function PrimaryButton({
  style,
  ...props
}: {
  style: ViewStyle | undefined;
  props: ButtonProps;
}) {
  return <Pressable style={[styles.button, style]} {...props} />;
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: '#08f',
    borderRadius: 12,
    justifyContent: 'center',
  },
});
