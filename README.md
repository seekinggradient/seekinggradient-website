# Seeking Gradient

A personal blog built with [Astro](https://astro.build).

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build → dist/
npm run preview  # preview built site
```

## Ideas Notebook

The ideas notebook from `ideas-repository` now lives in this repo under:

```txt
src/ideas/
```

The public route is `/ideas`. To add or edit ideas, update:

```txt
src/ideas/data/ideas.ts
```

Images and diagrams used by the notebook live in `public/mockups/` and
`public/diagrams/`. The notebook is mounted as a React island inside Astro, so
the main site and ideas archive can deploy together from this single repo.

---

## Text-to-Speech (TTS) for Blog Posts

Every blog post page optionally shows a **Listen** audio player when a matching
MP3 file exists at `public/audio/blog/<slug>.mp3`.  If no file is present the
player is hidden automatically — no build errors, no broken pages.

### Prerequisites

| Provider | Env var required | Optional env vars |
|----------|-----------------|-------------------|
| OpenAI (default) | `OPENAI_API_KEY` | `TTS_MODEL` (default `tts-1`), `TTS_VOICE` (default `alloy`) |
| ElevenLabs | `ELEVENLABS_API_KEY` | `ELEVENLABS_VOICE_ID` (default Bella) |

Set `TTS_PROVIDER=elevenlabs` to switch providers.

### Generate audio

```sh
# Generate MP3s for all posts that don't have one yet
npm run tts:blog

# Regenerate all posts (overwrite existing files)
npm run tts:blog:force

# Single post by slug
npm run tts:blog -- --slug quiet-divide

# With ElevenLabs instead of OpenAI
TTS_PROVIDER=elevenlabs ELEVENLABS_API_KEY=sk-... npm run tts:blog
```

Generated files are written to `public/audio/blog/` and should be **committed
to the repository** so the static build can serve them.

> Note: `npm run build` now auto-runs `npm run tts:blog` via `prebuild`.
> If API credentials are missing, generation is skipped gracefully and build still succeeds.

### How it works

1. `scripts/generate-tts.mjs` reads every `src/content/blog/*.md` file.
2. Frontmatter is stripped; markdown is converted to plain text.
3. The TTS API is called (chunked automatically for long posts).
4. The resulting MP3 is saved to `public/audio/blog/<slug>.mp3`.
5. At build time, `src/pages/blog/[...slug].astro` checks whether the MP3
   exists and passes its URL to the `AudioPlayer` component.
6. `src/components/AudioPlayer.astro` renders a play/pause player with a
   progress bar.  If the file is missing the component renders nothing.

### Adding a new post

1. Add `src/content/blog/<your-slug>.md` as usual.
2. Run `npm run tts:blog` to generate its audio file.
3. Commit both the markdown and the generated `public/audio/blog/<your-slug>.mp3`.
4. Run `npm run build` to verify.
