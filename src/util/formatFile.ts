import exec from './exec';

export default async function formatFile(filePath: string) {
  return exec(`npx prettier --write '${filePath}'`);
}
