export type BookPart = {
  label: string;
  anchor: string;
};

export type Book = {
  slug: string;
  contentSlug: string;
  order: number;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  audience: string;
  readingMinutes: number;
  chapterLabel: string;
  downloadSize: string;
  cover: string;
  epub: string;
  accent: 'mint' | 'yellow' | 'lilac';
  parts: BookPart[];
};

export const series = {
  slug: 'foundation-models',
  title: 'Foundation Models, from code to frontier.',
  description:
    'Four agent-created field guides for understanding, training, and extending the models underneath modern AI.',
  verified: 'August 4, 2026',
};

export const books: Book[] = [
  {
    slug: 'inside-a-transformer-slowly',
    contentSlug: 'foundation-models/inside-a-transformer-slowly',
    order: 1,
    title: 'Inside a Transformer, slowly',
    shortTitle: 'Inside a Transformer',
    eyebrow: 'Build the intuition',
    description:
      'An illustrated, math-and-code-friendly guide from raw web pages to token batches, attention, residual streams, training runs, inference, and Kimi K3.',
    audience:
      'For ML-literate readers who know basic neural networks and want stronger Transformer intuition.',
    readingMinutes: 136,
    chapterLabel: '19 chapters + self-test',
    downloadSize: '8.9 MB',
    cover: '/books/foundation-models/covers/inside-a-transformer-slowly.png',
    epub: '/books/foundation-models/downloads/inside-a-transformer-slowly.epub',
    accent: 'yellow',
    parts: [
      { label: 'See the whole model', anchor: '0-the-whole-model-in-one-picture' },
      { label: 'Move from raw text to tokens', anchor: 'practical-bridge-before-tokens-where-does-the-text-come-from' },
      { label: 'Turn tokens into vectors', anchor: '2-an-embedding-turns-an-id-into-a-vector' },
      { label: 'Build attention and the residual stream', anchor: '5-the-residual-stream-a-highway-through-depth' },
      { label: 'Assemble a Transformer block', anchor: '9-one-complete-transformer-block' },
      { label: 'Train, infer, and cache', anchor: '10-training-how-the-knobs-move' },
      { label: 'Bridge from GPT-2 to Kimi K3', anchor: '13-from-gpt-2-to-kimi-k3-without-losing-the-foundation' },
    ],
  },
  {
    slug: 'inside-nanogpt-line-by-line',
    contentSlug: 'foundation-models/inside-nanogpt-line-by-line',
    order: 2,
    title: 'Inside nanoGPT, line by line',
    shortTitle: 'Inside nanoGPT',
    eyebrow: 'Start with the code',
    description:
      "A source-pinned, tensor-shape-driven walkthrough of Andrej Karpathy's nanoGPT, from LayerNorm and causal attention through training, checkpoints, and generation.",
    audience:
      'For ML-literate readers who want to turn Transformer theory into working PyTorch code.',
    readingMinutes: 133,
    chapterLabel: '19 chapters + field guide',
    downloadSize: '3.3 MB',
    cover: '/books/foundation-models/covers/inside-nanogpt-line-by-line.png',
    epub: '/books/foundation-models/downloads/inside-nanogpt-line-by-line.epub',
    accent: 'mint',
    parts: [
      { label: 'Open the file', anchor: 'before-opening-the-file' },
      { label: 'Map the whole model', anchor: '0-the-entire-file-in-one-map' },
      { label: 'LayerNorm and causal attention', anchor: '2-layernorm-normalize-each-tokens-feature-vector' },
      { label: 'The MLP and Transformer block', anchor: '4-the-mlp-transform-features-without-mixing-positions' },
      { label: 'Construct and run GPT', anchor: '6-constructing-gpt-turn-the-block-into-a-model' },
      { label: 'Train, checkpoint, and generate', anchor: '13-outside-modelpy-how-the-model-becomes-trainable' },
      { label: 'Debug and modify the baseline', anchor: '14-a-practical-debugging-field-guide' },
    ],
  },
  {
    slug: 'practical-model-training',
    contentSlug: 'foundation-models/practical-model-training',
    order: 3,
    title: 'Practical Model Training for ML Practitioners',
    shortTitle: 'Practical Model Training',
    eyebrow: 'Train what matters',
    description:
      'A rigorous field guide to choosing, adapting, evaluating, and shipping language and multimodal foundation models.',
    audience:
      'For practitioners who understand neural networks and want to run serious model-adaptation experiments.',
    readingMinutes: 180,
    chapterLabel: '27 chapters + exercises',
    downloadSize: '3.9 MB',
    cover: '/books/foundation-models/covers/practical-model-training.png',
    epub: '/books/foundation-models/downloads/practical-model-training.epub',
    accent: 'yellow',
    parts: [
      { label: 'Choose the intervention', anchor: 'part-i--choose-the-intervention' },
      { label: 'Make the run fit', anchor: 'part-ii--make-the-run-fit' },
      { label: 'Manufacture the data', anchor: 'part-iii--manufacture-the-data' },
      { label: 'Change the language model', anchor: 'part-iv--change-the-language-model' },
      { label: 'Preferences, verifiers, and RL', anchor: 'part-v--preferences-verifiers-and-reinforcement-learning' },
      { label: 'Multimodal adaptation', anchor: 'part-vi--multimodal-adaptation' },
      { label: 'Ship, learn, and stop paying', anchor: 'part-vii--ship-learn-and-stop-paying' },
    ],
  },
  {
    slug: 'gpt-2-to-kimi-k3',
    contentSlug: 'foundation-models/gpt-2-to-kimi-k3',
    order: 4,
    title: 'From GPT-2 to Kimi K3, from first principles',
    shortTitle: 'From GPT-2 to Kimi K3',
    eyebrow: 'Follow the architecture',
    description:
      "A first-principles tour from GPT-2 attention to Kimi K3's hybrid memory, sparse experts, depth retrieval, native vision, training, and serving systems.",
    audience:
      "For readers who know the standard Transformer and want a path into Kimi K3's architecture and systems design.",
    readingMinutes: 118,
    chapterLabel: '21 chapters + self-test',
    downloadSize: '1.2 MB',
    cover: '/books/foundation-models/covers/gpt-2-to-kimi-k3.png',
    epub: '/books/foundation-models/downloads/gpt-2-to-kimi-k3.epub',
    accent: 'lilac',
    parts: [
      { label: 'Begin with GPT-2 attention', anchor: '1-the-gpt-2-baseline-preserve-every-token-separately' },
      { label: 'Build editable sequence memory', anchor: '2-linear-attention-compress-the-history-into-a-matrix' },
      { label: 'Keep global attention', anchor: '7-why-k3-keeps-global-attention-mla-as-the-archive' },
      { label: 'Scale width and depth', anchor: '8-stable-latentmoe-scale-width-conditionally' },
      { label: 'Assemble the K3 backbone', anchor: '10-assemble-one-k3-layer-and-the-full-backbone' },
      { label: 'Train and post-train the model', anchor: '12-pre-training-data-scale-and-learning-a-million-token-regime' },
      { label: 'Serve the complete system', anchor: '14-systems-co-design-why-the-equations-are-only-half-the-model' },
    ],
  },
];

export function getBook(slug: string) {
  return books.find((book) => book.slug === slug);
}
