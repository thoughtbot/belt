import '@testing-library/jest-native/extend-expect';
import { configure } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import server from 'src/test/server';
import queryClient from 'src/util/api/queryClient';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('expo-font');
jest.mock('expo-asset');

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

jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-keyboard-aware-scroll-view');

// listen with MSW server. Individual tests can pass mocks to 'render' function
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

beforeEach(() => {
  server.resetHandlers();
});

afterEach(() => {
  queryClient.clear();
});

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
