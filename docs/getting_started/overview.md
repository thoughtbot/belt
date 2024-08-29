!!! info
    While we actively use Belt internally at thoughtbot, this project is still in early phases of development, so its API might still change frequently.


# Overview

Belt is an opinionated CLI tool for starting a new React Native app. Developed and actively used by the mobile team at thoughtbot, Belt is designed to simplify the setup process by making many of the standard decisions for you, based on tooling and conventions that have been battle-tested through numerous successful projects.

By using Belt, you can quickly scaffold a new React Native app with a pre-configured setup that includes a curated selection of tools and libraries:

- **Expo** for rapid development and deployment.
- **ESLint** and **Prettier** for consistent code style.
- **TypeScript** for type safety.
- **Jest** and **React Native Testing Library** for testing.
- **MSW** for API mocking during development.
- **React Navigation** with bottom tabs for navigation structure.
- **Tanstack Query** for REST API integration (with Apollo Client for GraphQL and Redux Toolkit for global state management coming soon).

<!-- @todo Add link to the Commands section -->
Additionally, Belt is designed to be flexible — the default setup can be customized as your project evolves, allowing you to adapt configurations and tooling to best fit your needs. New features can also be added independently using standalone commands, giving you full control over your development environment.