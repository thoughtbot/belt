import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AboutScreen from 'src/screens/AboutScreen/AboutScreen';
import { AboutTabParamList } from './navigatorTypes';

const About = createNativeStackNavigator<AboutTabParamList>();

export default function AboutStack() {
  return (
    <About.Navigator screenOptions={{ headerShown: false }}>
      <About.Screen name="About" component={AboutScreen} />
    </About.Navigator>
  );
}
