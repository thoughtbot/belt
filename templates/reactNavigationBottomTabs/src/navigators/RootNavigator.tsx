import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

const navigatorScreenOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
};

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={navigatorScreenOptions}>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/*
        screens that are navigable outside of tabs go here. This can include:
          - authentication screens (only render tab navigator conditionally)
          - screens that should not display bottom tab bar and that might be
            navigated to from a screen from multiple tabs
        */}
    </Stack.Navigator>
  );
}
