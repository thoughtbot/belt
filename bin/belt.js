#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

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
  const rawAppName = process.argv[2];
  const appName = _.upperFirst(_.camelCase(rawAppName.trim()));
  if (fs.existsSync(path.join(dir, appName))) {
    fs.rmSync(path.join(dir, appName), { recursive: true });
  }
  process.chdir(dir);

  // run CLI
  execSync(
    `${getNodeRunner()} ../dist/index.js ${process.argv.slice(2).join(' ')}`,
    {
      stdio: 'inherit',
    },
  );

  process.chdir(appName);
  execSync(`npm run test:all`, { stdio: 'inherit' });

  process.chdir('../..');
  console.log(`some commands you might want to run now:

  cd builds/${appName}
  cd builds/${appName} && npm run test:all
  cd builds/${appName} && npm run ios
  code builds/${appName}
  `);
}

function getNodeRunner() {
  return typeof Bun !== 'undefined' && Bun.env ? 'bun' : 'node';
}

void run();
