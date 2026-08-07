# Feature skills are persistent and idempotent

An emitted feature skill stays committed in the target repo after the coding agent has executed it — it is not deleted or emitted outside the repo. Because a lingering skill can be re-invoked (accidentally or deliberately), every feature skill MUST be authored idempotently: it opens by detecting whether the feature is already installed, and if so verifies/repairs the wiring instead of re-scaffolding. Re-runs are harmless repairs, the skill doubles as living documentation of how the feature is wired, and a future `belt agent update` can refresh the skill in place.

## Consequences

- Authoring discipline: a skill without a defined already-installed behavior is incomplete.
- The skill's installed copy is frozen at the Belt version that emitted it; refreshing it is a separate concern (update/drift story).
