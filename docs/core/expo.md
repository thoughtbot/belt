### Using Expo with Belt

Belt leverages Expo to provide a streamlined and efficient development experience for React Native apps. It is a powerful platform that simplifies the process of building, deploying, and managing React Native applications.

#### Why Expo?

Expo is the recommended choice for React Native development due to its:

- **Ease of Use**: Expo abstracts away much of the complexity involved in setting up and managing a React Native app, making it easier for developers to get started and stay productive.
- **Pre-Built Components**: It comes packed with a rich set of pre-built components and APIs that simplify common tasks such as accessing device features, managing media, and integrating with third-party services.
- **Facilitated Distribution**: Expo simplifies the distribution process by providing tools and services that make it easy to build, deploy, and update your app across both iOS and Android platforms.
- **Over-the-Air Updates**: After the app is published, you can push updates directly to users without requiring them to download a new version from the app store. This also allow you to quickly roll out hotfixes to all users.

#### How Belt Configures Expo

When you create a new app with Belt, it automatically configures Expo with the latest stable version, tested and integrated with all the additional features included in Belt. It uses Expo’s managed workflow, which handles most of the heavy lifting related to native code. This means you can build your app without needing to touch Xcode or Android Studio unless you choose to eject. Additionally, it facilitates internal sharing of the app with your team, making it easy to distribute and test new builds with stakeholders.

#### Customizing Expo in Your Belt App

While Belt provides a solid foundation with Expo, you have the flexibility to customize and extend the Expo setup as needed. You can modify the `app.json` file to adjust settings, add new Expo modules, or configure additional plugins specific to your app's requirements.

Additionally, if your project outgrows the managed workflow, you have the option to eject from Expo, giving you full control over the native code. This is a more advanced option and is generally not needed unless you require custom native modules or other platform-specific customizations.

#### Working with Expo CLI

Belt includes commands that integrate seamlessly with Expo CLI, allowing you to manage your app's lifecycle easily. 

```bash
# Start the development server
yarn start

# Run the app on an iOS or Android simulator
yarn ios
yarn android

# Build the app for production
yarn build
```
