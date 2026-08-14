---
name: belt-add-state-management
description: Wire Zustand state management into this app — a store, typed selector hooks, and a demo Counter component you place wherever it fits.
version: 1.0.0
expoSdkRange: '>=56.0.0'
---

# Add state management (Zustand)

This skill wires [Zustand](https://github.com/pmndrs/zustand) into the target repo: a small counter store, typed selector hooks built on it, and a `Counter` component that exercises all of it end to end. All three ship as byte-exact reference files in this skill's `reference/` directory — copy them verbatim. The only judgment call is where `Counter` gets rendered.

Zustand needs no context Provider — a store created with `create()` is just a hook, callable from any component. So unlike some other state libraries, there is no root-component wiring step here.

## Step 1: Check whether this is already installed

Before doing anything else, check:

- Is `zustand` listed in `package.json` dependencies?
- Does `src/store/counterStore.ts` already exist?

**Both present** → state management is already wired up. Skip straight to Step 6 (Verify) to confirm everything still passes, then stop. Don't re-ask about placement, don't re-copy files, don't touch anything that already exists — this is a repair/verify pass, not a re-scaffold (per this skill's idempotency guarantee).

**Neither present** → continue with Step 2, this is a fresh install.

**Only one present** (e.g. the dependency is there but the store file is missing, or vice versa) → fill in only the missing piece, skipping the steps that are already satisfied. Never overwrite a reference file that already exists on disk, even if its contents have since diverged from this skill's copy — the person working in this repo may have deliberately extended it.

## Step 2: Install the zustand dependency

Add `zustand` as a dependency using whichever package manager this repo already uses (check for `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb`). No Expo-specific install step is needed — `zustand` is a plain JavaScript package with no native code.

## Step 3: Copy the reference files

Copy this skill's `reference/` directory into the target repo verbatim, preserving its relative paths:

- `reference/src/store/counterStore.ts` → `src/store/counterStore.ts`
- `reference/src/store/__tests__/counterStore.test.ts` → `src/store/__tests__/counterStore.test.ts`
- `reference/src/store/hooks.ts` → `src/store/hooks.ts`
- `reference/src/components/Counter.tsx` → `src/components/Counter.tsx`
- `reference/src/components/__tests__/Counter.test.tsx` → `src/components/__tests__/Counter.test.tsx`

If this repo's `src/` layout doesn't match this shape (e.g. no top-level `src/`), use the closest equivalent location and keep the relative structure between the store, hooks, and component consistent with each other.

## Step 4: Decide where to render the demo Counter

This is the genuinely adaptive part — it depends on how this specific app is organized, so don't guess silently. Ask the person you're working with where they'd like the `Counter` demo to appear, and offer these recommendations in order:

1. **An existing settings/debug-style screen**, if one exists (e.g. a `SettingsScreen`) — the most natural home for a throwaway demo.
2. **Appended to the existing home/landing screen**, if no settings-style screen exists.
3. **Skip rendering it entirely.** The store, hooks, and `Counter` component still get copied and are ready to use later — nothing needs to be wired into the UI right now.

Wait for their answer before proceeding.

## Step 5: Wire it in (unless skipped)

If they chose a location, import `Counter` from `src/components/Counter` and render it in that screen. This may mean editing an existing screen file, or — if they asked for a brand-new screen — creating one and registering it with the app's existing navigation setup. Match the conventions already present in the file(s) you're editing.

If they chose to skip, do nothing further here.

## Step 6: Verify

Find and run this repo's lint, typecheck, and test scripts (check `package.json`'s `scripts` — common names are `lint`, `test`, `typecheck`, `tsc`). Fix any failures caused by this change before considering the feature done.

## Step 7: Stop — do not commit

Leave the changes in the working tree for human review. Do not run `git commit`. This is intentional (unlike some of this CLI's older, deterministic `add` commands, which do commit) — agent-applied changes are less predictable than template output, so they stay staged for review rather than landing straight in history.
