#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '../../src/constants';

async function runCheck() {
  const dir = path.join(PACKAGE_ROOT, 'builds');
  execSync('yarn build', { stdio: 'inherit' });
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  process.chdir(dir);
  execSync('node ../dist/index.js ExpoSample --no-interactive --is-test', {
    stdio: 'inherit',
  });
  execSync('yarn test:all', { stdio: 'inherit' });
}

void runCheck();
