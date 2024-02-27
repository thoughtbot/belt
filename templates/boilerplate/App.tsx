import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'src/navigators/RootNavigator';
import Providers, { Provider } from 'src/components/Providers';

// Add providers to this array
const providers: Provider[] = [
  (children) => <NavigationContainer>{children}</NavigationContainer>,
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
