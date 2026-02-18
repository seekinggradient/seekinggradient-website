#!/usr/bin/env node
/**
 * scripts/generate-tts.mjs
 *
 * Generates TTS audio files for every blog post and writes them to
 * public/audio/blog/<slug>.mp3.  Existing files are skipped unless
 * --force is passed.
 *
 * Supported TTS providers (set via env var TTS_PROVIDER, default: openai):
 *   • openai  – requires OPENAI_API_KEY
 *              uses the /v1/audio/speech endpoint (tts-1 model, alloy voice)
 *   • elevenlabs – requires ELEVENLABS_API_KEY and optionally ELEVENLABS_VOICE_ID
 *
 * Usage:
 *   npm run tts:blog                   # generate missing audio
 *   npm run tts:blog -- --force        # regenerate all audio
 *   npm run tts:blog -- --slug quiet-divide   # single post
 *
 * The script is intentionally dependency-free (Node 18+ built-ins only).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'blog');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio', 'blog');

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const slugFlag = args.indexOf('--slug');
const ONLY_SLUG = slugFlag !== -1 ? args[slugFlag + 1] : null;

function hasProviderCredentials() {
  const provider = (process.env.TTS_PROVIDER || 'openai').toLowerCase();
  if (provider === 'elevenlabs') return Boolean(process.env.ELEVENLABS_API_KEY);
  return Boolean(process.env.OPENAI_API_KEY);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip YAML frontmatter from markdown content */
function stripFrontmatter(content) {
  if (content.startsWith('---')) {
    const end = content.indexOf('\n---', 3);
    if (end !== -1) return content.slice(end + 4).trim();
  }
  return content.trim();
}

/** Convert markdown to plain text suitable for TTS */
function markdownToPlainText(md) {
  return md
    // Remove code fences
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Convert links to their label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove ATX headings markers but keep text
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove blockquote markers
    .replace(/^>\s?/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Read frontmatter title and description for richer TTS intro */
function parseFrontmatter(content) {
  const result = { title: '', description: '' };
  if (!content.startsWith('---')) return result;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return result;
  const block = content.slice(3, end);
  const titleMatch = block.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const descMatch = block.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch) result.title = titleMatch[1].trim();
  if (descMatch) result.description = descMatch[1].trim();
  return result;
}

/** Derive slug from filename (strip .md / .mdx) */
function fileToSlug(filename) {
  return filename.replace(/\.(md|mdx)$/, '');
}

// ---------------------------------------------------------------------------
// TTS providers
// ---------------------------------------------------------------------------

async function ttsOpenAI(text, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

  const model = process.env.TTS_MODEL || 'tts-1';
  const voice = process.env.TTS_VOICE || 'alloy';

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, voice, input: text, response_format: 'mp3' }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI TTS error ${response.status}: ${err}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

async function ttsElevenLabs(text, outputPath) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is not set');

  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // default: Bella
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs TTS error ${response.status}: ${err}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

async function generateAudio(text, outputPath) {
  const provider = (process.env.TTS_PROVIDER || 'openai').toLowerCase();
  if (provider === 'elevenlabs') {
    await ttsElevenLabs(text, outputPath);
  } else {
    await ttsOpenAI(text, outputPath);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  if (!hasProviderCredentials()) {
    const provider = (process.env.TTS_PROVIDER || 'openai').toLowerCase();
    console.log(`⚠️  Skipping TTS generation: missing credentials for provider '${provider}'.`);
    console.log('    Set OPENAI_API_KEY (default) or TTS_PROVIDER=elevenlabs + ELEVENLABS_API_KEY.');
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.(md|mdx)$/.test(f));

  if (files.length === 0) {
    console.log('No blog posts found in', CONTENT_DIR);
    return;
  }

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const slug = fileToSlug(file);

    if (ONLY_SLUG && slug !== ONLY_SLUG) continue;

    const outputPath = path.join(AUDIO_DIR, `${slug}.mp3`);

    if (!FORCE && fs.existsSync(outputPath)) {
      console.log(`⏭  Skipping ${slug} (already exists, use --force to regenerate)`);
      skipped++;
      continue;
    }

    console.log(`🔊 Generating TTS for: ${slug}`);

    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { title, description } = parseFrontmatter(raw);
    const body = markdownToPlainText(stripFrontmatter(raw));

    // Build the spoken text: optional title/description intro + body
    const parts = [];
    if (title) parts.push(title + '.');
    if (description) parts.push(description + '.');
    parts.push(body);
    const spokenText = parts.join('\n\n');

    // OpenAI TTS has a 4096-char limit per request; chunk if needed
    const CHUNK_SIZE = 4000;
    if (spokenText.length <= CHUNK_SIZE) {
      try {
        await generateAudio(spokenText, outputPath);
        console.log(`   ✅ Written to ${path.relative(ROOT, outputPath)}`);
        generated++;
      } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
        errors++;
      }
    } else {
      // Multi-chunk: generate per-paragraph and concatenate raw MP3 frames
      // (simple concat works for MP3 files from the same API session)
      const chunks = [];
      let current = '';
      for (const paragraph of spokenText.split('\n\n')) {
        if ((current + '\n\n' + paragraph).length > CHUNK_SIZE) {
          if (current) chunks.push(current.trim());
          current = paragraph;
        } else {
          current = current ? current + '\n\n' + paragraph : paragraph;
        }
      }
      if (current.trim()) chunks.push(current.trim());

      console.log(`   📄 Post is long; generating ${chunks.length} chunk(s)...`);
      const tmpFiles = [];
      let ok = true;
      for (let i = 0; i < chunks.length; i++) {
        const tmp = outputPath + `.part${i}.mp3`;
        tmpFiles.push(tmp);
        try {
          await generateAudio(chunks[i], tmp);
        } catch (err) {
          console.error(`   ❌ Chunk ${i + 1} failed: ${err.message}`);
          ok = false;
          break;
        }
      }
      if (ok) {
        // Concatenate chunks
        const parts = tmpFiles.map(f => fs.readFileSync(f));
        fs.writeFileSync(outputPath, Buffer.concat(parts));
        console.log(`   ✅ Written to ${path.relative(ROOT, outputPath)}`);
        generated++;
      } else {
        errors++;
      }
      // Clean up temp files
      tmpFiles.forEach(f => { try { fs.unlinkSync(f); } catch (_) {} });
    }
  }

  console.log(`\nDone: ${generated} generated, ${skipped} skipped, ${errors} error(s).`);
  if (errors > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
