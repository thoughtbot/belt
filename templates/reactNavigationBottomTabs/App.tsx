import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'src/navigators/RootNavigator';
import Providers, { Provider } from 'src/components/Providers';
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext';

// Add providers to this array
const providers: Provider[] = [
  (children) => <NavigationContainer>{children}</NavigationContainer>,
  (children) => <SafeAreaProvider>{children}</SafeAreaProvider>,
  // CODEGEN:BELT:PROVIDERS - do not remove
];

export default function App() {
  return (
    <Providers providers={providers}>
      <RootNavigator />
    </Providers>
  );
}
