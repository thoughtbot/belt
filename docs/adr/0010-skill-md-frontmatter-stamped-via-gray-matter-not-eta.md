# SKILL.md frontmatter is stamped via gray-matter, not eta

Every other Belt feature templates its output through `eta` (`copyTemplate`/`copyTemplateDirectory`), rendering `.eta` source files with variables. `SKILL.md` deliberately does not follow this convention: its source in the Belt repo is authored as plain markdown, and Belt stamps version metadata (ADR-0006: Belt version, skill version, Expo SDK range) into only the YAML frontmatter block, programmatically, via `gray-matter`, after copying. The prose body is never passed through a template renderer.

## Considered Options

- **Author `SKILL.md` as an `.eta` file, reuse `copyTemplateDirectory` as-is**: zero new plumbing, consistent with every other feature. Rejected because it mixes templating syntax into the frontmatter of a file whose entire body is meant to be stable, agent-read prose (ADR-0003) — and a skill author typing `<%=` anywhere in the instructions would silently break rendering.

## Consequences

- New dependency (`gray-matter`) and a new util scoped to frontmatter stamping — this is intentionally not `copyTemplate`.
- `SKILL.md` source files in the Belt repo are pure markdown; nothing about them hints at templating, unlike every `.eta` file elsewhere in `templates/`. Don't "fix" this for consistency — the split is deliberate.
