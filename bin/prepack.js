#!/usr/bin/env node

import fs from 'fs-extra';

// npm will not package the .gitignore file in templates/boilerplate/.gitignore
// by default. The solution is to create a .npmignore file that npm will use
// instead of the .gitignore file, and tell it to include the .gitignore file.
// We want everything in the .gitignore file to also be in the .npmignore file
// so we can ensure we don't accidentally package files that should be ignored.
// This script is run prior to packaging the library for npm (see package.json
// "prepack" script) and generates the .npmignore from the .gitignore to ensure
// they are always in sync.
//
// Also include any lock files or other files that shouldn't be included in the
// .gitignore file but that we want to ensure are not packaged to npm. These
// files can also be added to the root gitignore file to ensure they're also
// excluded from git
function copyGitIgnoreToNpmIgnore() {
  const gitIgnore = './templates/boilerplate/.gitignore';
  const npmIgnore = './templates/boilerplate/.npmignore';

  fs.copySync(gitIgnore, npmIgnore);

  fs.appendFileSync(
    npmIgnore,
    `
// # Prevent NPM from ignoring the .gitignore file
!.gitignore
bun.lockb
yarn.lock
package-lock.json
pnpm-lock.yaml
`,
  );
}

copyGitIgnoreToNpmIgnore();
