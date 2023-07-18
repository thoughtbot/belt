#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import { URL, fileURLToPath } from "node:url";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const args = process.argv.slice(2);

spawn("ts-node", [path.join(dirname, "../src/cli.ts"), ...args], {
  stdio: "inherit",
});
