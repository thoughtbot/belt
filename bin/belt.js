#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs-extra';

// executes the CLI locally from the `builds` directory
// this can be useful for troubleshooting
// eg. node bin/belt.js MyApp, or bun bin/belt.js
async function run() {
  const dir = './builds';

  console.log(
    "Ensure you've built the app with 'yarn dev' or 'yarn build' first",
  );

  // clean /builds, cd into it
  fs.mkdirSync(dir, { recursive: true });
  process.chdir(dir);

  // run CLI
  execSync(
    `${getNodeRunner()} ../dist/index.js ${process.argv
      .slice(2)
      .join(' ')} --is-test`,
    {
      stdio: 'inherit',
    },
  );
}

function getNodeRunner() {
  return typeof Bun !== 'undefined' && Bun.env ? 'bun' : 'node';
}

void run();
