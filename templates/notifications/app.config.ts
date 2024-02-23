import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: './config/google-services.json',
  },
  ios: {
    ...config.ios,
    googleServicesFile: './config/GoogleService-Info.plist',
  },
});
