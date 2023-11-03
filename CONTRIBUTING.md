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

In thoughtbelt directory:

```bash
yarn link
```

In some other directory:

```bash
yarn add thoughtbelt
yarn link thoughtbelt

# or whatever command
yarn thoughtbelt NewApp
```

## Creating a pull request

Make sure the tests pass:

```bash
yarn test
```

Make your change, with new passing tests. Before committing your changes, run the code formatter:

```bash
yarn pretty
```

Follow the [style guide][style].

[style]: https://github.com/thoughtbot/guides

Push to your fork. Write a [good commit message][commit]. Submit a pull request.

[commit]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html

Others will give constructive feedback. This is a time for discussion and
improvements, and making the necessary changes will be required before we can
merge the contribution.

## Running the project locally

To run a local version of the codebase locally against a project, follow these steps:

- [in thoughtbelt directory] `yarn link`
- [in project directory] `yarn link thoughtbelt`
- Run CLI, eg; `yarn thoughtbelt`
