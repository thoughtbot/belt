import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

type ButtonProps = TouchableOpacityProps;

export default function PrimaryButton({
  style,
  text,
  textStyle,
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, style]}
      {...props}
    />
  );
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
