import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

import requestNotificationPermission from 'src/util/requestNotificationPermission';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Handle background message
});

function useNotifications() {
  useEffect(() => {
    void requestNotificationPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Handle foreground message
    });

    return unsubscribe;
  }, []);
}

export default useNotifications;
