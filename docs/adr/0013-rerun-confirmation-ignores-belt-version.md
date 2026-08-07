# Re-run confirmation diffs skillVersion and expoSdkRange, not beltVersion

ADR-0006 says re-running `belt agent add <feature>` overwrites the installed skill, "confirming when versions differ." That confirmation compares only `skillVersion` and `expoSdkRange` between the installed copy and the one about to be written — not `beltVersion`. A bare Belt release bump re-stamps silently; the prompt only fires when the feature's own content-relevant metadata actually changed. In `--no-interactive` mode the prompt is skipped entirely and the overwrite proceeds, matching the confirm pattern already used in `addNotifications`.

## Considered Options

- **Diff all three stamped fields**: simpler comparison, but `beltVersion` changes on every Belt release regardless of whether a given skill's content changed — this would prompt on nearly every re-run post-upgrade even when nothing about the feature skill itself is different, training users to reflexively click through it.

## Consequences

- The confirmation genuinely signals "this feature skill's content or targeted Expo range changed" — not "you upgraded Belt."
