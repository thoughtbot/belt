import { confirm } from '@inquirer/prompts';
import { globals } from '../constants';
import print from './print';

export default async function confirmToProceed(message: string): Promise<void> {
  print(message);
  if (!globals.interactive) return;
  const proceed = await confirm({ message: 'Ready to proceed?' });
  if (!proceed) process.exit(0);
  print('');
}
