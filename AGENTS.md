# Repository Guidance

## Generated Images

- Any generated image that is committed to or referenced by this repository must include the generation prompt used to create it.
- For Ideas notebook visuals, add the prompt to the corresponding `VisualAsset.prompt` field in `src/ideas/pages/IdeaPage.tsx` so it appears on the public idea page.
- If an image is not part of an idea page, store the prompt in the nearest consuming source file, a sidecar Markdown file, or another durable project-local note. Do not leave generated images without reproducible prompt context.
- Keep prompt text exact enough that a future agent can understand the intent, visual style, constraints, and negative constraints.
