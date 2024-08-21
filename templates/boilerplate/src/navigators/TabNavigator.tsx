import Feather from '@expo/vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import AboutStack from './AboutStack';
import DashboardStack from './DashboardStack';
import { TabsParamList } from './navigatorTypes';

const Tab = createBottomTabNavigator<TabsParamList>();

function HomeIcon({ focused = false, color = 'gray' }) {
  return <Feather name="home" color={color} size={26} />;
}

function AboutIcon({ focused = false, color = 'gray' }) {
  return <Feather name="info" color={color} size={26} />;
}

function AccountIcon({ focused = false, color = 'gray' }) {
  return <Feather name="settings" color={color} size={26} />;
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
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarIcon: HomeIcon,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="AboutTab"
        component={AboutStack}
        options={{
          headerShown: false,
          tabBarIcon: AboutIcon,
          tabBarLabel: 'About',
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarIcon: AccountIcon,
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
