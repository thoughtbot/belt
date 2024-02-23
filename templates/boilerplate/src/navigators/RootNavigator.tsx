import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from 'src/screens/HomeScreen/HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
