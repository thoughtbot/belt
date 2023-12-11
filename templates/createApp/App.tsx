import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Providers, { Provider } from 'src/components/Providers';

// Add providers to this array
const providers: Provider[] = [
  // CODEGEN:BELT:PROVIDERS - do not remove
];

export default function App() {
  return (
    <Providers providers={providers}>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
