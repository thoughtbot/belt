import { confirm } from '@inquirer/prompts';
import { fs, vol } from 'memfs';
import { Mock, afterEach, beforeEach, expect, test, vi } from 'vitest';
import { addEnv } from '../env';

vi.mock('../../util/print', () => ({ default: vi.fn() }));
vi.mock('@inquirer/prompts', () => ({ confirm: vi.fn() }));
vi.mock('../../util/exec');

const baseFiles = {
  'package.json': JSON.stringify({
    scripts: {},
    dependencies: {},
    devDependencies: {},
  }),
  'yarn.lock': '',
};

beforeEach(() => {
  (confirm as Mock).mockResolvedValueOnce(true);
});

afterEach(() => {
  vol.reset();
  vi.clearAllMocks();
});

test('copies all template files to correct destinations', async () => {
  vol.fromJSON(baseFiles, './');

  await addEnv();

  expect(fs.existsSync('.env.example')).toBe(true);
  expect(fs.existsSync('.env')).toBe(true);
  expect(fs.existsSync('jest.setup.env.js')).toBe(true);
  expect(fs.existsSync('src/config/index.ts')).toBe(true);
});

test('sets test environment variables directly, without dotenv', async () => {
  vol.fromJSON(baseFiles, './');

  await addEnv();

  const jestSetupEnv = fs.readFileSync('jest.setup.env.js', 'utf8');
  expect(jestSetupEnv).toMatch('process.env.EXPO_PUBLIC_API_BASE_URL');
  expect(jestSetupEnv).not.toMatch('dotenv');
});

test('creates .env from .env.example when .env does not exist', async () => {
  vol.fromJSON(baseFiles, './');

  await addEnv();

  const envContent = fs.readFileSync('.env', 'utf8');
  const envExampleContent = fs.readFileSync('.env.example', 'utf8');
  expect(envContent).toBe(envExampleContent);
});

test('does not overwrite .env when it already exists', async () => {
  vol.fromJSON({ ...baseFiles, '.env': 'EXISTING_VAR=value' }, './');

  await addEnv();

  const envContent = fs.readFileSync('.env', 'utf8');
  expect(envContent).toBe('EXISTING_VAR=value');
});

test('adds .env to .gitignore', async () => {
  vol.fromJSON({ ...baseFiles, '.gitignore': 'node_modules\n' }, './');

  await addEnv();

  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  expect(gitignore).toMatch('.env');
});

test('patches API file when it contains hardcoded URL', async () => {
  vol.fromJSON(
    {
      ...baseFiles,
      'src/util/api/api.ts': `const url = 'https://api.github.com/orgs/thoughtbot/repos';`,
    },
    './',
  );

  await addEnv();

  const apiContent = fs.readFileSync('src/util/api/api.ts', 'utf8');
  expect(apiContent).toMatch('EXPO_PUBLIC_API_BASE_URL');
  expect(apiContent).not.toMatch(
    "'https://api.github.com/orgs/thoughtbot/repos'",
  );
});

test('does not error when API file does not exist', async () => {
  vol.fromJSON(baseFiles, './');

  await expect(addEnv()).resolves.toBeUndefined();
});

test('patches Jest config when it contains setupFilesAfterEnv', async () => {
  vol.fromJSON(
    {
      ...baseFiles,
      'jest.config.js': `module.exports = {\n  setupFilesAfterEnv: [\n    './jest.setup.js'\n  ]\n};`,
    },
    './',
  );

  await addEnv();

  const jestConfig = fs.readFileSync('jest.config.js', 'utf8');
  expect(jestConfig).toMatch("setupFiles: ['./jest.setup.env.js']");
  expect(jestConfig).toMatch('setupFilesAfterEnv');
});

test('does not error when Jest config does not exist', async () => {
  vol.fromJSON(baseFiles, './');

  await expect(addEnv()).resolves.toBeUndefined();
});

test('skips confirmation prompt in non-interactive mode', async () => {
  vol.fromJSON(baseFiles, './');

  await addEnv({ interactive: false });

  expect(confirm).not.toHaveBeenCalled();
});
