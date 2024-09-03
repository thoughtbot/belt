# Creating a new app

## System Requirements
- Node.js 18.18 or later

## Quick Start

To quickly set up a new React Native app using Belt, run the following command in your terminal:

```sh
# With NPM
npx create-belt-app MyApp
```

If you prefer you can also create a Belt app with Yarn, pnpm, or Bun by running the corresponding commands:

```sh
# With Yarn
npx create-belt-app MyApp --yarn

# With pnpm (experimental)
npx create-belt-app MyApp --pnpm

# With Bun (experimental)
npx create-belt-app MyApp --bun
```

You will be prompted to confirm the app details and all the tools that will be setup, then Belt will generate the new app using Expo, install all the necessary dependencies and run an initial set of tests.

## Extending App Functionality

After creating a project with Belt, the tool adds handles that allow you to extend your app’s functionality with minimal effort. For instance, if you want to add Push Notification capability, run the following command and follow the instructions:

```sh
# With Yarn
yarn belt add notifications

# With NPM
npx belt add notifications

# With PNPM
pnpm belt add notifications
```
The above will inject the necessary code and install required dependencies to get notifications displaying in your app. All you need to do is handle the setup outside of the code, like configuring the notification service, and you’re good to go.

If you'd like to know more details about how extending your app functionality's work, please refer to the [commands](../commands) section.
