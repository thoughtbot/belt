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

test('registers "agent add" as a command namespace distinct from "add"', async () => {
  const writeSpy = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
  const exitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);

  process.argv = ['node', 'belt', 'agent', '--help'];
  const { default: runCli } = await import('../cli');
  runCli();

  const output = writeSpy.mock.calls.map((call) => call[0]).join('');
  expect(output).toMatch(/Usage: Belt agent/);
  expect(output).toMatch(/add \[options\] <feature>/);

  writeSpy.mockRestore();
  exitSpy.mockRestore();
});
