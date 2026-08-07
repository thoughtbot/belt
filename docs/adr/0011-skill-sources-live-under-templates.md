# Skill sources are authored under `templates/`, not a separate `skills/` root

A skill source (`SKILL.md` plus `reference/`) lives at `templates/<feature>/` in the Belt repo, alongside every deterministic feature's `.eta` templates. This lets the emit machinery reuse `copyTemplateDirectory` unmodified — `reference/` is copied by pointing `templateDir` at `<feature>/reference`, with no new root constant or parameterized copy helper.

## Considered Options

- **New top-level `skills/` root**: mirrors the vocabulary split in ADR-0010 (skills aren't templates) more literally, but requires a second `PACKAGE_ROOT`-relative constant and either a parameterized `copyTemplateDirectory` or a new wrapper around its internals for no functional benefit.

## Consequences

- `SKILL.md` sits as a sibling of `reference/` inside `templates/<feature>/` but is never passed through `copyTemplateDirectory` itself — it's read and stamped separately via `gray-matter` (ADR-0010). Don't route it through the eta copy path.
- The vocabulary distinction between "feature skill" and "template" (CONTEXT.md) is about templating semantics, not physical directory location.
