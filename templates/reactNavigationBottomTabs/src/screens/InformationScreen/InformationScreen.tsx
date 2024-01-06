import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function InformationScreen() {
  const { params } = useRoute();
  return (
    <View style={styles.container}>
      <Text>Information Screen</Text>
      <Text>{params?.owner ? `${params.owner}'s Profile` : ''}</Text>
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
