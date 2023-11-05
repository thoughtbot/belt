import '@testing-library/jest-native/extend-expect';
import { configure } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import mockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler.js';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  __esModule: true,
  default: {
    ignoreLogs: jest.fn(),
    ignoreAllLogs: jest.fn(),
  },
}));

jest.mock(
  'react-native/Libraries/Utilities/BackHandler',
  () => mockBackHandler,
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-keyboard-aware-scroll-view');

// configure debug output for RN Testing Library
// is way too verbose by default. Only include common
// props that might affect test failure.
configure({
  defaultDebugOptions: {
    mapProps({
      accessibilityLabel,
      accessibilityRole,
      accessibilityElementsHidden,
      testID,
      accessibilityViewIsModal,
    }) {
      return {
        accessibilityLabel,
        accessibilityRole,
        accessibilityElementsHidden,
        testID,
        accessibilityViewIsModal,
      };
    },
  },
});
