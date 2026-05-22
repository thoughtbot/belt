interface Config {
  apiBaseUrl: string;
}

export default function getConfig(): Config {
  return {
    // process.env.EXPO_PUBLIC_* variables are inlined at build time by the Expo bundler.
    // Always use dot notation — bracket notation and destructuring are not supported.
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  };
}
