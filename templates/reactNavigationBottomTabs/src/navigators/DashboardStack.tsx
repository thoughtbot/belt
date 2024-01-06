import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import InformationScreen from '../screens/InformationScreen/InformationScreen';
import { TabsParamList } from './navigatorTypes';

const Dashboard = createNativeStackNavigator<TabsParamList>();
export const DashboardStack = () => {
  return (
    <>
      <Dashboard.Navigator>
        <Dashboard.Screen name="Search" component={SearchScreen} />
        <Dashboard.Screen name="Information" component={InformationScreen} />
      </Dashboard.Navigator>
    </>
  );
};
