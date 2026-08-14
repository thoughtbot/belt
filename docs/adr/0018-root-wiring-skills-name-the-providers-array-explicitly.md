# Skills that need root wiring name the providers array and marker explicitly, not generic "wrap the root" prose

Any skill that mounts something at the target app's root (Redux Toolkit's `<Provider>` today; any future root-wiring variant or feature) must describe `src/components/Providers.tsx`'s `providers` array and the `// CODEGEN:BELT:PROVIDERS` marker explicitly in its `SKILL.md` — including the "insert above the marker, not below" rule and the import-aliasing rule for name clashes — rather than generic "find the root component and wrap it" language. The redux-toolkit variant originally used that generic wording, and non-Claude coding agents running it mounted a second, standalone `<Provider>` instead of blending into the existing array, defeating the array's entire purpose. When the target repo doesn't have this shape (an app not scaffolded by Belt's current boilerplate, or one where a person removed the marker), the skill falls back to the old generic wrap-the-root behavior and tells the person working in the repo that this app doesn't follow the expected pattern, rather than guessing or forcing the array into existence.

## Considered Options

- **Keep the generic "wrap the root" wording, just add a warning against a second provider** — rejected: it tells the agent what _not_ to do but not _how_ to do it correctly, leaving the array's location and the marker's semantics to be reverse-engineered per run. This is the wording that already failed once.

## Consequences

- Any future skill needing root wiring (a future state-management variant, or a non-state-management feature) should reuse this same explicit-mechanism description rather than reintroducing generic wrap language.
- The fallback path (repo lacks the array) means root wiring across all Belt-scaffolded apps isn't strictly guaranteed uniform — an agent may still hand-wrap the root for repos outside Belt's current boilerplate shape, and is expected to flag that to the human rather than silently improvise the array into existence.
