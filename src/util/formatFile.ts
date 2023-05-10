import { exec } from "child_process";
import { log } from "console";

export default async function formatFile(filePath: string) {
  log(`formatting ${filePath}`);
  exec(`npx prettier --write '${filePath}'`);
}
