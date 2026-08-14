import { confirm, select } from '@inquirer/prompts';
import fse from 'fs-extra';
import { fs, vol } from 'memfs';
import { Mock, beforeEach, expect, test, vi } from 'vitest';
import packageJson from '../../../package.json';
import { addFeatureSkill } from '../addFeatureSkill';

vi.mock('../../util/print', () => ({ default: vi.fn() }));
vi.mock('@inquirer/prompts', () => ({ confirm: vi.fn(), select: vi.fn() }));

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

const VARIANT_FEATURE = 'variant-having-skill';

function variantSourceSkill(variant: string) {
  return `---
name: belt-add-${VARIANT_FEATURE}
version: 1.0.0
expoSdkRange: '>=54'
variant: ${variant}
---
Wiring instructions for the ${variant} variant.
`;
}

function seedVariantTemplates() {
  vol.fromJSON(
    {
      [`templates/${VARIANT_FEATURE}/variants.json`]: JSON.stringify({
        default: 'alpha',
        variants: [
          { name: 'alpha', label: 'Alpha' },
          { name: 'beta', label: 'Beta' },
        ],
      }),
      [`templates/${VARIANT_FEATURE}/alpha/SKILL.md`]:
        variantSourceSkill('alpha'),
      [`templates/${VARIANT_FEATURE}/alpha/reference/util.ts`]:
        'export const alpha = 1;',
      [`templates/${VARIANT_FEATURE}/beta/SKILL.md`]:
        variantSourceSkill('beta'),
      [`templates/${VARIANT_FEATURE}/beta/reference/util.ts`]:
        'export const beta = 1;',
    },
    './',
  );
}

test('prompts for a variant when variants.json is present, and emits only the chosen variant', async () => {
  fse.mockTemplates();
  seedVariantTemplates();
  (select as Mock).mockResolvedValueOnce('beta');

  await addFeatureSkill(VARIANT_FEATURE);

  expect(select).toHaveBeenCalledOnce();
  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${VARIANT_FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('variant: beta');
  expect(skillMd).toContain('Wiring instructions for the beta variant.');
  expect(
    fs.readFileSync(
      `.claude/skills/belt-add-${VARIANT_FEATURE}/reference/util.ts`,
      'utf8',
    ),
  ).toEqual('export const beta = 1;');
});

test('skips the variant prompt and takes the manifest default in non-interactive mode', async () => {
  fse.mockTemplates();
  seedVariantTemplates();

  await addFeatureSkill(VARIANT_FEATURE, { interactive: false });

  expect(select).not.toHaveBeenCalled();
  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${VARIANT_FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('variant: alpha');
});

test('re-running with a different variant confirms even when version/expoSdkRange match', async () => {
  fse.mockTemplates();
  seedVariantTemplates();
  vol.fromJSON(
    {
      [`.claude/skills/belt-add-${VARIANT_FEATURE}/SKILL.md`]:
        variantSourceSkill('alpha'),
    },
    './',
  );
  (select as Mock).mockResolvedValueOnce('beta');
  (confirm as Mock).mockResolvedValueOnce(true);

  await addFeatureSkill(VARIANT_FEATURE);

  expect(confirm).toHaveBeenCalledOnce();
  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${VARIANT_FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('variant: beta');
});

test('declining the variant-switch confirmation leaves the installed variant untouched', async () => {
  fse.mockTemplates();
  seedVariantTemplates();
  vol.fromJSON(
    {
      [`.claude/skills/belt-add-${VARIANT_FEATURE}/SKILL.md`]:
        variantSourceSkill('alpha'),
    },
    './',
  );
  (select as Mock).mockResolvedValueOnce('beta');
  (confirm as Mock).mockResolvedValueOnce(false);

  await addFeatureSkill(VARIANT_FEATURE);

  const skillMd = fs.readFileSync(
    `.claude/skills/belt-add-${VARIANT_FEATURE}/SKILL.md`,
    'utf8',
  );
  expect(skillMd).toContain('variant: alpha');
});
