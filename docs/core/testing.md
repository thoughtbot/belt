## Setting Up Testing Library with Belt

When you generate a new React Native project using Belt, it automatically sets up the Testing Library to ensure you have a robust testing environment out of the box. Here’s how Belt configures the Testing Library for your project:

### Installation

Belt installs the necessary dependencies for the Testing Library, including Jest and related testing utilities. The following packages are added to your project:

- `@testing-library/react-native`
- `@testing-library/jest-native`
- `jest`
- `babel-jest`
- `@types/jest`

### Configuration

Belt configures Jest and the Testing Library with sensible defaults to get you started quickly. Here’s what Belt sets up:

- **Jest Configuration**: A pre-configured `jest.config.js` file is added to your project. This configuration includes settings tailored for React Native and Expo.

- **Setup File**: A `jest.setup.js` file is included to configure the testing environment. This file sets up mocks and other configurations needed for testing. Here's a breakdown of what it sets up:

    - Safe Area Context: mock the Safe Area Context to avoid issues related to safe area insets during testing.
    - BackHandler: mock the BackHandler to control back button behavior in tests.
    - Expo Modules: handle Expo-specific modules to avoid issues related to fonts and assets during testing.
    - Mock Service Worker (MSW) Server: sets up a MSW server to intercept network requests during tests, allowing you to mock API responses.
    - Query Client: clears the query client to ensure no stale data is carried over between tests.
    - Debug Output: customizes the debug output of Testing Library to include only common props that might affect test failures, reducing verbosity.

- **Testing Utilities**: Belt includes utility functions like `renderApplication` to simplify rendering components with the necessary providers and mocks.

### Running Tests

You can run these scripts using your package manager:

```sh
# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run all tests and linting
npm run test:all
```
