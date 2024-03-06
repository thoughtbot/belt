import exec from './exec';

export default async function commit(message: string) {
  await exec('git add .');
  await exec(`git commit -m "${message}"`);
}
