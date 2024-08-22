import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import InformationScreen from '../screens/InformationScreen/InformationScreen';
import { DashboardTabParamList } from './navigatorTypes';

const Dashboard = createNativeStackNavigator<DashboardTabParamList>();

export default function DashboardStack() {
  return (
    <Dashboard.Navigator>
      <Dashboard.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Dashboard.Screen name="Information" component={InformationScreen} />
    </Dashboard.Navigator>
  );
}
