# State-management variants refuse to co-install; the check is symmetric across both variants

Each state-management variant's `SKILL.md` opens by checking not only whether it is already installed (ADR-0005), but also whether the _other_ variant's markers (its dependency plus its store file) are present. If so, the skill stops and tells the human a different state-management library is already wired up — it does not install alongside it, and it does not migrate or remove the existing one (that migration logic is explicitly out of scope, per #82). This check is symmetric: Zustand's `SKILL.md` checks for Redux Toolkit's markers and vice versa, even though only Redux Toolkit is new — a one-sided check would leave a real gap (running the Zustand skill against an app that already has Redux Toolkit wired up would not detect it and could double-install).

Adding this cross-check to Zustand's `SKILL.md` is a content change relative to #81. #82's acceptance criteria ("choosing Zustand emits the same skill contents as #81, no regression") is read as scoping _reference files and prose bundling_ — Redux Toolkit's files/prose must never ship inside the Zustand skill — not as freezing Zustand's Step 1 wording byte-for-byte.

## Considered Options

- **Guard only the new variant** (Redux Toolkit's `SKILL.md` checks for Zustand, Zustand's stays untouched from #81): satisfies the acceptance criteria's literal wording, but only protects one direction.

## Consequences

- Both variants' `SKILL.md` sources know each other's markers (dependency name + store file path) — introducing a third variant later means updating all existing variants' Step 1, not just the new one.
