import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from 'src/navigators/navigatorTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Information'>;

export default function InformationScreen({ route }: Props) {
  const { params } = route;

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
