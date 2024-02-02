# Belt

Belt is a CLI tool for starting a new React Native Expo app and will keep your pants secure as you continue development.

Belts are not inherently innovative—they've been around even longer than pants—and neither is this tool! Belt creates your app using the absolute latest version of [create-expo](https://github.com/expo/expo/tree/main/packages/create-expo). It then layers on the missing pieces, based on the conventions we have found to consistently work for us at thoughtbot, so your pants will be secured tightly from the very beginning.

Here are some of what gets configured when you start a new Belt app:

- ESLint
- Prettier
- TypeScript
- Jest
- React Native Testing Library
- Custom test "render" function to facilitate testing
- MSW for mocking
- Directory structure
- Tanstack Query (for REST APIs) or Apollo Client (for GraphQL)
- Redux for global state (coming soon!)

## Usage

Create a new React Native, Expo app using Belt with:

```
# With NPM
npx create-belt-app

# With Yarn
yarn create belt-app

# With pnpm (experimental)
pnpm create belt-app

# With Bun (experimental)
bunx create-belt-app
```

Or, if you already have an app and want to configure ESLint, Prettier, TypeScript, React Native Testing Library, etc, run:

```
# with NPM
npm install --save-dev create-belt-app

# with Yarn
yarn install --dev create-belt-app
```

then run the command you'd like to perform:

```
# eg. add TypeScript to the project
yarn belt typescript

# or, with NPM
npm belt typescript
```

## Contributing

See the [CONTRIBUTING](./CONTRIBUTING.md) document. Thank you, [contributors](https://github.com/thoughtbot/belt/graphs/contributors)!

## License

Belt is Copyright © 2024 thoughtbot. It is free software, and may be
redistributed under the terms specified in the [LICENSE](/LICENSE) file.

### About thoughtbot

<img src="https://thoughtbot.com/thoughtbot-logo-for-readmes.svg" width="375" />

Belt is maintained and funded by thoughtbot, inc.
The names and logos for thoughtbot are trademarks of thoughtbot, inc.

We love open source software! See [our other projects][community] or
[hire us][hire] to design, develop, and grow your product.

[community]: https://thoughtbot.com/community?utm_source=github
[hire]: https://thoughtbot.com/hire-us?utm_source=github
