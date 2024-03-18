import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import InformationScreen from '../screens/InformationScreen/InformationScreen';
import { HomeTabParamList } from './navigatorTypes';

const Dashboard = createNativeStackNavigator<HomeTabParamList>();

export default function DashboardStack() {
  return (
    <Dashboard.Navigator>
      <Dashboard.Screen name="Home" component={SearchScreen} />
      <Dashboard.Screen name="Information" component={InformationScreen} />
    </Dashboard.Navigator>
  );
}
