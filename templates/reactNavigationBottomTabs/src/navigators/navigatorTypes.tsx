import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Dashboard: StackScreenProps<DashboardStackParamList>;
  Information: { owner: string } | undefined;
  Settings: undefined;
};

// ❓ Is this the correct type for Stack navigator nested inside of a Tab navigator?
// TODO: Remove this before merging PR... this type isn't used anywhere!
export type CompositeRootStackParamList = CompositeScreenProps<
  BottomTabScreenProps<RootStackParamList, 'Home'>,
  StackScreenProps<DashboardStackParamList>
>;

export type DashboardStackParamList = {
  Home: undefined;
  Information: { owner: string } | undefined;
};

export type SettingsTabParamList = {
  Settings: undefined;
};

export type TabsParamList = {
  Home: NavigatorScreenParams<DashboardStackParamList['Home']>;
  Information: NavigatorScreenParams<DashboardStackParamList['Information']>;
  Settings: SettingsTabParamList;
};

/* ----------------------------------------------------------------
  Derived types -- these should not need to be regularly modified
  -------------------------------------------------------------*/
export type TabName = keyof TabsParamList;
export type RouteName = keyof RootStackParamList;
export type AppRouteName =
  | keyof RootStackParamList
  | keyof DashboardStackParamList
  | keyof SettingsTabParamList;
