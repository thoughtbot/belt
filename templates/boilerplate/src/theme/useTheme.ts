import {
  Theme,
  useTheme as useNavigationTheme,
} from '@react-navigation/native';
import type { CustomThemeColors } from './colors';

export type CustomTheme = Theme & {
  colors: CustomThemeColors;
};

const useTheme = () => {
  const theme = useNavigationTheme();
  return theme as CustomTheme;
};

export default useTheme;
