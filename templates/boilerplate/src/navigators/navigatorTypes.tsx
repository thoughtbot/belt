import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
};

// Each tab goes here
export type TabsParamList = {
  DashboardTab: NavigatorScreenParams<DashboardTabParamList>;
  SettingsTab: NavigatorScreenParams<SettingsTabParamList>;
  AboutTab: NavigatorScreenParams<AboutTabParamList>;
};

/* ----------------------------------------------------------------
  For each tab, define all of the screens that can be navigated to
  -------------------------------------------------------------*/

export type DashboardTabParamList = {
  Home: undefined;
  Information: { greeting: string } | undefined;
};

export type AboutTabParamList = {
  About: undefined;
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

/* ----------------------------------------------------------------
  Define ScreenProp type for each screen that might need to access
  navigation or route props
  Usage eg:
    const navigation = useNavigation<HomeScreenProp['navigation']>();
    const params = useRoute<HomeScreenProp['route']>();
  -------------------------------------------------------------*/

export type HomeScreenProp = NativeStackScreenProps<
  DashboardTabParamList,
  'Home'
>;

export type AboutScreenProp = NativeStackScreenProps<
  AboutTabParamList,
  'About'
>;

export type InformationScreenProp = NativeStackScreenProps<
  DashboardTabParamList,
  'Information'
>;
