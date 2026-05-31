// ─────────────────────────────────────────────────────────────────────────────
// Ideas data file.
//
// To add a new idea: append a new object to the `ideas` array below.
// - `slug` becomes the URL: /ideas/<slug>. Keep it kebab-case and unique.
// - `status` is one of: "seed" | "sketch" | "exploring" | "shelved".
// - All long-form fields accept plain strings; paragraphs split on blank lines.
// - Order in this array controls order on the index page.
// ─────────────────────────────────────────────────────────────────────────────

export type IdeaStatus = 'seed' | 'sketch' | 'exploring' | 'shelved';

export interface Idea {
  slug: string;
  number: string;          // display number, e.g. "N° 001"
  title: string;
  tagline: string;         // one-line hook on the index
  domain: string;          // e.g. "Consumer · iOS"
  status: IdeaStatus;
  year: string;            // year first written down
  summary: string;         // 2–4 sentence overview at top of the idea page
  sections: { heading: string; body: string }[];
  tags: string[];
}

export const ideas: Idea[] = [
  {
    slug: 'icloud-album-printer',
    number: 'N° 001',
    title: 'A printable album, proposed from your photo library',
    tagline: 'An app that reads your iCloud Photo Library and offers a finished, orderable photo book.',
    domain: 'Consumer · iOS',
    status: 'sketch',
    year: '2026',
    tags: ['iOS', 'photos', 'on-device ML', 'print'],
    summary:
      'Most people have thousands of photos and zero photo books. The bottleneck is curation, not printing. This app asks for access to a user\'s iCloud Photo Library and proposes a complete, well-sequenced album the user can re-order, edit lightly, and order as a printed book.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Existing photo-book tools assume you arrive with a folder, a theme, and patience. Most people have none of these.\n\nThe library itself contains the answer: a year, a trip, a person, a season. The work is recognising the shape of an album inside thousands of bursts, screenshots, and near-duplicates, then choosing fewer than fifty frames that hold together.',
      },
      {
        heading: 'What it does',
        body:
          'On first launch, the app requests Photo Library access and runs entirely on-device. It proposes one album at a time — a trip, a season, a person — with a cover, a sequence, and a suggested length.\n\nThe user can swap photos, re-order spreads, tighten a chapter, and add short captions. When they\'re happy, the app renders a print-ready PDF and hands off to a print-on-demand partner for fulfilment.',
      },
      {
        heading: 'Why it might work',
        body:
          'The interesting product surface is not the printing — that is a commodity. It is the proposal: a finished thing on first open, not an empty canvas. Apple Photos already does clustering for Memories, but it does not push toward a physical artefact.\n\nOn-device vision models are now good enough to rank duplicates, detect faces, and group by event without sending data off the phone — which is also the only acceptable privacy posture for a library this personal.',
      },
      {
        heading: 'Open questions',
        body:
          'What is the right cadence — one album a year, one a season, one a trip? How does the app earn trust to suggest people-themed albums (e.g. "your dad, 2020–2025") without being unsettling? Can a small team realistically own the print-fulfilment side, or is the right play to partner with an existing book printer and focus entirely on curation?',
      },
    ],
  },
  {
    slug: 'mac-omnibar-for-agents',
    number: 'N° 002',
    title: 'A Mac omnibar for agent harnesses',
    tagline: 'A keyboard-summoned bar that talks to OpenClaw or another harness, with optional screen context.',
    domain: 'Developer tools · macOS',
    status: 'exploring',
    year: '2026',
    tags: ['macOS', 'agents', 'OpenClaw', 'developer tools'],
    summary:
      'Agent harnesses live in terminals and web tabs. The fastest interface on a Mac is a keyboard shortcut and a single line of text. This is a Spotlight-style bar that connects to a local or remote agent harness, can see what is on screen when asked, and stays out of the way when not.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Talking to an agent today means switching apps, finding the right tab or pane, and typing into a chat box that is rarely where your attention is. The cost of starting a conversation is high enough that people batch their questions, which is the opposite of what makes agents useful.\n\nMeanwhile, the most expressive context the agent could have — what is currently on the user\'s screen — is the thing it almost never sees.',
        },
      {
        heading: 'What it does',
        body:
          'A single global hotkey opens a bar at the top of the screen. The user types or speaks; the bar streams a response inline. A modifier key attaches a screenshot of the active window or selection as context. Results that need a longer life — a draft, a plan, a tool run — open in a side panel that can be torn off.\n\nUnder the hood it speaks to a configurable backend: a local OpenClaw harness over a socket, a remote agent over HTTPS, or a model API directly. The bar itself is thin; the intelligence lives in the harness.',
      },
      {
        heading: 'Why it might work',
        body:
          'Spotlight, Raycast, and Alfred all demonstrate that a keyboard-summoned bar is the highest-velocity surface on a Mac. None of them are built around long-running, tool-using agents — they assume single-shot commands.\n\nA bar designed for streaming responses, screen context, and durable side-conversations could be the default front end to any agent harness, the way a terminal emulator is the default front end to a shell.',
      },
      {
        heading: 'Open questions',
        body:
          'How much of the harness should live in the bar versus a separate daemon? What is the right permission model for screen capture — per-request, per-app, or always? Is there a meaningful version of this that works without a paid model subscription, or is the floor a "bring your own keys" tool for developers?',
      },
    ],
  },
  {
    slug: 'portable-memory-layer',
    number: 'N° 003',
    title: 'A portable memory layer for agents',
    tagline: 'One memory store that hooks into any agent harness, email, and other sources — focused only on remembering.',
    domain: 'Infrastructure · AI',
    status: 'seed',
    year: '2026',
    tags: ['memory', 'agents', 'infrastructure'],
    summary:
      'Every agent harness is reinventing memory, badly. This is a standalone memory layer that any harness can plug into, alongside ingestion from email and other personal sources. It does not try to be an agent itself — it only retains, indexes, and serves information back when asked.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Memory is currently bundled into whichever harness happens to be hosting the conversation. Switch tools and your context is gone. Use two tools and they each remember a different half of the same project.\n\nThe interesting work — what to store, how to retrieve, what to forget — gets done shallowly inside every harness because none of them treat memory as the product.',
      },
      {
        heading: 'What it does',
        body:
          'A single service holds long-lived memory for a person. Agents authenticate, then read and write through a small, well-specified API. Inside the service, agents can carve out workspaces — scoped buckets of context for an ongoing project — and the service handles dedup, summarisation, and recall.\n\nIngestion connectors pull from email, calendar, and other personal data sources directly, so memory is not limited to whatever happens to pass through a chat window.',
      },
      {
        heading: 'Distribution path: plugins first',
        body:
          'The cleanest wedge may be a plugin, not a standalone app. Modern harnesses increasingly expose plugin systems that bundle instructions, skills, app integrations, lifecycle hooks, and MCP servers. A memory product could ship as a small plugin for each major harness: install it, authenticate once, and the agent immediately gains durable write, search, and recall tools.\n\nThe portable layer itself should still be harness-agnostic. The plugin is the adapter: it teaches Claude Code, Codex, OpenClaw, or another client when to save context, how to create workspaces, and how to retrieve memories without requiring the harness to own the memory database.',
      },
      {
        heading: 'Why it might work',
        body:
          'Memory has the shape of infrastructure, not a feature: it benefits from being one thing that many tools rely on, and it gets worse when fragmented. A focused product can spend its attention on retention quality — the part every harness currently treats as a side quest.\n\nThe analogue is what object storage did for files: the harness no longer has to own the durable layer, and the durable layer can be much better than anything a harness would build for itself.',
      },
      {
        heading: 'Open questions',
        body:
          'What is the smallest useful API — write/read/search, or something richer? How does the service stay honest about provenance and confidence over time? What does the trust story look like when one piece of software holds the union of someone\'s email, calendar, and agent transcripts?',
      },
    ],
  },

  {
    slug: 'solo-service-business-kit',
    number: 'N° 004',
    title: 'A business-in-a-box kit for solo service workers',
    tagline: 'A website, flyer, referral loop, and booking system for gig-worker cleaners and other solo operators.',
    domain: 'Local services · SMB tools',
    status: 'sketch',
    year: '2026',
    tags: ['local services', 'cleaning', 'booking', 'referrals'],
    summary:
      'A package that helps gig-worker house cleaners look and operate like a legitimate local business. The first wedge came from building cnjcleaners.com for cleaners who came to the house; the next step is turning that one-off help into a repeatable kit. The same playbook could later apply to handymen, landscapers, pet sitters, and other self-employed service workers.',
    sections: [
      {
        heading: 'The friction',
        body:
          'A good solo cleaner can have strong word-of-mouth and still look invisible online. They may rely on marketplace platforms, text threads, Venmo, and paper referrals, which makes them seem less trustworthy than they are and keeps them dependent on intermediaries.\n\nThe missing piece is not a giant SaaS platform. It is a credible public presence and a few practical business primitives: a site, a flyer, booking, referrals, and simple follow-up.',
      },
      {
        heading: 'What it does',
        body:
          'The product creates a polished mini-brand for a solo operator: a simple website, printable flyer, service menu, booking request flow, and referral offer. It could include QR-coded flyers, before-and-after photo sections, testimonials, neighborhood targeting, and reminders to ask happy customers for referrals.\n\nThe first vertical is house cleaning because the need is concrete and the cnjcleaners.com build proved the shape of the problem. Once the template works, the same kit can be adapted to handyman businesses and other self-employed local services.',
      },
      {
        heading: 'Why it might work',
        body:
          'The customer does not need a complex CRM. They need to look trustworthy enough for a neighbor to book them directly. A credible website plus referral loop can move them from platform labor to owner-operator.\n\nThis also has a human wedge: the buyer may be a customer who wants to help a great service worker level up. That creates a distribution path through existing trust, not cold acquisition.',
      },
      {
        heading: 'Open questions',
        body:
          'Is the buyer the service worker, a grateful customer, or an agency that wants to set up many workers? How much customization is required before it stops being a package? What is the right ongoing fee for hosting, booking, and support without becoming a full managed-service business?',
      },
    ],
  },
  {
    slug: 'stock-thesis-research-pipeline',
    number: 'N° 005',
    title: 'A persistent stock thesis research pipeline',
    tagline: 'An investing research system that tracks market theses, stocks, briefs, audio, and a simulated portfolio.',
    domain: 'Investing · Research automation',
    status: 'exploring',
    year: '2026',
    tags: ['investing', 'research', 'daily brief', 'simulated portfolio'],
    summary:
      'A research pipeline that stays current on market news, forms hypotheses about where the market is going, and tracks the stocks that might express those theses. A thesis might be: semiconductor companies will boom over the next two years because they are a bottleneck in the AI build-out. The system produces a daily written brief and audio/podcast brief, then runs a simulated portfolio to test whether the theses are actually working.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Most market research is either too noisy or too static. A person reads a burst of news, forms a view, and then loses the thread as the market changes. The hard part is not only finding an idea; it is maintaining the chain from thesis to evidence to stock candidates to portfolio performance.',
      },
      {
        heading: 'What it does',
        body:
          'The system ingests current news, filings, earnings commentary, analyst notes where available, and market data. It proposes and maintains explicit theses, attaches evidence to each one, identifies related public companies, and tracks which stocks look most interesting as the facts change.\n\nEach day it produces a written brief and an audio brief. It also runs a simulated portfolio tied to the theses, so the research loop has a scoreboard instead of becoming pure commentary.',
      },
      {
        heading: 'Why it might work',
        body:
          'A thesis is a better organizing unit than a ticker. It lets the system reason about why a stock might matter and what would falsify the idea. Persistent tracking also creates compounding context: yesterday\'s hypothesis becomes today\'s question, not a forgotten note.',
      },
      {
        heading: 'Open questions',
        body:
          'How should the system avoid sounding more certain than it is? What data sources are good enough without becoming expensive or legally awkward? Should the simulated portfolio optimize for education and accountability rather than pretending to be investment advice?',
      },
    ],
  },
  {
    slug: 'friend-compilation-video-maker',
    number: 'N° 006',
    title: 'A compilation video maker for friends and milestones',
    tagline: 'A simple site for collecting friend videos, grouping them intelligently, and exporting a polished compilation.',
    domain: 'Consumer · Video tools',
    status: 'sketch',
    year: '2026',
    tags: ['video', 'events', 'friends', 'transcription'],
    summary:
      'A lightweight website for making compilation videos for birthdays, graduations, proposals, weddings, and other moments where friends record short messages. It sends invites, collects clips by a deadline, transcribes the videos, groups them by relationship or theme, formats everything consistently, and exports a polished final video with room for customization.',
    sections: [
      {
        heading: 'The friction',
        body:
          'These videos are emotionally powerful but operationally annoying. Someone has to chase friends for clips, manage deadlines, download files from random links, normalize audio and aspect ratios, decide the order, and edit the whole thing together.\n\nThat burden often falls on the one person who most wants the gift to feel personal, which makes the project stressful instead of joyful.',
      },
      {
        heading: 'What it does',
        body:
          'The organizer creates a project, adds invitees, sets a deadline, and sends a simple upload link. Contributors record or upload a clip from their phone. The app transcribes every clip, detects names and relationships where possible, and suggests a structure: family first, college friends, coworkers, childhood stories, congratulations, closing montage.\n\nIt then normalizes format, trims obvious dead air, adds tasteful title cards or lower-thirds, and exports a finished video. The organizer can still reorder sections, remove clips, adjust music, and choose a style before final export.',
      },
      {
        heading: 'Why it might work',
        body:
          'The product is anchored in real use cases: graduation videos, proposal congratulations, wedding messages, retirement tributes. People already make these manually because the emotional payoff is high. A tool that removes the logistics while preserving the personal feel could become the default way to coordinate milestone videos.',
      },
      {
        heading: 'Open questions',
        body:
          'Should the first version be fully automated export or a concierge-assisted editing flow? How much creative control do organizers actually want? What is the best pricing model: per finished video, subscription for families, or a paid upgrade for longer/high-resolution exports?',
      },
    ],
  },
  {
    slug: 'visual-note-transcription-pipeline',
    number: 'N° 007',
    title: 'A visual transcription pipeline for handwritten notes',
    tagline: 'A patchwise OCR-plus-vision workflow that turns messy handwritten PDFs into faithful Markdown.',
    domain: 'AI tools · Document intelligence',
    status: 'seed',
    year: '2026',
    tags: ['handwriting', 'OCR', 'vision models', 'Markdown'],
    summary:
      'Most document conversion tools treat a handwritten PDF as an OCR problem. The more powerful approach is to treat it as a visual reconstruction problem: render pages, split them into meaningful patches, use cheap OCR as a weak hint, ask small vision models to transcribe local regions, and then reassemble the thought structure into Markdown. The product is not merely text extraction; it preserves the topology of notes: headings, arrows, marginalia, bullets, diagrams, and uncertainty.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Handwritten notes are full of structure that normal OCR flattens. A page may have a title, a main outline, side notes, arrows, circles, diagrams, and continuation marks. The useful information is not only what the words say, but how the thought is arranged on the page.\n\nExisting tools often choose one of two bad options: dump a noisy OCR transcript, or ask a large vision model to interpret the whole page in one expensive pass. The first loses meaning; the second is costly and still brittle when the page is dense.',
      },
      {
        heading: 'What it does',
        body:
          'The pipeline starts by extracting any embedded PDF text, but treats it only as a hint. It renders each page at high resolution, detects layout regions, and crops the page into readable patches: title block, dense outline, margin note, diagram, footer, continuation fragment.\n\nEach patch goes through cheap OCR first, then a small vision-capable model with a narrow prompt: transcribe this region faithfully, preserve bullets and arrows, and mark uncertainty instead of guessing. A text model then merges the patch transcripts into a clean Markdown document using page order, coordinates, indentation, and neighboring context.',
      },
      {
        heading: 'Why it might work',
        body:
          'The key cost insight is that most of the page does not need a frontier model. Clear printed text can stay OCR-only. Clear handwriting can go to a small vision model. Dense or ambiguous patches can escalate to a stronger model or a human correction loop.\n\nThis mirrors how a careful person actually transcribes notes: scan the whole page, zoom into sections, compare interpretations, preserve structure, and ask for help only on uncertain words. Product quality comes from orchestrating that process, not from assuming one model call can understand the entire document at once.',
      },
      {
        heading: 'Product shape',
        body:
          'The first version could be a repeatable local or hosted pipeline: upload a PDF, receive a faithful Markdown transcription, and review a queue of low-confidence snippets side by side with their source crops. Corrections feed a user-specific handwriting profile so the system learns recurring terms, abbreviations, and letter shapes.\n\nA more complete version would produce multiple outputs: raw faithful transcript, cleaned conceptual outline, extracted action items, diagrams-as-text, and a searchable archive linked back to page coordinates. For teams, the wedge could be research notebooks, meeting whiteboards, lab notes, field notes, or founder idea journals.',
      },
      {
        heading: 'Open questions',
        body:
          'How good can the patch detection be with classical computer vision before a layout model is needed? What is the right confidence model for handwriting, where wrong-but-plausible readings are dangerous? How much user correction is enough to personalize the system? Should the product optimize for faithful archival transcription, cleaned synthesis, or both as separate modes?',
      },
    ],
  },
  {
    slug: 'do-it-again-reviews',
    number: 'N° 008',
    title: 'Again: a binary review network for experiences',
    tagline: 'A Yelp-like consumer review layer built around one question: would you do it again?',
    domain: 'Consumer · Reviews',
    status: 'seed',
    year: '2026',
    tags: ['reviews', 'restaurants', 'movies', 'travel', 'consumer'],
    summary:
      'Most review systems ask people to compress a messy experience into stars. This idea asks a more behavioral question: if you had the option, would you do it again? The same binary signal can apply across restaurants, movies, shows, hotels, trips, classes, concerts, and almost any other experience where repeat intent says more than generic approval.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Star ratings are noisy because they ask people to grade too many things at once: quality, price, mood, expectations, service, taste, and whether they are annoyed that day. A four-star restaurant review can mean "pretty good but not special," "excellent but expensive," or "I liked it but would never go back."\n\nMost review networks are also category-specific. Letterboxd knows movies, Yelp knows restaurants, Tripadvisor knows travel, Google Maps knows places. But people make recommendations across all of life: where to eat, what to watch, where to stay, what to try, what to skip. The common unit is not the category; it is the decision after the experience.',
      },
      {
        heading: 'What it does',
        body:
          'Every reviewed thing gets one core prompt, adapted to the category: would you eat here again, watch this again, stay here again, book this trip again, see this show again, take this class again? The user answers yes or no. They can add a note, photos, price context, who they went with, or a reason, but the atomic rating is binary.\n\nThe product can then show an "again rate" for each experience, plus the distribution among friends, locals, travelers, families, dates, solo visitors, or people with similar taste. A person can keep a private or public log of things they would do again, things they would not, and edge cases where the text matters more than the vote.',
      },
      {
        heading: 'Why it might work',
        body:
          'Repeat intent is a sharper consumer signal than generic satisfaction. It bakes in price, hassle, opportunity cost, and memory. Someone might admire a movie and still not want to watch it again; they might give a restaurant only three stars and still crave it monthly.\n\nThe binary format also lowers the cost of contribution. It is closer to a swipe, thumbs up/down, or "save/skip" action than a formal review. Over time, that could create a cross-category taste graph: not "what did people rate highly?", but "what do people actually want another round of?"',
      },
      {
        heading: 'Product shape',
        body:
          'The first version could be a mobile-first log and search tool. After an experience, a user taps yes or no, adds an optional note, and tags the category. Search results prioritize the again rate, friend votes, and short reasons instead of long review pages.\n\nA strong wedge might be social: follow friends whose taste you trust, see what they would do again, and ask the network a plain-language question like "date-night restaurants in San Francisco people would actually repeat" or "movies my friends would rewatch." The same primitive could power maps, watchlists, trip recaps, and personal annual lists.',
      },
      {
        heading: 'Open questions',
        body:
          'Is "would do it again" too harsh for one-time experiences, like a once-in-a-lifetime hike or an intentionally difficult film? Should the product support a third state such as "glad I did it once"? How does it avoid becoming reductive when the best experiences are complicated?\n\nThe name also matters. "Again" is clean and broad, but maybe too generic. "Do It Again" makes the prompt explicit but sounds more like a slogan. The best name should make the review action feel obvious in one second.',
      },
    ],
  },
];

export const ideaBySlug = (slug: string) => ideas.find((i) => i.slug === slug);
