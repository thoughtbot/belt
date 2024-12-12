<div align="center" style="padding: 20px 0px 20px 0px;">
  <img src="assets/belt-logo.svg" alt="Logo" width=250>
</div>

# Belt

_While we actively use Belt internally at thoughtbot, this project is still in early phases of development, so its API might still change frequently._

Belt is an opionated CLI tool for starting a new React Native app. It makes the mundane decisions for you using tooling and conventions that we at thoughtbot have battle-tested and found to work well for the many successful apps we have built for clients.

Here are some of what gets configured when you start a new Belt app:

- Expo
- ESLint
- Prettier
- TypeScript
- Jest
- React Native Testing Library
- MSW for mocking
- React Navigation with bottom tabs
- Tanstack Query for REST APIs. Apollo Client for GraphQL coming soon!
- Redux Toolkit for global state (coming soon!)

## Usage

Create a new React Native Expo app using Belt with:

```sh
# With NPM
npx create-belt-app MyApp

# With Yarn
npx create-belt-app MyApp --yarn

# With pnpm (experimental)
npx create-belt-app MyApp --pnpm

# With Bun (experimental)
npx create-belt-app MyApp --bun
```

then run the command you'd like to perform:

```sh
# eg. add TypeScript to the project
yarn belt add notifications

# or, with NPM
npx belt add notifications

# or, with PNPM
pnpm belt add notifications
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
