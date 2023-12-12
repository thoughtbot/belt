import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  RenderAPI,
  // eslint-disable-next-line no-restricted-imports
  render as TestingLibraryRender,
} from '@testing-library/react-native';
import { RequestHandler } from 'msw';
import { ReactElement } from 'react';
import Providers, { Provider } from 'src/components/Providers';
import RootNavigator from 'src/navigators/RootNavigator';
import queryClient from 'src/util/api/queryClient';
import server from './server';

export type RenderOptions = {
  mocks?: Array<RequestHandler>;
};

// TODO: this will become customized as the codebase progresses, so our
// tests can be wrapped with appropriate providers, mocks can be supplied, etc
export default function render(
  element: ReactElement,
  { mocks }: RenderOptions = {},
): RenderAPI {
  if (mocks) {
    server.use(...mocks);
  }

  const providers: Provider[] = [
    (children) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    (children) => <NavigationContainer>{children}</NavigationContainer>,
    // CODEGEN:BELT:PROVIDERS - do not remove
  ];

  return TestingLibraryRender(
    <Providers providers={providers}>{element}</Providers>,
  );
}

export function renderApplication(options: RenderOptions = {}) {
  return render(<RootNavigator />, options);
}
