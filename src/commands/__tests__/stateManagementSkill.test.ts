import fs from 'fs-extra';
import { expect, test, vi } from 'vitest';
import { addFeatureSkill } from '../addFeatureSkill';

vi.mock('../../util/print', () => ({ default: vi.fn() }));

const FEATURE = 'state-management';
const DESTINATION = `.claude/skills/belt-add-${FEATURE}`;

test('emits a belt-add-state-management skill from the real template', async () => {
  await addFeatureSkill(FEATURE, { interactive: false });

  const skillMd = (await fs.readFile(`${DESTINATION}/SKILL.md`)).toString();
  expect(skillMd).toContain('name: belt-add-state-management');
  expect(skillMd).toContain('version: 1.0.0');
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
});
