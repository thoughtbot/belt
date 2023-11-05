import { confirm } from '@inquirer/prompts';
import { vol } from 'memfs';
import { Mock, afterEach, test, vi } from 'vitest';
import print from '../../util/print';
import { createApp } from '../createApp';

vi.mock('@inquirer/prompts', () => ({
  confirm: vi.fn(),
}));
vi.mock('../../util/addDependency');
vi.mock('../../util/print', () => ({ default: vi.fn() }));

afterEach(() => {
  vol.reset();
  (print as Mock).mockReset();
});

test("doesn't error", async () => {
  (confirm as Mock).mockResolvedValueOnce(true);
  vi.spyOn(process, 'chdir').mockImplementation(() => {
    const json = {
      'package.json': JSON.stringify({
        scripts: {},
        dependencies: {},
        devDependencies: {},
      }),
      'yarn.lock': '',
    };
    vol.fromJSON(json, './');
  });
  await createApp('MyApp', { testing: true });
});
