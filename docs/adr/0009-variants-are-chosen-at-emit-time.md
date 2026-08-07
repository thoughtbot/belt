# Variants are chosen at emit time via Belt's prompt

Features with multiple library choices (e.g. state management: Zustand vs Redux Toolkit) offer a small thoughtbot-curated menu — 2–3 variants, never dynamic. The user picks in Belt's interactive prompt when running `belt agent add <feature>` (same inquirer pattern as `create`'s package-manager prompt; `--no-interactive` takes the thoughtbot default). Belt then emits a skill containing only the chosen variant's reference files and prose, with the variant recorded in frontmatter. Choosing differently later means re-running the command.

## Considered Options

- **Agent asks at execution time**: one emitted skill bundling all variants; rejected because every target repo would carry 2–3× reference files and the choice would live in a chat conversation instead of a deterministic prompt.
- **One feature per library** (`belt agent add zustand`): no variant machinery; rejected because the catalog sprawls and cross-cutting guidance duplicates across skills.
