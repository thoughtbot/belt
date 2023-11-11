#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs-extra';

async function runCheck() {
  const dir = './builds';

  // build to /dist
  execSync('yarn build', { stdio: 'inherit' });

  // clean /builds, cd into it
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  process.chdir(dir);

  // run CLI
  execSync('node ../dist/index.js ExpoSample --no-interactive --is-test', {
    stdio: 'inherit',
  });

  process.chdir('./ExpoSample');

  // verify linter and tests all pass in new project
  const pkgMgr = fs.existsSync('package-lock.json') ? 'npm run' : 'yarn';
  execSync(`${pkgMgr} test:all`, { stdio: 'inherit' });
}

void runCheck();
