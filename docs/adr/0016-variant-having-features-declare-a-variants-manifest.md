# Variant-having features declare their choices via a `variants.json` manifest

A feature's source under `templates/<feature>/` either has a flat `SKILL.md` (no variants — every existing feature but state-management) or a `variants.json` alongside per-variant subdirectories (`templates/<feature>/<variant>/SKILL.md` + `reference/`). `addFeatureSkill.ts` checks for the manifest first; when present, it prompts using the manifest's declared choices and default, then resolves the source path through the chosen variant's subdirectory; when absent, it falls back to today's flat-feature behavior unchanged. This keeps the curated 2–3-variant menu (ADR-0009) declarative per feature instead of hardcoded into the generic emit machinery, and keeps non-variant features exactly as simple as they are today.

## Considered Options

- **Hardcode the variant list in `addFeatureSkill.ts`** (e.g. a `state-management` → `['zustand', 'redux-toolkit']` map): simplest short-term, but couples the generic ADR-0004 machinery to a specific feature's variants — every new variant-having feature means editing shared code instead of adding a file.
- **Infer variants from directory shape alone** (no manifest; a `SKILL.md`-less feature directory containing only subdirectories implies variants, ordering/defaults derived implicitly): less to author, but the variant list, labels, and default become implicit in directory listing rather than declared — fragile once a feature needs to reorder, relabel, or hide a variant.

## Consequences

- A feature picks up variants by adding `variants.json` — no changes to `addFeatureSkill.ts` needed per new variant-having feature.
- `variants.json` is the one place a variant's prompt label and default-ness are declared; the subdirectory name is the canonical variant identifier used elsewhere (frontmatter's `variant` field, path resolution).
