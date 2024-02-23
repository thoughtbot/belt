#!/usr/bin/env node
import { exec as execCb, execSync } from 'child_process';
import fs from 'fs-extra';
import ora from 'ora';
import util from 'util';
const exec = util.promisify(execCb);

/**
 * Show changes between two specified versions of Expo.
 * when new version of Expo is released, use this tool to
 * compare the latest version with the previous one, then
 * manually work those changes into the `templates/boilerplate directory
 * eg. usage: yarn diff-expo 43 42
 */
async function run() {
  const dir = './builds';
  fs.mkdirSync(dir, { recursive: true });
  process.chdir(dir);

  if (!process.argv[2] || !process.argv[3]) {
    console.log('usage: yarn diff-expo 43 42');
    return;
  }

  const version = parseInt(process.argv[2]);
  const version2 = parseInt(process.argv[3]);
  const oldVersion = Math.min(version, version2);
  const newVersion = Math.max(version, version2);

  fs.rmSync(`expo-${newVersion}`, { recursive: true, force: true });
  fs.rmSync(`expo-${oldVersion}`, { recursive: true, force: true });

  const spinner = ora(
    `Creating Expo apps build/expo-${newVersion} and build/expo-${oldVersion}`,
  ).start();

  // create Expo app in builds/expo-XX
  await exec(
    `npx create-expo@latest expo-${newVersion} --no-install --template expo-template-blank-typescript@${version}`,
    {
      stdio: 'inherit',
    },
  );

  // create older Expo app in builds/expo-XX
  await exec(
    `npx create-expo@latest expo-${oldVersion} --no-install --template expo-template-blank-typescript@${oldVersion}`,
    {
      stdio: 'inherit',
    },
  );

  spinner.succeed('Created Expo apps');
  spinner.stop();

  // open old app, replace with new app, then diff
  process.chdir(`expo-${oldVersion}`);
  await exec(`git init && git add . && git commit -m "Initial commit"`);
  await exec(`git clean -fxd`);
  await exec(`cp -r ../expo-${newVersion}/* .`);
  execSync(`git diff`, { stdio: 'inherit' });
}

void run();
