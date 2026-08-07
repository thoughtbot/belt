# New features only ship as feature skills

Existing deterministic features (`create`, `add env`, `add notifications`) stay as hand-written TypeScript with templates and `patchFile` — they are not migrated. Only new features are delivered as feature skills (see ADR-0001). The two models deliberately coexist: `copyTemplate`/`patchFile` remain permanent infrastructure for the existing commands, and the skill model is proven on greenfield features before any migration is considered. Migrate an existing feature only if its deterministic implementation becomes painful to maintain.
