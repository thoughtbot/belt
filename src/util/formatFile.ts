import { exec } from 'child_process';

export default async function formatFile(filePath: string) {
  exec(`npx prettier --write '${filePath}'`);
}
