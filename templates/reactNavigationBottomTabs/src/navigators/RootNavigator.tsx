import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import DashboardStack from './DashboardStack';
import { RootStackParamList } from './navigatorTypes';

const Tab = createMaterialBottomTabNavigator<RootStackParamList>();

function HomeIcon() {
  return function Icon({ focused = false, color = 'gray' }) {
    return <MaterialCommunityIcons name="home" color={color} size={26} />;
  };
}

function AccountIcon() {
  return function Icon({ focused = false, color = 'gray' }) {
    return (
      <MaterialCommunityIcons name="account-circle" color={color} size={26} />
    );
  };
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      barStyle={{ backgroundColor: '#7B7B7B' }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: HomeIcon(),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: AccountIcon(),
        }}
      />
    </Tab.Navigator>
  );
}
