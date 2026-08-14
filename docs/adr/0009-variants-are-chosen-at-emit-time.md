# Variants are chosen at emit time via Belt's prompt

Features with multiple library choices (e.g. state management: Zustand vs Redux Toolkit) offer a small thoughtbot-curated menu — 2–3 variants, never dynamic. The user picks via `@inquirer/prompts`' `select()` in Belt's interactive prompt when running `belt agent add <feature>` (`--no-interactive` takes the thoughtbot default). This is `select()`'s first use in Belt — the closest existing precedent is `confirm()`, already used for `addFeatureSkill`'s overwrite check; `create`'s package-manager choice is resolved via CLI flags and lockfile/env autodetection (`getPackageManager`/`getUserPackageManager`), not an interactive prompt, despite this ADR previously claiming otherwise. Belt then emits a skill containing only the chosen variant's reference files and prose, with the variant recorded in frontmatter (authored directly in each variant's own source `SKILL.md`, per ADR-0012 — not stamped by Belt). Choosing differently later means re-running the command.

## Considered Options

- **Agent asks at execution time**: one emitted skill bundling all variants; rejected because every target repo would carry 2–3× reference files and the choice would live in a chat conversation instead of a deterministic prompt.
- **One feature per library** (`belt agent add zustand`): no variant machinery; rejected because the catalog sprawls and cross-cutting guidance duplicates across skills.
