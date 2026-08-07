import matter from 'gray-matter';

type FrontmatterOverrides = Record<string, unknown>;

/**
 * Parses the YAML frontmatter of a SKILL.md source (ADR-0010) and merges in
 * the given overrides. The prose body is returned untouched — this is
 * intentionally not `copyTemplate`, no template rendering happens here
 * (ADR-0012).
 */
export default function stampSkillFrontmatter(
  source: string,
  overrides: FrontmatterOverrides,
): string {
  const { data, content } = matter(source);

  return matter.stringify(content, { ...data, ...overrides });
}
