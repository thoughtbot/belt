import { NavigatorScreenParams } from '@react-navigation/native';
// add types for navigation here
// key: screen name
// value: params (use undefined if accepts none)
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
};

export type TabsParamList = {
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  SettingsTab: NavigatorScreenParams<SettingsTabParamList>;
};

export type HomeTabParamList = {
  Home: undefined;
  Information: { owner: string } | undefined;
};

export type SettingsTabParamList = {
  Settings: undefined;
};

/* ----------------------------------------------------------------
  Derived types -- these should not need to be regularly modified
  -------------------------------------------------------------*/
export type TabName = keyof TabsParamList;
export type RouteName = keyof RootStackParamList;
export type AppRouteName =
  | keyof RootStackParamList
  | keyof HomeTabParamList
  | keyof SettingsTabParamList;
