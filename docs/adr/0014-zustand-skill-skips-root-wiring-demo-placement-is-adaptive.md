# Zustand skill has no root-component wiring; placement of the demo counter is the adaptive step

Zustand needs no context Provider — a store created via `create()` is just a hook, callable directly from any component, so there is nothing to mount at the target app's root. The `belt-add-state-management` (Zustand) skill's genuinely adaptive part (ADR-0003) is therefore not "wire a provider into the root component" but choosing where the bundled demo Counter component gets rendered among the target app's existing screens — the skill asks the human, with ranked recommendations (including "skip rendering it"), rather than editing the root component or picking silently.

## Considered Options

- **Root-component wiring anyway** (e.g. a persist/hydration gate in `App.tsx`) to give the skill a genuine root-level task — rejected: it would add reference-file surface area (AsyncStorage persistence) this pressure-test skill doesn't need, purely to satisfy the letter of "wire the provider."
- **Silent default placement** (agent picks, reports the choice in the diff) — rejected: placement is inherently target-repo-specific judgment; per ADR-0003, decisions that vary this much by codebase stay interactive prose, not a silent default the human only sees after the fact.

## Consequences

- Issue #81's acceptance-criteria wording ("wiring the provider into the root component") describes the general pattern in `docs/the-future-of-belt.md`'s state-management example, which was written with Redux Toolkit's shape in mind — not a literal requirement for the Zustand variant. Redux Toolkit (a future variant, tracked separately) will need real root wiring via its `<Provider>`; Zustand does not.
- Root-component changes stay reserved for variants that actually require them.
