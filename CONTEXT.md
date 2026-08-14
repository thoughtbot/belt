# Belt

A React Native Expo project starter and generator CLI. Belt creates new apps and adds features to existing ones — deterministically via templates today, and via agent-executed feature skills going forward.

## Language

**Feature**:
A discrete capability Belt can add to a React Native Expo app (e.g. notifications, state management). Exposed as `belt add <feature>` (deterministic) or `belt agent add <feature>` (feature skill).
_Avoid_: module, addon, generator

**Feature skill**:
A versioned, thoughtbot-authored agent skill (`SKILL.md` plus supporting files) that Belt emits into a target repo under `.claude/skills/`. It contains the detailed instructions a coding agent follows to scaffold one feature. Belt emits it; Belt never executes it.
_Avoid_: playbook, recipe, instruction markdown, prompt

**Skill source**:
The pre-emission form of a feature skill, authored by thoughtbot and living in the Belt repo at `templates/<feature>/` (ADR-0011). Belt copies and stamps it to produce the feature skill in the target repo — the two are the same content at different points in the pipeline, but only the emitted copy is a feature skill.
_Avoid_: skill (ambiguous between source and emitted forms), feature skill (reserve for the emitted, target-repo-side artifact)

**Variant**:
One of a small, thoughtbot-curated set of library choices within a single feature (e.g. Zustand vs Redux Toolkit for state management). The user picks a variant in Belt's prompt at emit time; the emitted feature skill contains only that variant.
_Avoid_: option, flavor

**Reference file**:
A thoughtbot-authored, byte-exact source file bundled inside a feature skill. The coding agent copies it verbatim into the target repo; only the wiring around it is left to the agent's judgment.
_Avoid_: template (reserved for the eta templates used by deterministic features)

**Coding agent**:
The user's AI tool (Claude Code, Cursor, etc.) that reads a feature skill and performs the actual code changes in the target repo. Lives entirely outside Belt; the `belt agent` command namespace is named after it because those commands end in a handoff to it.
_Avoid_: LLM, AI (when referring to the executor)

**Target repo**:
The user's React Native Expo app that Belt operates on.
_Avoid_: project, app (when ambiguity with Belt itself is possible)
