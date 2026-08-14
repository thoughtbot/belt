# Skill authors write their own version and Expo SDK range into source frontmatter

The source `SKILL.md` for a feature (in the Belt repo) already carries `version` and `expoSdkRange` in its own frontmatter, written by whoever authors the skill. At emit time, Belt reads the source frontmatter with `gray-matter` and adds/overwrites only `beltVersion` — the one field that's dynamic per Belt release — passing `version` and `expoSdkRange` through unchanged (ADR-0006, ADR-0010).

## Considered Options

- **Sidecar `skill.json` per feature**: keeps `SKILL.md`'s own frontmatter minimal (agent-facing fields only) and lets Belt inject all three stamped fields uniformly. Rejected because it doubles the authoring surface for every skill without buying anything — `gray-matter` already parses YAML frontmatter, so there's no templating-syntax risk (ADR-0010's actual concern) in putting these fields there directly.

## Consequences

- A skill author must remember to set `version` and `expoSdkRange` in `SKILL.md`'s frontmatter when authoring or bumping a skill; there's no separate file to enforce it.
- Belt's stamping step is a targeted merge (overwrite `beltVersion`, preserve everything else in frontmatter), not a wholesale rewrite — an author's other frontmatter fields (e.g. `name`, `description`) survive emission untouched.
