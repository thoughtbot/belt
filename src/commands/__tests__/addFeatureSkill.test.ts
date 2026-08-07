import { confirm } from '@inquirer/prompts';
import fse from 'fs-extra';
import { fs, vol } from 'memfs';
import { Mock, beforeEach, expect, test, vi } from 'vitest';
import packageJson from '../../../package.json';
import { addFeatureSkill } from '../addFeatureSkill';

vi.mock('../../util/print', () => ({ default: vi.fn() }));
vi.mock('@inquirer/prompts', () => ({ confirm: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

const FEATURE = 'placeholder-skill';

function sourceSkill({ version = '1.0.0', expoSdkRange = '>=54' } = {}) {
  return `---
name: belt-add-${FEATURE}
version: ${version}
expoSdkRange: '${expoSdkRange}'
---
Wiring instructions for the agent. <%= not a template %>
`;
}

test('copies reference/ byte-exact and stamps SKILL.md frontmatter with the Belt version', async () => {
  fse.mockTemplates();
  vol.fromJSON(
    {
      [`templates/${FEATURE}/SKILL.md`]: sourceSkill(),
      [`templates/${FEATURE}/reference/util.ts`]: 'export const x = 1;',
    },
    './',
  );

  await addFeatureSkill(FEATURE);

  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('version: 1.0.0');
  expect(skillMd).toContain("expoSdkRange: '>=54'");
  expect(skillMd).toContain(`beltVersion: ${packageJson.version}`);
  expect(skillMd).toContain(
    'Wiring instructions for the agent. <%= not a template %>',
  );

  expect(
    fs.readFileSync(
      `.claude/skills/belt-add-${FEATURE}/reference/util.ts`,
      'utf8',
    ),
  ).toEqual('export const x = 1;');
});

test('throws a clear error for a feature with no skill source', async () => {
  fse.mockTemplates();
  vol.fromJSON({}, './');

  await expect(addFeatureSkill('does-not-exist')).rejects.toThrow(
    /Unknown feature "does-not-exist"/,
  );
});

test('re-running with unchanged skillVersion/expoSdkRange overwrites silently, even if beltVersion differs', async () => {
  fse.mockTemplates();
  vol.fromJSON(
    {
      [`templates/${FEATURE}/SKILL.md`]: sourceSkill(),
      [`templates/${FEATURE}/reference/util.ts`]: 'export const x = 1;',
      [`.claude/skills/belt-add-${FEATURE}/SKILL.md`]: `---
version: 1.0.0
expoSdkRange: '>=54'
beltVersion: 0.0.1
---
Old prose.
`,
    },
    './',
  );

  await addFeatureSkill(FEATURE);

  expect(confirm).not.toHaveBeenCalled();
  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain(`beltVersion: ${packageJson.version}`);
  expect(skillMd).toContain('Wiring instructions for the agent.');
});

test('prompts for confirmation when the installed skillVersion differs, and overwrites when confirmed', async () => {
  fse.mockTemplates();
  (confirm as Mock).mockResolvedValueOnce(true);
  vol.fromJSON(
    {
      [`templates/${FEATURE}/SKILL.md`]: sourceSkill({ version: '2.0.0' }),
      [`templates/${FEATURE}/reference/util.ts`]: 'export const x = 2;',
      [`.claude/skills/belt-add-${FEATURE}/SKILL.md`]: sourceSkill({
        version: '1.0.0',
      }),
    },
    './',
  );

  await addFeatureSkill(FEATURE);

  expect(confirm).toHaveBeenCalledOnce();
  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('version: 2.0.0');
});

test('declining the confirmation leaves the installed skill untouched', async () => {
  fse.mockTemplates();
  (confirm as Mock).mockResolvedValueOnce(false);
  vol.fromJSON(
    {
      [`templates/${FEATURE}/SKILL.md`]: sourceSkill({ version: '2.0.0' }),
      [`templates/${FEATURE}/reference/util.ts`]: 'export const x = 2;',
      [`.claude/skills/belt-add-${FEATURE}/SKILL.md`]: sourceSkill({
        version: '1.0.0',
      }),
    },
    './',
  );

  await addFeatureSkill(FEATURE);

  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('version: 1.0.0');
});

test('skips the confirmation prompt in non-interactive mode and overwrites', async () => {
  fse.mockTemplates();
  vol.fromJSON(
    {
      [`templates/${FEATURE}/SKILL.md`]: sourceSkill({ version: '2.0.0' }),
      [`templates/${FEATURE}/reference/util.ts`]: 'export const x = 2;',
      [`.claude/skills/belt-add-${FEATURE}/SKILL.md`]: sourceSkill({
        version: '1.0.0',
      }),
    },
    './',
  );

  await addFeatureSkill(FEATURE, { interactive: false });

  expect(confirm).not.toHaveBeenCalled();
  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('version: 2.0.0');
});
