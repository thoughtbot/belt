import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import useTheme from 'src/theme/useTheme';

type TextProps = RNTextProps;

export default function Text({ style, ...props }: TextProps) {
  const { colors } = useTheme();

  return <RNText style={[{ color: colors.text }, style]} {...props} />;
}
