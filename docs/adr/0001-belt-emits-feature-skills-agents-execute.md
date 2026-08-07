# Belt emits feature skills; coding agents execute them

Future Belt features are delivered as feature skills: curated, versioned markdown instruction packages (agent skill format, `.claude/skills/belt-add-<feature>/SKILL.md`) that Belt copies into the target repo. Belt itself stays deterministic and offline — it makes no LLM calls and does not invoke an agent. The user's own coding agent (Claude Code via `/belt-add-<feature>`, or any agent pointed at the skill) executes the instructions and adapts them to the target codebase.

## Considered Options

- **Belt invokes the agent itself** (`claude -p`): one-command UX, rejected because Belt would take on a dependency on which agent the user has installed, their auth, and mid-scaffold failure handling.
- **Belt generates instructions via LLM at runtime**: most adaptive to the target codebase, rejected because it requires API keys, output varies per run, and thoughtbot could no longer QA the exact instructions shipped.
- **Neutral playbook format** (`.belt/playbooks/` + AGENTS.md pointer): more agent-agnostic, rejected because the skill format is emerging as a cross-agent standard and gives slash-command ergonomics in Claude Code.

## Consequences

- Adaptive behavior that today lives in TypeScript (patch fallbacks, idempotency checks) moves into skill prose executed by an agent — QA shifts from unit tests to verifying agent outcomes.
- Belt requires no API keys and works offline; the AI cost and capability ceiling belong to the user's agent.
