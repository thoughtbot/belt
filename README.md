# thoughtbelt CLI

Perform project setup and redundant tasks without your pants falling down!

This project is still in very early stages. Track this project [in Trello](https://trello.com/b/AGqz2thm/react-native-cli) or in Slack (`#proj-react-native-cli`).

## Usage

Create a new Expo app with:

```
npx thoughtbelt MyApp
```

Or, if you already have an app and want to configure ESLint, Prettier, TypeScript, React Native Testing Library, etc, run:

```
yarn install --dev thoughtbelt
```

or 

```
npm install --save-dev thoughtbelt
```

then run the command you'd like to perform:

```
yarn thoughtbelt typescript
```

or

```
npm thoughtbelt typescript
```

## Contributing

See the [CONTRIBUTING](./CONTRIBUTING.md) document. Thank you, [contributors](https://github.com/thoughtbot/fishery/graphs/contributors)!

## License

thoughtbelt is Copyright © 2023 thoughtbot. It is free software, and may be
redistributed under the terms specified in the [LICENSE](/LICENSE) file.

### About thoughtbot

<img src="https://thoughtbot.com/thoughtbot-logo-for-readmes.svg" width="375" />

thoughtbelt is maintained and funded by thoughtbot, inc.
The names and logos for thoughtbot are trademarks of thoughtbot, inc.

We love open source software! See [our other projects][community] or
[hire us][hire] to design, develop, and grow your product.

[community]: https://thoughtbot.com/community?utm_source=github
[hire]: https://thoughtbot.com/hire-us?utm_source=github
