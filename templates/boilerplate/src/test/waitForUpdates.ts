import { act } from '@testing-library/react-native';
import sleep from './sleep';

/**
 * Wait a specified time, wrapped in act
 * Usually, it is better to use waitFor or a findBy* matcher,
 * but this is sometimes required
 * @param time
 */
export default async function waitForUpdates(time = 2) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return act(() => sleep(time));
}
