import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import useTheme from 'src/theme/useTheme';

type ButtonProps = TouchableOpacityProps;

export default function PrimaryButton({ style, ...props }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, { backgroundColor: colors.button }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
});
