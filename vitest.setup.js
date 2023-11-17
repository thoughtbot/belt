import { vi } from 'vitest';

vi.mock('child_process');
vi.mock('fs-extra');

vi.mock('ora', () => ({
  default: () => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    warn: vi.fn().mockReturnThis(),
  }),
}));

vi.mock('./src/util/exec', () => ({
  default: vi.fn().mockResolvedValue(true),
}));
