import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { PermissionStatus, PermissionsAndroid, Platform } from 'react-native';

export default async function requestNotificationsPermission(): Promise<
  FirebaseMessagingTypes.AuthorizationStatus | PermissionStatus
> {
  if (Platform.OS === 'ios') {
    return messaging().requestPermission();
  }

  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
}
