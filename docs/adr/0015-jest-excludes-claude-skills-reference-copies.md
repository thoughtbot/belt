# Jest excludes `.claude/` so a persisted skill's reference copy never runs as a second test suite

A feature skill's `reference/` files persist in the target repo at `.claude/skills/<name>/reference/` after the coding agent has copied them into `src/` (ADR-0005) — so a repo running `belt-add-state-management`, for example, ends up with two copies of `counterStore.test.ts` and `Counter.test.tsx`: the live one under `src/`, and the frozen one under `.claude/skills/belt-add-state-management/reference/`. `jest`'s default test discovery has no notion of that distinction and treats both as live app code, so every `npm test` silently runs each reference test twice. `tsc` and `eslint` don't hit this — both ignore dotdirs by default — only `jest` does. The fix is in the boilerplate `jest.config.js` (`templates/boilerplate/` and `templates/testingLibrary/`): add `.claude/` to `testPathIgnorePatterns`. This is general to every feature skill that ships reference tests (ADR-0003), not specific to state-management, which is where it was first noticed.

## Considered Options

- **Strip `__tests__` from what's copied into the installed `.claude/skills/*/reference/` copy** (only ship tests to the `src/` destination) — rejected: it thins out the persisted copy's value as living documentation of how the feature is wired (ADR-0005), and breaks the "reference files are byte-exact" premise (ADR-0003) by making the installed copy differ from the source skill's `reference/` directory for no reason tied to the target repo.
- **Leave it alone, since the duplicate suites still pass** — rejected: passing duplicates are silent noise that inflates every future feature skill's test output as more skills ship reference tests, and a duplicate that starts failing (e.g. after a repo repair-edits its live copy but not the frozen one) reads as two separate failures instead of one, which is actively misleading during Step 6 (verify) of a skill run.

## Consequences

- `testPathIgnorePatterns` must explicitly repeat jest's own default (`/node_modules/`) since setting the option at all replaces the default rather than extending it.
- Any future test runner or config swapped in for jest needs the same `.claude/` exclusion re-added; it isn't implied by dotfile conventions the way eslint/tsc's is.
