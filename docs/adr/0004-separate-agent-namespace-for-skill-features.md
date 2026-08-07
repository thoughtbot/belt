# Skill-based features live under a separate `belt agent` namespace

Skill-based features are invoked as `belt agent add <feature>`, not overloaded onto `belt add`. The two commands make different promises: `belt add <feature>` is done when it exits; `belt agent add <feature>` emits a feature skill and hands off — the user's coding agent finishes the job. The namespace is named after the executor (`agent`) to signal that handoff at the point of invocation.

## Considered Options

- **Same verb** (`belt add` for both): one catalog, but silently changes the contract of an existing command — a user who ran `add env` expects `add analytics` to finish the work, not emit instructions.
- **`belt skill add`**: names the artifact (matches the glossary term "feature skill"), rejected in favor of naming the actor the user must go to next.

## Consequences

- The feature catalog is split across two help screens; docs must explain which features live where.
- Room for sibling commands under the namespace later (`belt agent list`, `belt agent update`).
