import { expect, test } from 'vitest';
import stampSkillFrontmatter from '../stampSkillFrontmatter';

test('merges overrides into existing frontmatter, leaving the body untouched', () => {
  const source = `---
name: belt-add-placeholder-skill
version: 1.0.0
expoSdkRange: '>=54'
---
Some prose the agent reads. <%= not a template %>
`;

  const result = stampSkillFrontmatter(source, { beltVersion: '0.9.0' });

  expect(result).toContain('name: belt-add-placeholder-skill');
  expect(result).toContain('version: 1.0.0');
  expect(result).toContain("expoSdkRange: '>=54'");
  expect(result).toContain('beltVersion: 0.9.0');
  expect(result).toContain('Some prose the agent reads. <%= not a template %>');
});

test('overwrites a field that already exists in the source frontmatter', () => {
  const source = `---
version: 1.0.0
beltVersion: 0.8.0
---
Body content.
`;

  const result = stampSkillFrontmatter(source, { beltVersion: '0.9.0' });

  expect(result).toContain('beltVersion: 0.9.0');
  expect(result).not.toContain('0.8.0');
});
