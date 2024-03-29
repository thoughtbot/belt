import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import DashboardStack from './DashboardStack';
import { TabsParamList } from './navigatorTypes';

const Tab = createBottomTabNavigator<TabsParamList>();

function HomeIcon({ focused = false, color = 'gray' }) {
  return <MaterialCommunityIcons name="home" color={color} size={26} />;
}

function AccountIcon({ focused = false, color = 'gray' }) {
  return (
    <MaterialCommunityIcons name="account-circle" color={color} size={26} />
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopColor: '#eee',
          borderTopWidth: 1,
          paddingBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarIcon: AccountIcon,
        }}
      />
    </Tab.Navigator>
  );
}
