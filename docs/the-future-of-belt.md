# The Future of Belt: Feature Skills, Not Templates

## The problem

Belt scaffolds React Native Expo apps and features from templates. That works great on a freshly-created app — but real codebases drift, and a CLI that expects the code to look like it did on day one falls short. Meanwhile, every developer now has a coding agent (Claude Code, Cursor, etc.) that's good at exactly this: adapting instructions to a codebase that's changed.

## The idea

> **Belt emits instructions. Coding agents execute them.**

For new features, Belt stops scaffolding code itself. Instead it drops a **feature skill** into the target repo — a curated, versioned, thoughtbot-authored instruction package in the agent-skill format:

```
.claude/skills/belt-add-state-management/
├── SKILL.md          ← wiring instructions + version frontmatter
└── reference/        ← byte-exact files, copied verbatim
```

The user's own coding agent then executes it (`/belt-add-state-management` in Claude Code, or any agent pointed at the `SKILL.md`).

**Belt itself makes no LLM calls and invokes no agent.** It stays deterministic, offline, and boring — a skill delivery mechanism. Thoughtbot QAs the exact instructions it ships; the agent supplies the adaptability.

Existing deterministic features (`create`, `add notifications`) are untouched and keep working exactly as they do today. New features are namespaced separately:

- Today: `belt add <feature>`
- New: `belt agent add <feature>`

## Example: state management

The pressure-test case — wiring a store touches whatever the target app's root component looks like, which is exactly what the old `patchFile` approach struggled with.

```
$ belt agent add state-management
? Which library?
❯ Zustand        (default)
  Redux Toolkit

✓ Added .claude/skills/belt-add-state-management/

Next: run /belt-add-state-management in Claude Code
```

The agent copies the reference store and typed hooks verbatim, wires the provider into the app's root component, runs the test suite until green, and leaves a clean diff to review.

## The decisions

Full rationale for each lives in `docs/adr/`:

| # | Decision |
| --- | --- |
| [0001](adr/0001-belt-emits-feature-skills-agents-execute.md) | Belt emits skills; it never invokes an agent or calls an LLM itself |
| [0002](adr/0002-new-features-only-ship-as-feature-skills.md) | Only new features use this model — existing features aren't migrated |
| [0003](adr/0003-feature-skills-bundle-reference-files-plus-prose.md) | Skills bundle byte-exact reference files for invariant code, prose only for the genuinely adaptive parts |
| [0004](adr/0004-separate-agent-namespace-for-skill-features.md) | Lives under `belt agent add`, not `belt add` — the two commands make different promises |
| [0005](adr/0005-feature-skills-are-persistent-and-idempotent.md) | Skills stay committed in the target repo and must be idempotent — re-running repairs, not re-scaffolds |
| [0006](adr/0006-skill-frontmatter-carries-version-metadata.md) | Frontmatter is stamped with Belt version, skill version, and Expo SDK range from skill #1 |
| [0007](adr/0007-skills-verify-but-do-not-commit.md) | Skills verify (lint/typecheck/test) but never commit — unlike `add env`/`add notifications` |
| [0008](adr/0008-skills-are-qad-by-manual-agent-runs.md) | QA'd via a manual agent run per release, not CI, until that becomes the bottleneck |
| [0009](adr/0009-variants-are-chosen-at-emit-time.md) | Variants (e.g. Zustand vs. Redux) are a curated menu, chosen in Belt's prompt at emit time |
| [0010](adr/0010-skill-md-frontmatter-stamped-via-gray-matter-not-eta.md) | `SKILL.md` is plain markdown; frontmatter is stamped programmatically via `gray-matter`, not `eta` templating |

## Build order

1. `belt agent` namespace — generic emit machinery (prompt, copy skill directory, stamp frontmatter, print handoff)
2. State-management skill, Zustand variant
3. Redux Toolkit variant + the variant prompt
4. QA script, formalizing the manual verification workflow

## The one-liner

> **We write the instructions. Your agent does the typing. You review the diff.**

If you disagree with a decision above, the ADRs are exactly where to argue it.
