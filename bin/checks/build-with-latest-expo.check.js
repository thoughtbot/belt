#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

async function runCheck() {
  const dir = './builds';

  if (process.env.CI) {
    execSync('git config --global user.email "ci@example.com"', {
      stdio: 'inherit',
    });
    execSync('git config --global user.name "CI User"', { stdio: 'inherit' });

    // build to /dist
    execSync('yarn build', { stdio: 'inherit' });
  } else {
    console.log(
      "Ensure you've built the app with 'yarn dev' or 'yarn build' first",
    );
  }

  // clean /builds, cd into it
  fs.rmSync(path.join(dir, 'ExpoSample'), { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  process.chdir(dir);

  const opts = process.env.CI ? '--no-interactive' : '';

  // run CLI
  execSync(`${getNodeRunner()} ../dist/index.js ExpoSample ${opts}`, {
    stdio: 'inherit',
  });

  process.chdir('./ExpoSample');

  console.log(`
------------------------------------------------

New app created. Running tests and linters on the app to verify that it is
working as expected. If the following fails, note that this does not mean the
Belt test suite is broken but rather that the test suite in the app that it
builds is broken.
`);

  // verify linter and tests all pass in new project
  const pkgMgr = fs.existsSync('package-lock.json') ? 'npm run' : 'yarn';
  execSync(`${pkgMgr} test:all`, { stdio: 'inherit' });

  console.log(`---------------------------------------
Checking that working directory is clean in new app
`);
  execSync(`git diff --exit-code`, { stdio: 'inherit' });
  console.log('✅ working directory clean');

  console.log('All checks have passed!');
}

function getNodeRunner() {
  return typeof Bun !== 'undefined' && Bun.env ? 'bun' : 'node';
}

void runCheck();
