import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
};

export type TabsParamList = {
  DashboardTab: NavigatorScreenParams<DashboardTabParamList>;
  SettingsTab: NavigatorScreenParams<SettingsTabParamList>;
};

export type DashboardTabParamList = {
  Home: undefined;
  Information: { owner: string } | undefined;
};

export type SettingsTabParamList = {
  Settings: undefined;
};

/* ----------------------------------------------------------------
  Derived types -- these should not need to be frequently modified
  -------------------------------------------------------------*/
export type TabName = keyof TabsParamList;
export type RootRouteName = keyof RootStackParamList;
export type AppRouteName =
  | keyof RootStackParamList
  | keyof DashboardTabParamList
  | keyof SettingsTabParamList;

export type HomeScreenProp = NativeStackScreenProps<
  DashboardTabParamList,
  'Home'
>;

export type InformationScreenProp = NativeStackScreenProps<
  DashboardTabParamList,
  'Information'
>;
