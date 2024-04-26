import { NavigationContainer } from '@react-navigation/native';
import {
  RenderAPI,
  // eslint-disable-next-line no-restricted-imports
  render as TestingLibraryRender,
} from '@testing-library/react-native';
import { ReactElement } from 'react';

// TODO: this will become customized as the codebase progresses, so our
// tests can be wrapped with appropriate providers, mocks can be supplied, etc
export default function render(element: ReactElement): RenderAPI {
  return TestingLibraryRender(
    <NavigationContainer>{element}</NavigationContainer>,
  );
}
