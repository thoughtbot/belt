import { test, vi } from 'vitest';
import printWelcome from '../printWelcome';

vi.mock('../../print', () => ({ default: vi.fn() }));

test('doesnt error', () => {
  printWelcome();
});
