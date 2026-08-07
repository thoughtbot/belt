# Feature skills bundle reference files plus prose wiring instructions

A feature skill is not pure prose. Invariant code (utility modules, config blocks, tests that are identical for every user) ships as byte-exact reference files inside the skill, which the coding agent copies verbatim. Only the genuinely adaptive parts — wiring into the user's root component, navigation, or API layer, where codebases drift — are described as prose instructions for the agent to apply with judgment.

## Considered Options

- **Pure prose**: simplest authoring, rejected because every user would get slightly different code even for invariant parts, and thoughtbot could no longer QA exact outputs.
- **Exact diff spec** (full contents + precise anchors, agent as smart applier): most predictable, rejected because it forfeits the adaptivity that motivated the agent approach and is as rigid to author as templates.

## Consequences

- Reference files are QA'd via manual agent runs (ADR-0008), not static analysis — like today's eta templates, they are excluded from the Belt repo's eslint/tsc runs because they only make sense in the context of a target repo.
- Skill authoring guidelines must be explicit about the boundary: if a file's content doesn't depend on the target repo, it belongs in `reference/`, not in prose.
