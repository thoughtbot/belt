## TypeScript Configuration Overview

When you create a new project with Belt, a pre-configured `tsconfig.json` file is automatically added to your project’s root directory. This configuration provides a solid foundation for using TypeScript in React Native, with settings that focus on improving code quality and catching errors early. This is a list of belt specific configurations:

- **Strict Type-Checking**: enforces strict type-checking (`strict: true`) to catch potential issues early.
- **Force Consistent Casing**: adds `forceConsistentCasingInFileNames: true` to ensure consistent file naming across the project.
- **Custom Module Paths**: defines paths for `src/*` and `assets/*`, making imports more convenient.
- **Expanded Inclusions**: includes additional file types in the include section (`*.js`, `.*.js`, `__mocks__`).
- **No Fallthrough in Switch Cases**: includes `noFallthroughCasesInSwitch: true` to prevent errors in switch statements.

Additionally, Belt extends the TypeScript configuration with `expo/tsconfig.base`, maintaining full compatibility with Expo’s managed workflow.

## Customizing TypeScript in Your Project

The default TypeScript configuration in Belt is designed to meet the needs of most React Native projects, but it can be customized as needed. You can modify the `tsconfig.json` file to adjust compiler options, module resolution paths, or other settings to better fit your project.
