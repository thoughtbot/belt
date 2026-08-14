---
name: belt-add-state-management
description: Wire Redux Toolkit state management into this app — a store, a counter slice, typed hooks, a root-level Provider, and a demo Counter component you place wherever it fits.
version: 1.1.0
expoSdkRange: '>=56.0.0'
variant: redux-toolkit
---

# Add state management (Redux Toolkit)

This skill wires [Redux Toolkit](https://redux-toolkit.js.org/) into the target repo: a store, a counter slice, typed hooks built on `react-redux`, and a `Counter` component that exercises all of it end to end. All of these ship as byte-exact reference files in this skill's `reference/` directory — copy them verbatim. The genuinely adaptive parts are wiring the store's `Provider` into the app's root component (Redux Toolkit does need one, unlike Zustand) and choosing where the demo `Counter` gets rendered.

## Step 1: Check whether this is already installed

First, check whether a **different** state-management library is already wired up:

- Is `zustand` listed in `package.json` dependencies?
- Does `src/store/counterStore.ts` already exist?

If either is present, **stop**. Tell the person you're working with that this app already has a different state-management library (Zustand) wired up. Don't install Redux Toolkit alongside it, and don't remove or migrate the existing one — that's outside this skill's scope.

Otherwise, check whether Redux Toolkit itself is already installed:

- Is `@reduxjs/toolkit` (or `react-redux`) listed in `package.json` dependencies?
- Does `src/store/store.ts` already exist?

**Both present** → state management is already wired up. Skip straight to Step 7 (Verify) to confirm everything still passes, then stop. Don't re-ask about placement, don't re-copy files, don't touch anything that already exists — this is a repair/verify pass, not a re-scaffold (per this skill's idempotency guarantee).

**Neither present** → continue with Step 2, this is a fresh install.

**Only one present** (e.g. the dependencies are there but a store file is missing, or vice versa) → fill in only the missing piece, skipping the steps that are already satisfied. Never overwrite a reference file that already exists on disk, even if its contents have since diverged from this skill's copy — the person working in this repo may have deliberately extended it.

## Step 2: Install the dependencies

Add `@reduxjs/toolkit` and `react-redux` as dependencies using whichever package manager this repo already uses (check for `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb`). No Expo-specific install step is needed — both are plain JavaScript packages with no native code.

## Step 3: Copy the reference files

Copy this skill's `reference/` directory into the target repo verbatim, preserving its relative paths:

- `reference/src/store/store.ts` → `src/store/store.ts`
- `reference/src/store/counterSlice.ts` → `src/store/counterSlice.ts`
- `reference/src/store/__tests__/counterSlice.test.ts` → `src/store/__tests__/counterSlice.test.ts`
- `reference/src/store/hooks.ts` → `src/store/hooks.ts`
- `reference/src/components/Counter.tsx` → `src/components/Counter.tsx`
- `reference/src/components/__tests__/Counter.test.tsx` → `src/components/__tests__/Counter.test.tsx`

If this repo's `src/` layout doesn't match this shape (e.g. no top-level `src/`), use the closest equivalent location and keep the relative structure between the store, slice, hooks, and component consistent with each other.

## Step 4: Wire the Provider into the root component

Mandatory — without it, nothing under the root can reach the store.

The root component (`App.tsx`, or `app/_layout.tsx` under Expo Router) has a `providers` array (see `src/components/Providers.tsx`). Blend in — don't wrap the root separately or add a second array:

```ts
import { Provider as ReduxProvider } from 'react-redux';
import store from 'src/store/store';

const providers: Provider[] = [
  // ... existing providers ...
  (children) => <ReduxProvider store={store}>{children}</ReduxProvider>,
  // CODEGEN:BELT:PROVIDERS - do not remove
];
```

- Above the `CODEGEN:BELT:PROVIDERS` marker, not below.
- Alias to `ReduxProvider` — `react-redux`'s `Provider` clashes with the `Provider` type already imported here.

No `providers` array (app predates this pattern)? Wrap the root's existing content directly in `<Provider store={store}>` instead, and flag it to the person you're working with.

## Step 5: Decide where to render the demo Counter

This is the other adaptive part — it depends on how this specific app is organized, so don't guess silently. Ask the person you're working with where they'd like the `Counter` demo to appear, and offer these recommendations in order:

1. **An existing settings/debug-style screen**, if one exists (e.g. a `SettingsScreen`) — the most natural home for a throwaway demo.
2. **Appended to the existing home/landing screen**, if no settings-style screen exists.
3. **Skip rendering it entirely.** The store, slice, hooks, and `Counter` component still get copied and are ready to use later — nothing needs to be wired into the UI right now. The `Provider` from Step 4 still needs to be wired regardless of this choice.

Wait for their answer before proceeding.

## Step 6: Wire the Counter in (unless skipped)

If they chose a location, import `Counter` from `src/components/Counter` and render it in that screen. This may mean editing an existing screen file, or — if they asked for a brand-new screen — creating one and registering it with the app's existing navigation setup. Match the conventions already present in the file(s) you're editing.

If they chose to skip, do nothing further here.

## Step 7: Verify

Find and run this repo's lint, typecheck, and test scripts (check `package.json`'s `scripts` — common names are `lint`, `test`, `typecheck`, `tsc`). Fix any failures caused by this change before considering the feature done.

## Step 8: Stop — do not commit

Leave the changes in the working tree for human review. Do not run `git commit`. This is intentional (unlike some of this CLI's older, deterministic `add` commands, which do commit) — agent-applied changes are less predictable than template output, so they stay staged for review rather than landing straight in history.
