import { confirm } from '@inquirer/prompts';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { globals } from '../constants';
import addDependency from '../util/addDependency';
import addToGitignore from '../util/addToGitignore';
import commit, { handleCommitError } from '../util/commit';
import copyTemplate from '../util/copyTemplate';
import getProjectDir from '../util/getProjectDir';
import print from '../util/print';
import writeFile from '../util/writeFile';

type Options = {
  interactive?: boolean;
};

const API_PATH = 'src/util/api/api.ts';
const HARDCODED_API_URL = "'https://api.github.com/orgs/thoughtbot/repos'";
const REPLACED_API_URL =
  // eslint-disable-next-line no-template-curly-in-string
  "`${process.env.EXPO_PUBLIC_API_BASE_URL ?? ''}/orgs/thoughtbot/repos`";

const JEST_CONFIG_PATH = 'jest.config.js';
const JEST_SETUP_FILES_BEFORE = '  setupFilesAfterEnv: [';
const JEST_SETUP_FILES_AFTER =
  "  setupFiles: ['./jest.setup.env.js'],\n  setupFilesAfterEnv: [";

async function patchFile(
  filePath: string,
  search: string,
  replacement: string,
): Promise<boolean> {
  if (!(await fs.pathExists(filePath))) return false;
  const contents = (await fs.readFile(filePath)).toString();
  const updated = contents.replace(search, replacement);
  if (updated === contents) return false;
  await writeFile(filePath, updated, { format: true });
  return true;
}

export async function addEnv(options: Options = {}) {
  const { interactive = true } = options;

  globals.interactive = interactive;

  await printIntro();

  const spinner = ora().start('Setting up environment configuration');

  const projectDir = await getProjectDir();

  await addDependency('dotenv', { dev: true });

  await copyTemplate({
    templateDir: 'environments',
    templateFile: 'env.example',
    destination: '.env.example',
  });
  await copyTemplate({
    templateDir: 'environments',
    templateFile: 'src/config/index.ts',
  });
  await copyTemplate({
    templateDir: 'environments',
    templateFile: 'jest.setup.env.js',
  });
  await copyTemplate({
    templateDir: 'environments',
    templateFile: 'env.test',
    destination: '.env.test',
  });

  const envPath = path.join(projectDir, '.env');
  if (!(await fs.pathExists(envPath))) {
    await fs.copy(path.join(projectDir, '.env.example'), envPath);
  }

  await addToGitignore('.env');

  const patchedApi = await patchFile(
    path.join(projectDir, API_PATH),
    HARDCODED_API_URL,
    REPLACED_API_URL,
  );
  const patchedJest = await patchFile(
    path.join(projectDir, JEST_CONFIG_PATH),
    JEST_SETUP_FILES_BEFORE,
    JEST_SETUP_FILES_AFTER,
  );

  await commit('Add environment variable management support.').catch(
    handleCommitError,
  );

  spinner.succeed(`Successfully set up environment variable management!

  What was added:
  - .env.example: Template of environment variables (committed to git)
  - .env: Your local environment variables (gitignored)
  - .env.test: Environment variables for Jest (committed to git)
  - jest.setup.env.js: Loads .env.test before tests run
  - src/config/index.ts: Typed helper to access config values in your app${
    patchedApi
      ? `\n  - ${API_PATH}: Updated to use EXPO_PUBLIC_API_BASE_URL`
      : ''
  }${
    patchedJest
      ? `\n  - ${JEST_CONFIG_PATH}: Added setupFiles to load jest.setup.env.js`
      : ''
  }

  Usage in your app:
    import getConfig from 'src/config';
    const { apiBaseUrl } = getConfig();

  Variables prefixed with EXPO_PUBLIC_ are automatically loaded by the Expo CLI
  and inlined into your app bundle — no dotenv or extra config required.

  These values are visible in plain text in the compiled app.
  Never store secrets as EXPO_PUBLIC_ variables.
  `);
}

async function printIntro() {
  print("Let's set up environment variable management!");
  print(`
  We will configure your Expo app to handle environment variables using the
  built-in EXPO_PUBLIC_ mechanism. This includes:

  - .env.example: Template showing your environment variables (committed)
  - .env: Your local values (gitignored)
  - .env.test: Environment variables for Jest tests (committed)
  - jest.setup.env.js: Loads .env.test before each test run
  - src/config/index.ts: Typed helper for safe config access

  Variables prefixed with EXPO_PUBLIC_ are automatically loaded by the Expo CLI
  and inlined into the app bundle at build time. No extra packages needed.
  `);

  if (!globals.interactive) {
    return;
  }

  const proceed = await confirm({ message: 'Ready to proceed?' });
  if (!proceed) {
    process.exit(0);
  }

  print('');
}

export default function addEnvAction(...args: unknown[]) {
  const options = (args[0] as unknown[])[0] as Options;
  return addEnv(options);
}
