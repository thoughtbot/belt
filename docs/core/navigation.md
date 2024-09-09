## Setting Up Navigation with Belt

When you generate a new React Native project using Belt, it automatically sets up navigation to ensure you have a robust and scalable navigation structure out of the box. Here’s how Belt configures navigation for your project:

### Installation

Belt installs the necessary dependencies for navigation, including React Navigation and related libraries. The following packages are added to your project:

- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`
- `react-native-screens`
- `react-native-safe-area-context`

### Configuration

Belt configures navigation with sensible defaults to get you started quickly. Here’s what Belt sets up:

#### Navigation Container
The `NavigationContainer` is set up in the main application component to manage the navigation tree and state. It is injected in the list of providers in order to wrap other components under the navigation structure. For instance:

   ```tsx
   import { NavigationContainer } from '@react-navigation/native';
   import Providers, { Provider } from 'src/components/Providers';
   import RootNavigator from 'src/navigators/RootNavigator';
   import queryClient from 'src/util/api/queryClient';

   const providers: Provider[] = [
     (children) => <NavigationContainer>{children}</NavigationContainer>,
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
The order of providers added in the `Providers` array will matter, as they are wrapped in reverse order from the array.

#### Root Navigator
The RootNavigator is a central component in the navigation structure of your application. It defines the main navigation stack and serves as the entry point for all other navigators and screens.

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from 'src/screens/HomeScreen';
import AboutScreen from 'src/screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
    );
}
```

## Setting Up Navigator Types with Belt

Belt ensures that your navigation structure is strongly typed by setting up TypeScript types for all navigators and screens. This helps catch errors at compile time and provides better IntelliSense support in your IDE. The types for each navigator are declared in a dedicated file, named `navigatorTypes.tsx`, including type definitions for the root stack, tabs, and individual screens.

### Using Navigator Types

These types are then used throughout the application to ensure type safety. For example, when defining a stack navigator, you can specify the type for the navigator and its screens:

Example: `DashboardStack.tsx`

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import InformationScreen from '../screens/InformationScreen/InformationScreen';
import { DashboardTabParamList } from './navigatorTypes';

const Dashboard = createNativeStackNavigator<DashboardTabParamList>();

export default function DashboardStack() {
  return (
    <Dashboard.Navigator>
      <Dashboard.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Dashboard.Screen name="Information" component={InformationScreen} />
    </Dashboard.Navigator>
  );
}
```

### Benefits of Typed Navigation

1. **Compile-Time Safety**: TypeScript will catch errors related to navigation at compile time, reducing runtime errors.
2. **IntelliSense Support**: IDEs like Visual Studio Code provide better auto-completion and documentation support when types are defined.
3. **Documentation**: Types serve as a form of documentation, making it easier for developers to understand the navigation structure.

By setting up navigator types, your navigation code is robust, maintainable, and easy to understand.

## Testing Navigation

Belt also sets up testing utilities to help you test navigation flows. You can use the `renderApplication` utility to render the entire app with navigation ready for integration tests. 

Example: `App.integration.test.tsx`

```tsx
import { screen, userEvent } from '@testing-library/react-native';
import { renderApplication } from 'src/test/render';

test('renders app, can navigate between screens', async () => {
  renderApplication();

  expect(
    await screen.findByText('Welcome to the Home Screen'),
  ).toBeDefined();

  await userEvent.press(screen.getByText('Go to About'));
  expect(
    await screen.findByText('Welcome to the About Screen'),
  ).toBeDefined();
});
```

As your app development progresses this will give you fine-grain control over simulating specific application states and context.
