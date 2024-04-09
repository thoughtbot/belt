import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { InformationScreenProp } from 'src/navigators/navigatorTypes';

export default function InformationScreen() {
  const { params } = useRoute<InformationScreenProp['route']>();

  return (
    <View style={styles.container}>
      <Text>Information Screen</Text>
      {params && <Text>{params.owner}’s Profile</Text>}
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
