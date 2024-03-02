# Contributing

We love contributions from everyone. By participating in this project, you agree
to abide by the [code of conduct](./CODE_OF_CONDUCT.md).

We expect everyone to follow the code of conduct anywhere in thoughtbot's
project codebases, issue trackers, chatrooms, and mailing lists.

## Contributing Code

Fork the repo.

Install dependencies:

```bash
yarn install
```

Run the dev server during development:

```bash
yarn dev
```

## Test changes locally

You can run Belt locally with:

```bash
# build app to /dist (not necessary if already running yarn dev)
yarn build

node bin/belt.js MyApp
```

Or, with Bun (faster):

```bash
# build app to /dist (not necessary if already running yarn dev)
yarn build

bun bin/belt.js MyApp
```

This generates a new Belt app in builds/MyApp, `cd`s to the directory, runs tests, and then `cd`s back. You can then run that app by `cd`ing to the directory and running `yarn ios` or the desired command.

## Creating a pull request

Make sure the tests pass:

```bash
yarn test
```

Before committing your changes, make sure the linter, formatter, and vitest tests all pass:

```bash
yarn test:all
```

Additionally, CI runs a check that uses the CLI to build an app and then ensures that the test suite of the new app passes. You can run this locally with:

```bash
node bin/checks/build-with-latest-expo.check.js
```

Follow the [style guide][style].

[style]: https://github.com/thoughtbot/guides

Push to your fork. Write a [good commit message][commit]. Submit a pull request.

[commit]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html

Others will give constructive feedback. This is a time for discussion and
improvements, and making the necessary changes will be required before we can
merge the contribution.

## Updating Belt dependencies

It's imperative that we keep dependencies up-to-date. We should monitor Expo and other dependency releases and update Belt when they come available.

### Updating Expo

Updating Expo is straightforward. When a new Expo version is released, open the Belt codebase, then:

```bash
cd templates/boilerplate
yarn install

# install latest Expo
yarn add expo@latest

# update dependencies to match versions required by latest Expo
npx expo install --fix
```

Now, run the test suite with `yarn test:all` and then generate a new app and verify that it works with:

```bash
node bin/belt.js MyApp
```

Manually verify other commands also work (eg. push notifications). Todo: get better tests around these (i.e. tests that build an app and run the new app's test suite).

### Updating other dependencies

We can periodically update all dependencies to the latest versions with:

```bash
cd templates/boilerplate

yarn install

# with yarn 1
yarn upgrade-interactive --latest

# or, with yarn 2+
yarn up --interactive

# audit and fix any packages that aren't compatible with the installed Expo
npx expo install --fix
```
