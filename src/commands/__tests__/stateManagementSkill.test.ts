import { select } from '@inquirer/prompts';
import fs from 'fs-extra';
import { vol } from 'memfs';
import { Mock, beforeEach, expect, test, vi } from 'vitest';
import { addFeatureSkill } from '../addFeatureSkill';

vi.mock('../../util/print', () => ({ default: vi.fn() }));
vi.mock('@inquirer/prompts', () => ({ confirm: vi.fn(), select: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vol.reset();
});

const FEATURE = 'state-management';
const DESTINATION = `.claude/skills/belt-add-${FEATURE}`;

test('non-interactively emits the Zustand variant (the thoughtbot default) from the real template', async () => {
  await addFeatureSkill(FEATURE, { interactive: false });

  expect(select).not.toHaveBeenCalled();

  const skillMd = (await fs.readFile(`${DESTINATION}/SKILL.md`)).toString();
  expect(skillMd).toContain('name: belt-add-state-management');
  expect(skillMd).toContain('variant: zustand');
  expect(skillMd).toContain("expoSdkRange: '>=56.0.0'");
  expect(skillMd).toContain('beltVersion:');
  expect(skillMd).toContain('# Add state management (Zustand)');

  const expectedReferenceFiles = [
    'src/store/counterStore.ts',
    'src/store/hooks.ts',
    'src/store/__tests__/counterStore.test.ts',
    'src/components/Counter.tsx',
    'src/components/__tests__/Counter.test.tsx',
  ];

  await Promise.all(
    expectedReferenceFiles.map(async (file) => {
      expect(await fs.exists(`${DESTINATION}/reference/${file}`)).toBe(true);
    }),
  );

  // Redux Toolkit's reference files never bundle into the Zustand skill
  // (#82) — its SKILL.md does mention "Redux Toolkit" by name, in the
  // mutual-exclusion check added by ADR-0017.
  expect(await fs.exists(`${DESTINATION}/reference/src/store/store.ts`)).toBe(
    false,
  );
});

test('choosing Redux Toolkit at the prompt emits only its own reference files and prose', async () => {
  (select as Mock).mockResolvedValueOnce('redux-toolkit');

  await addFeatureSkill(FEATURE);

  const skillMd = (await fs.readFile(`${DESTINATION}/SKILL.md`)).toString();
  expect(skillMd).toContain('name: belt-add-state-management');
  expect(skillMd).toContain('variant: redux-toolkit');
  expect(skillMd).toContain("expoSdkRange: '>=56.0.0'");
  expect(skillMd).toContain('beltVersion:');
  expect(skillMd).toContain('# Add state management (Redux Toolkit)');
  expect(skillMd).toContain('<Provider store={store}>');

  const expectedReferenceFiles = [
    'src/store/store.ts',
    'src/store/counterSlice.ts',
    'src/store/hooks.ts',
    'src/store/__tests__/counterSlice.test.ts',
    'src/components/Counter.tsx',
    'src/components/__tests__/Counter.test.tsx',
  ];

  await Promise.all(
    expectedReferenceFiles.map(async (file) => {
      expect(await fs.exists(`${DESTINATION}/reference/${file}`)).toBe(true);
    }),
  );

  // Zustand's reference files never bundle into the Redux Toolkit skill
  // (#82) — its SKILL.md does mention "Zustand" by name, in the
  // mutual-exclusion check added by ADR-0017.
  expect(
    await fs.exists(`${DESTINATION}/reference/src/store/counterStore.ts`),
  ).toBe(false);
});
