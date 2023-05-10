import { select } from '@inquirer/prompts';

export default async function pickPackageManager() {
  const packageManager = await select({
    message: 'Preferred package manager',
    choices: [
      {
        name: 'yarn',
        value: 'yarn',
      },
      {
        name: 'npm',
        value: 'npm',
      },
    ],
  });

  console.log(packageManager);
  return packageManager;
}
