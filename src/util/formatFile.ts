import { execSync } from 'child_process';

export default async function formatFile(filePath: string) {
  execSync(`npx prettier --write '${filePath}'`);
}
