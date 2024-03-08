module.exports = {
  preset: 'jest-expo',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules', 'src/test'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native-community|@react-native|react-native|@react-navigation)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(png|jpg|ttf|woff|woff2)$': '<rootDir>/src/test/fileMock.js',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest.setup.js',
  ],
};
