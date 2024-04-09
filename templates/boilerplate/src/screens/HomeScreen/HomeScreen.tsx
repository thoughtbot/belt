import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { HomeScreenProp } from 'src/navigators/navigatorTypes';

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProp['navigation']>();

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button
        title="Go to information screen"
        onPress={() => navigation.navigate('Information', { owner: 'Will' })}
      />
      <StatusBar style="auto" />
    </View>
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
