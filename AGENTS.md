# Repository Guidance

## Privacy Guardrails

- Never include the site owner's real personal name in public-facing SeekingGradient materials, examples, screenshots, generated pages, metadata, or docs.
- Use generic placeholders such as "the user", "the owner", "the creator", "example-user", or "creator.example.com" instead.
- Treat names inferred from local paths, git configuration, prior conversations, or machine/user account names as private context, not publishable content.
- Before committing public content, search changed files for accidental personal-name leaks and replace them.

## Generated Images

- Any generated image that is committed to or referenced by this repository must include the generation prompt used to create it.
- For Ideas notebook visuals, add the prompt to the corresponding `VisualAsset.prompt` field in `src/ideas/pages/IdeaPage.tsx` so it appears on the public idea page.
- If an image is not part of an idea page, store the prompt in the nearest consuming source file, a sidecar Markdown file, or another durable project-local note. Do not leave generated images without reproducible prompt context.
- Keep prompt text exact enough that a future agent can understand the intent, visual style, constraints, and negative constraints.

<!-- agentsfs:begin ./agentsfs -->
## Persistent memory (agentsfs)

A durable, repo-shared memory lives at `./agentsfs`.
Before starting work, read `./agentsfs/AGENTS.md` and orient yourself.
Consult it before re-researching anything you may already know, and record
durable knowledge there as you work, following its contract.
<!-- agentsfs:end ./agentsfs -->
