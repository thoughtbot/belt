import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import Providers, { Provider } from 'src/components/Providers';
import RootNavigator from 'src/navigators/RootNavigator';
import queryClient from 'src/util/api/queryClient';
import { lightThemeColors, darkThemeColors } from 'src/theme/colors';

// Add providers to this array. They will be wrapped around the app, with the
// first items in the array wrapping the last items in the array.
const providers: Provider[] = [
  (children) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;

    return (
      <NavigationContainer
        theme={{
          dark: colorScheme === 'dark',
          colors,
        }}
      >
        {children}
      </NavigationContainer>
    );
  },
  (children) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
  // CODEGEN:BELT:PROVIDERS - do not remove
];

export default function App() {
  // CODEGEN:BELT:HOOKS - do not remove
  return (
    <Providers providers={providers}>
      <RootNavigator />
    </Providers>
  );
}
