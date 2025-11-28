# Setting Up TanStack Query with Belt

When you create a new project with Belt, [TanStack Query](https://tanstack.com/query/latest) (formerly known as React Query) is automatically set up to manage server-state in your React Native application. This setup ensures you have a robust and scalable solution for data fetching, caching, synchronization, and more.

## Installation

Belt installs the necessary dependencies for TanStack Query. The following packages are added to your project:

- `@tanstack/react-query`
- `@tanstack/react-query-devtools`

These dependencies are included in your `package.json` file and installed during the project creation process.

## Configuration

### Query Client

A `queryClient` instance is created and configured in the `queryClient.ts` file with a basic configuration. Retry logic is disabled by default but you can customize it based on your application and back-end behavior.

```tsx
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default queryClient;
```

### Query Client Provider

The `QueryClientProvider` is set up in the main application component to provide the query client to the entire app. This is done in the `App.tsx` file:

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import Providers, { Provider } from 'src/components/Providers';
import RootNavigator from 'src/navigators/RootNavigator';
import queryClient from 'src/util/api/queryClient';

const providers: Provider[] = [
  (children) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
  // CODEGEN:BELT:PROVIDERS - do not remove
];

export default function App() {
  // CODEGEN:BELT:HOOKS - do not remove
  return (
    <Providers providers={providers}>
      <RootNavigator />
    </Providers>
  );
}
```

To demonstrate how to use TanStack Query in your project, Belt includes an example in the `AboutScreen.tsx` file:

## Benefits of Using TanStack Query

1. **Automatic Caching**: TanStack Query automatically caches query results, reducing the need for manual state management.
2. **Background Updates**: Queries can be configured to refetch in the background, ensuring your data is always up-to-date.
3. **Optimistic Updates**: TanStack Query supports optimistic updates, providing a smoother user experience by updating the UI before the server responds.
4. **Error Handling**: Built-in error handling mechanisms make it easier to manage and display errors in your application.

## Customization

The default configuration provided by Belt is designed to meet the needs of most React Native projects, but it can be customized as needed. You can modify the `queryClient` configuration in the `queryClient.ts` file to adjust default options, retry logic, caching and other settings to better fit your project.
