import { test, vi, expect, beforeEach } from 'vitest';
import packageJson from '../../package.json';

beforeEach(() => {
  vi.resetModules();
});

test('outputs version with --version flag', async () => {
  const writeSpy = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
  const exitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);

  process.argv = ['node', 'belt', '--version'];
  const { default: runCli } = await import('../cli');
  runCli();

  expect(writeSpy).toHaveBeenCalledWith(
    expect.stringContaining(packageJson.version),
  );

  writeSpy.mockRestore();
  exitSpy.mockRestore();
});
