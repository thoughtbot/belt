import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';

export type CustomThemeColors = Theme['colors'] & {
  button: string;
};

export const lightThemeColors: CustomThemeColors = {
  ...DefaultTheme.colors,
  button: '#08f',
};

export const darkThemeColors: CustomThemeColors = {
  ...DarkTheme.colors,
  button: '#08f',
};
