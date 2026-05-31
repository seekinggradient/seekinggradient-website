# Ideas Notebook Guidance

## Generated Visuals

- Every AI-generated raster image used by an idea page must expose its generation prompt on the page.
- Add prompts through the `prompt` field on the relevant `VisualAsset` entry in `src/ideas/pages/IdeaPage.tsx`.
- Treat the prompt as part caption, part provenance, and part handoff note for future agents.
- When adding a new idea visual, include:
  - the image path under `public/mockups/` or `public/diagrams/`;
  - a concise human caption;
  - useful alt text;
  - the exact generation prompt or a faithful normalized version of it.
