import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { InformationScreenProp } from 'src/navigators/navigatorTypes';
import Text from 'src/components/Text';

export default function InformationScreen() {
  const { params } = useRoute<InformationScreenProp['route']>();

  return (
    <View style={styles.container}>
      {params && <Text style={{ fontSize: 22 }}>{params.greeting}</Text>}
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
