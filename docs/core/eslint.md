### ESLint & Prettier

Belt comes pre-configured with thoughtbot’s ESLint and Prettier setups to enforce best practices and maintain code consistency across your React Native projects. These tools work together to ensure that your code is not only functional but also clean, readable, and maintainable.

#### ESLint Configuration

Belt uses thoughtbot’s sharable ESLint configuration, which includes setups for React, React Native, TypeScript, and Web in general. These configurations are designed to enforce thoughtbot’s [JavaScript style guide](https://github.com/thoughtbot/eslint-config?tab=readme-ov-file1) while being largely compatible with the popular ESLint config.

When you start a new project with Belt, the appropriate ESLint configuration is automatically applied based on the project type. For example:

- **React Native Projects**: Belt applies the `@thoughtbot/eslint-config/native` configuration, which includes rules and plugins tailored for React Native development.
- **TypeScript Support**: If your project uses TypeScript, Belt also applies the `@thoughtbot/eslint-config/typescript` configuration, adding rules specific to TypeScript.

The configurations that include Prettier automatically disable ESLint rules that are handled by Prettier, ensuring that there are no conflicts between the two tools.

#### Prettier Integration

Prettier is integrated with ESLint in Belt to manage code formatting. By default, Prettier is configured to enforce thoughtbot’s formatting guidelines, such as:

- **Single Quotes**: Prettier is configured to prefer single quotes over double quotes.
- **Semicolons**: Enforces the use of semicolons at the end of each statement.
- **Trailing Commas**: Adds a trailing comma after each item in a multi-line array or object literal, including the last item.

#### Customization

The ESLint and Prettier configurations are ready to use as soon as you create a new project with Belt. However, if you wish to modify or extend the default setup, you can do so by editing the `.eslintrc.js` and `.prettierrc` files in your project’s root directory. For example:

- **React Native with TypeScript**:
  ```json
  {
    "extends": [
      "@thoughtbot/eslint-config/native",
      "@thoughtbot/eslint-config/typescript"
    ]
  }
  ```

- **Custom Rule Overrides**: 
  You can override any of the shared rules by adding your own rules within the `rules` property:
  ```json
  {
    "extends": "@thoughtbot/eslint-config",
    "rules": {
      "react/jsx-newline": "warn"
    }
  }
  ```

If you encounter issues with Jest not detecting the version, you may need to add the following to your ESLint config:

```json
{
  "settings": {
    "jest": {
      "version": "detect"
    }
  }
}
```
