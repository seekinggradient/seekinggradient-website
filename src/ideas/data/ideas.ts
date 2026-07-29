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

export interface IdeaReference {
  title: string;
  href: string;
  note?: string;
}

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
  references?: IdeaReference[];
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
    references: [
      {
        title: 'TwelveLabs',
        href: 'https://www.twelvelabs.io/',
        note:
          'Video-intelligence platform and API for natural-language video search, segmentation, highlights, and editing-workflow export; a likely enabling layer for moving from transcript-only compilation toward agentic video editing.',
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
  {
    slug: 'agent-native-html-artifacts',
    number: 'N° 009',
    title: 'An agent-native home for HTML artifacts',
    tagline: 'The idea became MadeWeb: a place for agents and humans to publish useful single-page HTML artifacts.',
    domain: 'Web infrastructure · Publishing',
    status: 'exploring',
    year: '2026',
    tags: ['HTML', 'agents', 'static hosting', 'personal web', 'widgets'],
    summary:
      'AI coding makes it easy to create small, useful, beautiful HTML applications for a specific trip, explanation, decision, dashboard, or person. The hard part is no longer making the page; it is giving those artifacts a durable home, a URL, a profile surface, and a way to shrink into cards and widgets. This idea has since been built as MadeWeb, available at madeweb.ai.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Tools like Cloudflare Pages, Netlify, Vercel, GitHub Pages, and Replit are powerful, but they are still project-shaped. They assume repos, builds, settings, dashboards, and a developer who understands deployment. That is too much ceremony for a one-off Vegas trip companion, a home-search route planner, or an explainer page made to understand a paper.\n\nAgents can now produce these pages on demand. What they need is not a new framework. They need a dead-simple publishing target: take this HTML, put it under my namespace, make it shareable, and remember what it is.',
      },
      {
        heading: 'Built version: MadeWeb',
        body:
          'The full idea has now been built as MadeWeb at madeweb.ai. MadeWeb is the practical version of this notebook entry: an agent-native home for publishing single-page HTML artifacts, keeping durable links, and making AI-generated pages easier to find, share, and update.\n\nThe built product sharpens the original hypothesis. The primary wedge is not a generic social feed. It is the everyday moment where an agent makes something useful and the user needs a reliable place to put it.',
      },
      {
        heading: 'What it does',
        body:
          'A user claims a namespace such as creator.example.com. A human or agent can publish an artifact with one command or MCP call: an index.html file, optional assets, optional metadata, and optional alternate views. The platform stores the artifact, versions it, serves it from a stable URL, and adds it to the user profile.\n\nThe key primitive is one artifact with multiple viewports. The full page is where someone uses the thing. The card is where they encounter it in a feed or profile. The widget is where it gets composed into another page. A plain text post is just the smallest version of the same idea.',
      },
      {
        heading: 'Why it might work',
        body:
          'The supply of tiny personal web apps is about to change. Before AI, making a custom trip app or single-purpose explainer was too expensive for most moments. With agents, the cost can fall low enough that people make software the way they write notes or send screenshots.\n\nThat turns hosting into a product surface again. The winning service may not be the most powerful static host; it may be the one that understands artifact identity, small-app sharing, version history, privacy scopes, and agent-native deployment better than anyone else.',
      },
      {
        heading: 'Plain web in the middle',
        body:
          'The product should be opinionated around packaging, permissions, discovery, and composition, not around how the artifact is built. The core contract should stay boring: index.html, optional assets, optional manifest.json. Agents are already good at generating flexible HTML, CSS, and JavaScript, so the platform should avoid inventing a new language or forcing a framework.\n\nCards and widgets can be normal HTML files rendered in smaller sandboxed iframes. If no card view exists, the platform can generate a preview. If the agent wants a better card, it can ship card.html. The artifact should still mostly work if downloaded and opened somewhere else.',
      },
      {
        heading: 'Open questions',
        body:
          'What is the smallest artifact manifest that is useful without becoming an SDK? How should random HTML be sandboxed so it is powerful enough to feel like software but safe enough to browse in a feed? Should the first wedge be private/share-link deployments for individuals, public profile timelines, or agent integrations for builders?\n\nThe deeper question is cultural: if people start publishing little tools as casually as posts, what does the personal web become? Profiles might stop being only archives of thoughts and become shelves of working objects: planners, explainers, calculators, simulations, maps, games, and reports.',
      },
    ],
  },
  {
    slug: 'prediction-market-mispricing-engine',
    number: 'N° 010',
    title: 'A live mispricing engine for sports prediction markets',
    tagline: 'A research system that compares Kalshi-style event prices against live sportsbook consensus before risking capital.',
    domain: 'Trading research · Prediction markets',
    status: 'exploring',
    year: '2026',
    tags: ['prediction markets', 'sports', 'odds', 'trading', 'risk'],
    summary:
      'Live sports prediction markets can overreact to early game state, thin liquidity, or stale order books. The idea is not to out-predict sportsbooks from scratch. It is to build a disciplined mispricing engine that compares executable event-contract prices against de-vigged sportsbook consensus, estimates fees and slippage, paper-trades every signal, and only considers real orders when the edge survives a risk buffer.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Prediction-market prices feel like probabilities, but they are also order books: thin liquidity, spreads, stale bids, panic fills, and participant psychology all show up in the number. In live sports, a small early deficit can make one side look dramatically worse even when there is enough time for the game to mean-revert.\n\nThe motivating observation came from a basketball game where one team was down only a few possessions early, yet the market priced them around a 30 percent chance to win. Buying that side and selling after the game tightened was profitable. The question is whether that was a repeatable dislocation or just one lucky read.\n\nThe tempting move is to buy the apparently cheap side by intuition. That can work once, but it is not a strategy until it answers the harder question: was the contract actually mispriced after fees, spread, slippage, latency, and the risk of a late collapse?',
      },
      {
        heading: 'What it does',
        body:
          'The system watches live event contracts, sportsbook moneylines, and game state at the same time. Sportsbook odds become a reference probability after removing vig. Kalshi-style order books provide the actual executable bid or ask, not just a displayed midpoint. The engine then calculates a net edge: fair probability minus executable price minus fees, expected exit cost, spread, slippage, and an uncertainty buffer.\n\nThe first version should be an alerting and paper-trading product. When the gap is large enough, the user sees the fair price, contract price, recommended limit, risk cap, exit plan, and the historical bucket this signal resembles. Every skipped signal, unfilled order, fill, exit, and final result goes into a journal so the strategy can be replayed honestly.\n\nThe product should be explicit about the difference between arbitrage and positive expected value. True arbitrage would lock in profit across venues at the same time. This is usually not that. It is a live relative-value strategy: if sportsbooks imply 42 percent after vig removal and Kalshi is executable at 30 percent, the system has found a candidate edge. It still has to survive transaction costs and fill reality.',
      },
      {
        heading: 'Why it might work',
        body:
          'Sportsbooks and sharper live markets are sophisticated, liquid, and fast. A small builder is unlikely to beat them by having a better basketball model. But prediction markets can still be less efficient in specific moments: after scoring runs, during fast state changes, in thin markets, or when participants overreact to a headline score instead of possession, time remaining, and pregame strength.\n\nThe edge, if it exists, is cross-market discipline. A contract at 30 percent is interesting only if sportsbook consensus and the model say it should be closer to 40 or 45 percent. A contract at 94 percent is not automatically good just because the team is likely to win; the remaining upside may be too small for the tail risk.\n\nThis is also why the system should optimize for expected value rather than win rate. Buying 94-cent contracts might win frequently and still lose money if one collapse wipes out many small gains. The most attractive trades are often lower-probability entries with enough convexity to sell after convergence, not late-game certainty trades with pennies of upside.',
      },
      {
        heading: 'Product shape',
        body:
          'The MVP is a live research dashboard. It ingests sportsbook odds from an API, de-vigs and aggregates them, joins them to game state, watches prediction-market order books, and produces paper-trade alerts with a clear net-edge calculation. The first automation should be logging, not execution.\n\nThe page that matters most is the trade journal. It should show every signal, including the ones not taken: Kalshi bid/ask, reference fair, book dispersion, edge after costs, order recommendation, fill assumption, exit rule, result, and notes. The dashboard should make it emotionally easy to skip trades. The product is not a dopamine machine; it is a discipline machine.\n\nA later version can place small limit orders under strict risk rules and auto-exit when edge disappears. But the research sequence should stay boring: build adapters, paper trade, replay history, measure calibration, trade tiny, then scale only signal classes that survive real fills.',
      },
      {
        heading: 'Open questions',
        body:
          'Which reference markets are sharp enough and fast enough to trust? Does sportsbook consensus lead prediction-market prices by enough seconds to matter, or does the edge vanish once latency and fills are realistic? Are early-game overreactions more exploitable than late-game dislocations, or does late-game tail risk erase the small wins?\n\nWhich provider tier is enough for the MVP? The Odds API is cheap and simple, but polling plus credit limits may be too slow for live late-game trading. Odds-API.io offers transparent WebSocket pricing, but the useful bookmaker set depends on plan. OpticOdds may have the best product shape for this use case, but quote-based pricing could push it out of hobby range. Sportradar probabilities would be ideal in theory, but likely enterprise-priced.\n\nThe responsible test is paper trading first. The system should prove that a signal class is positive expected value after costs before it gets permission to trade real money. The goal is not to win every trade; it is to avoid confusing frequent small wins with a strategy that survives the rare large loss.',
      },
    ],
  },
  {
    slug: 'physical-weekly-ai-magazine',
    number: 'N° 011',
    title: 'A physical weekly magazine for the AI industry',
    tagline: 'A print magazine covering AI news, projects, editorials, trends, and ads from builders selling AI products.',
    domain: 'Media · AI industry',
    status: 'seed',
    year: '2026',
    tags: ['AI', 'media', 'magazine', 'advertising', 'startups'],
    summary:
      'AI moves too quickly for most people to follow, but the conversation is still scattered across Twitter, newsletters, Discords, launch posts, research papers, and product demos. A physical weekly magazine could turn that chaos into a curated ritual: the week in AI, new projects worth knowing, smart editorials, trend reports, and a serious advertising surface for people trying to market AI products. The surprising part is that print might be the premium format, not the nostalgic one.',
    sections: [
      {
        heading: 'The friction',
        body:
          'The AI industry has too much information and very little shared context. Builders track launches on social feeds, researchers follow papers, operators skim newsletters, and buyers mostly hear about products through ads or word of mouth. Everyone is looking at a different slice of the week.\n\nDigital media also has a trust and attention problem. Another newsletter competes with a thousand unread emails. Another feed post disappears in minutes. A physical magazine creates a different posture: a finite object, edited by humans, that someone can read on a desk, a train, a flight, or a coffee table.\n\nThat physicality is part of the product strategy. A good AI weekly should feel like something an investor leaves in a lobby, a founder brings on a flight, an engineer keeps beside a keyboard, and a sponsor wants to be seen inside.',
      },
      {
        heading: 'What it does',
        body:
          'Each issue is a weekly package: major AI news, product launches, open-source projects, model releases, research explainers, founder interviews, market maps, editorials, trend essays, and practical buyer guides. The magazine should feel useful to builders, executives, investors, and curious technical readers without becoming either pure hype or academic review.\n\nThe recurring sections could include a front-of-book editor note, The Week in AI, a ranked Signal Board, Project Radar, Model Watch, Research to Product, Operator Playbook, Builder Marketplace, opinion, jobs, events, and a back-page artifact worth saving. The structure matters because readers should be able to build a ritual around it: same sections every week, new signal every issue.\n\nThe ads are not a side note; they are part of the product. AI companies need distribution, and many are selling to exactly the audience that would read a serious AI weekly. The magazine can sell tasteful full-page ads, classified-style launch listings, sponsored demos, hiring ads, API/tool announcements, and launch-week placements, while clearly separating editorial from paid inventory.',
      },
      {
        heading: 'Why it might work',
        body:
          'The AI market is crowded, high-velocity, and full of companies desperate for attention from a small set of builders and buyers. That is exactly the kind of environment where a trusted industry publication can matter. If the magazine becomes a weekly map of what happened and what is worth caring about, it can serve both readers and advertisers.\n\nPrint also gives the brand a status surface that digital AI media often lacks. A good issue on a desk says something about taste and seriousness. Conferences, coworking spaces, startup offices, university labs, and investor offices could all be distribution nodes. The physical object makes the industry feel more legible and more real.',
      },
      {
        heading: 'Product shape',
        body:
          'The first version could be a limited-run weekly or biweekly print issue paired with a digital archive. Distribution might start with paid subscriptions, founder/investor office drops, AI conferences, coworking spaces, and sponsored bundles. Each issue could have a stable structure: the week in AI, five launches to know, one technical explainer, one editorial, one market map, one interview, and a curated ad section.\n\nOperationally, the publication needs to behave like a small newsroom plus a B2B media business. Friday locks the thesis and ad inventory. Saturday gathers launches, papers, demos, and tips. Sunday ranks the week. Monday drafts and collects ad assets. Tuesday designs and fact-checks. Wednesday proofs and hands off to print. Thursday ships, markets the issue, and reports value back to advertisers.\n\nAds should be designed as native print artifacts, not banner ads pasted onto paper. A product could buy a launch card with a QR code, pricing note, target user, and a concise reason to try it. Over time the ad pages could become a historical catalog of the AI tooling market: who launched, what they promised, and how the industry changed.',
      },
      {
        heading: 'Go-to-market',
        body:
          'The right launch is not a giant media launch. It is a proof-of-desire sequence. First publish a gorgeous sample issue and sell founding subscriptions plus founding ad slots. Then print a small paid pilot and hand-place copies where the audience already gathers: AI startup offices, VC firms, university labs, coworking spaces, dinners, hackathons, and conferences.\n\nThe early marketing should make the object itself famous. Show the cover. Show the ad section. Show a week of AI turned into a table of contents. Let founders imagine their product in the Builder Marketplace. Let executives imagine handing the issue to their team. The pitch is not "subscribe to another content feed." It is "own the weekly map of the AI industry."',
      },
      {
        heading: 'Open questions',
        body:
          'Who is the first paying reader: builders who want context, executives who need a briefing, investors who want deal flow, or AI-curious professionals who want a calmer way to keep up? How expensive is weekly print and fulfillment at small scale? Does the magazine need a digital community or job board to make the business work, or can subscriptions plus ads carry it?\n\nCan a tiny team maintain the weekly cadence without becoming shallow? What parts can agents help with safely: source monitoring, transcript cleanup, market maps, claim checking, ad intake, layout QA, QR analytics, and issue retrospectives? Which parts must remain human: editorial taste, final ranking, advertiser boundaries, and the voice of the issue?\n\nThe editorial line matters most. If it is too breathless, it becomes hype. If it is too skeptical, advertisers will not see it as a launch surface. The opportunity is a publication that is useful, opinionated, and commercially aware without losing reader trust.',
      },
    ],
  },
  {
    slug: 'hyperlocal-news',
    number: 'N° 012',
    title: 'A hyperlocal news layer for the few blocks around you',
    tagline: 'A neighborhood news product for permits, schools, road closures, meetings, alerts, and the tiny local changes people actually need.',
    domain: 'Local media · Civic information',
    status: 'seed',
    year: '2026',
    tags: ['local news', 'civic data', 'maps', 'community'],
    summary:
      'Most news is too large for daily life. People want to know what changed near their home, school, commute, block, park, or favorite small business. This idea is a hyperlocal news layer that turns city records, school-board updates, permit filings, event calendars, road closures, and verified community reports into a readable feed for the few blocks that matter.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Local information exists, but it is scattered across city websites, meeting PDFs, neighborhood groups, school-board notes, permit portals, police alerts, transit pages, and word of mouth. The people most affected by a change often hear about it last.\n\nTraditional local news is stretched thin, and social feeds reward drama over usefulness. A resident usually does not need the whole city. They need the practical layer: what is happening near me, what is confirmed, what is changing, and what should I pay attention to this week?',
      },
      {
        heading: 'What it does',
        body:
          'The product starts with an address, neighborhood, or drawn map radius. It builds a feed of nearby updates: planning permits, zoning changes, school-board decisions, road work, public meetings, safety alerts, local business openings, park closures, events, and community notices.\n\nThe important product primitive is verification. Each item should show where it came from, how local it is, whether it was machine-ingested or human-confirmed, and what action a resident can take. A user should be able to follow a school, street, neighborhood, council district, or commute route, not just a city-wide publication.',
      },
      {
        heading: 'Why it might work',
        body:
          'The internet made news global, but daily concern is still local. People care intensely about a new building next door, a school policy change, a street closure, or a weekend event that changes parking. Those updates are valuable because they are specific.\n\nAgents and structured-data pipelines make the old local-information problem newly tractable. They can monitor public records, summarize meeting agendas, extract locations from PDFs, cluster duplicates, and draft plain-language updates for human review. The product becomes less like a newspaper and more like a civic sensor network with an editorial layer.',
      },
      {
        heading: 'Product shape',
        body:
          'The first version could be a mobile-first map and feed for one metro area. A user enters an address, chooses a radius, and gets a daily digest: three verified things nearby, one upcoming meeting, one permit or construction change, and one event or local opening worth knowing about.\n\nThe wedge might be narrow: permit watch for homeowners, school-board watch for parents, road-closure alerts for commuters, or neighborhood briefings for real-estate professionals. Over time those vertical feeds can roll up into a fuller local news layer.',
      },
      {
        heading: 'Open questions',
        body:
          'Where does trust come from: named local editors, source transparency, community correction, or partnerships with existing local outlets? How much can be automated before the product becomes brittle or spammy? Does this work as a consumer subscription, a civic data product, a real-estate tool, or a bundle sold through neighborhood organizations?',
      },
    ],
  },
  {
    slug: 'short-term-rental-demand-radar',
    number: 'N° 013',
    title: 'A demand radar for short-term rental hosts',
    tagline: 'An address-based pricing assistant that tells hosts when local demand is about to spike.',
    domain: 'Travel · Host tools',
    status: 'seed',
    year: '2026',
    tags: ['short-term rentals', 'pricing', 'events', 'travel demand'],
    summary:
      'Many short-term rental hosts price by instinct, stale comps, or whatever their platform suggests. But demand is local, seasonal, and event-driven. This product starts with a rental address and explains what is happening nearby: tourist inflow, hotel occupancy, average daily hotel prices, event calendars, conferences, sports, graduations, and other demand spikes that should change nightly rates.',
    sections: [
      {
        heading: 'The friction',
        body:
          'A host can own the perfect unit and still miss the week when demand surges. Big events, conferences, tournaments, concerts, university weekends, and local festivals can move prices dramatically, but the information is spread across hotel data, event calendars, flight trends, destination marketing, and local chatter.\n\nPlatforms may offer dynamic pricing, but many hosts do not understand why a price changed or when they should override it. The missing layer is not just a number. It is an explanation: this address is near this demand source, these dates are tightening, comparable hotels are pricing up, and your calendar should react.',
      },
      {
        heading: 'What it does',
        body:
          'The host enters an address. The product maps the unit to nearby demand drivers: venues, convention centers, stadiums, campuses, tourist corridors, transit access, hotel clusters, and recurring events. It then watches demand signals such as hotel average daily rate, occupancy proxies, event schedules, flight or search trends where available, and local news about upcoming draws.\n\nThe output is a simple host briefing: dates to raise, dates to hold, dates to discount, confidence level, nearby events, comparable hotel pricing, and suggested minimum-night rules. The product should make it easy to push or copy recommendations into a rental calendar without pretending the model is always right.',
      },
      {
        heading: 'Why it might work',
        body:
          'Short-term rental pricing is a local intelligence problem. A generic city-wide pricing curve misses the difference between being near a stadium, near a conference shuttle, near a beach, or far from the demand source. Hosts also have asymmetric upside: catching a few major demand spikes per year can matter more than optimizing every ordinary Tuesday.\n\nThe product becomes especially useful when it explains itself. A host can trust a recommendation more when it says: hotel prices near you are rising, occupancy is tightening, three events overlap, and similar units are already blocked or priced higher.',
      },
      {
        heading: 'Product shape',
        body:
          'The MVP could be a weekly email or dashboard for one address. It shows the next 90 days, flags demand spikes, and gives a short reason for each pricing recommendation. A second surface could be a calendar overlay: green for normal nights, amber for watch dates, red for price-up windows.\n\nA stronger version could add a lightweight local-news layer: permits, venue announcements, transit disruptions, and tourism changes that affect guest demand or guest experience. That makes the product adjacent to hyperlocal news, but with a clear buyer and measurable economic value.',
      },
      {
        heading: 'Open questions',
        body:
          'Which demand signals are accessible enough for a small product: hotel rates, event listings, scraped calendars, tourism feeds, search trends, or partner data? Is the buyer an individual host, a small property manager, or a revenue manager with many units? How should the product avoid overpromising revenue while still being direct enough to change host behavior?',
      },
    ],
  },
  {
    slug: 'agentsfs',
    number: 'N° 014',
    title: 'agentsfs.ai: a portable filesystem for agents',
    tagline: 'A user-owned filesystem contract that gives agents durable, compounding memory across every harness.',
    domain: 'Infrastructure · AI agents',
    status: 'exploring',
    year: '2026',
    tags: ['agents', 'filesystem', 'memory', 'git', 'MCP', 'CLI'],
    summary:
      'Agents can already do expert-level work inside a session — what they can\'t do is keep it. The context an agent builds has nowhere durable to live, and what does get saved is trapped inside one vendor\'s memory. agentsfs is a portable, user-owned substrate — files + conventions + tools + instructions, and nothing else — that any harness can read, write, and maintain. The intelligence lives in the user\'s agents; agentsfs makes their knowledge survive and compound.',
    sections: [
      {
        heading: 'The problem',
        body:
          'An agent session is a remarkable thing: in an hour it can research a company, untangle a claim, or assemble a working model of a domain. Then the session ends, and almost everything it built — the context, the dead ends ruled out, the judgment formed — has nowhere durable to live. The next session rebuilds it from scratch. The models are ready to compound knowledge into genuine expertise; nothing gives them a place to put it.\n\nTwo kinds of people hit this wall. Builders who want compounding agents — a daily stock-research agent that gets smarter about each company over time — are blocked not on model capability but on memory; today the only path is a bespoke pipeline per product. And everyday users working through a long-running issue — an insurance claim, a project — must re-explain everything in every new conversation. The known workaround, "tell the agent to keep a file and read it next time," works, but nothing in today\'s tools encourages, structures, or rewards it.\n\nThe existing substrates each miss. Vendor memory is harness-locked and opaque: Claude only remembers what happened in Claude. The plain filesystem is portable but has no agent conventions. And the knowledge tools — Obsidian, Notion, Dropbox — are app-first: they are adding agent integrations, but bolted onto a product whose center of gravity is their application and their account.',
      },
      {
        heading: 'The core bet: no intelligence inside',
        body:
          'agentsfs contains no LLM and never will as a core dependency. It is files + conventions + tools + instructions. The user\'s own agent — Claude Code, Codex, OpenClaw, whatever comes next — does all the compounding, synthesis, and cleanup; agentsfs makes that work obvious, structured, and cheap for any agent that shows up.\n\nThe anchoring analogy: git doesn\'t write your commits; it makes committing so structured and cheap that you do it constantly. agentsfs doesn\'t compound knowledge; it makes compounding the obvious, easy thing.\n\nIn practice the intelligence connects three ways: prompts and skills shipped as product ("read this to get started," plus CLAUDE.md / AGENTS.md registration snippets), a CLI and MCP server exposing the same tools, and maintenance jobs that run on the user\'s own harness scheduler — no daemon, no API keys, no inference cost, and the system improves automatically as agents improve.',
      },
      {
        heading: 'The contract',
        body:
          'The design splits along one axis: the contract is what works with zero tooling — just files, conventions, and git — while the toolkit makes it pleasant but is never load-bearing for truth.\n\nEvery instance is a plain git repo holding any file types — notes, PDFs, spreadsheets, images, code, datasets. Git alone provides edit logs, file history, line-level provenance, and offline-first sync through any remote — none, self-hosted, GitHub, or a hosted service. git clone is a permanent exit ramp for your entire substrate: any hosted offering competes on convenience, never on captivity.\n\nOn top of git sit a few boring conventions, chosen because agents are already superhumanly fluent in them. Markdown serves as the lingua franca of the knowledge layer — not a restriction on contents: a one-line description for every file (in frontmatter where the format allows, in the directory\'s index where it doesn\'t), powering progressive disclosure — tree, then folder descriptions, then file descriptions, then full files. [[Wikilinks]] connect entity pages and files by name rather than path, source citations record where claims came from, and a self-describing root README teaches the contract to any agent dropped in cold. Unzip the folder, point any agent at it, it works.',
      },
      {
        heading: 'The toolkit',
        body:
          'A thin CLI and MCP server with the same capabilities on both surfaces: tree with one-line descriptions and freshness dates for progressive disclosure; full-text and semantic search, the one capability that can\'t be contract-only; backlinks, answering "find all references to this entity" like a language server for knowledge; rename, the link-aware refactor that rewrites every wikilink in one deterministic pass; and doctor, a no-LLM health checker that flags orphan files, dead links, missing descriptions, and fragmentation.\n\ndoctor matters more than it looks: its output is the worklist for the "gardener," a scheduled maintenance job on the user\'s harness that consolidates sparse notes, updates descriptions, and restructures as the domain evolves. Every index — search, links, embeddings — is derived and rebuildable from the files alone. Files are the only source of truth.',
      },
      {
        heading: 'Structure that explains itself',
        body:
          'agentsfs prescribes the meta-structure, not the taxonomy. The contract\'s promise is not "the tree looks like X" — it is "the tree always explains itself." Fixed buckets were rejected because domains differ too much: a stock-research instance grows entity pages per company, an insurance claim grows a timeline and correspondence. Prescribed taxonomies become junk drawers.\n\nOnly three names are reserved: the root README that bootstraps any agent, .agentsfs/ for derived machine state, and scratch/ — explicitly ephemeral, because "this is disposable" is the one thing a plain filesystem cannot express. Everything else is the agent\'s garden. Onboarding prompts propose a starter structure and invite the agent to adapt it; the gardener is licensed to restructure as the domain evolves; and because wikilinks resolve by name rather than path, reorganizing never breaks references.\n\nThe quiet test for every decision: if it works for a non-technical person managing an insurance claim, it works for the power user running ten harnesses.',
      },
      {
        heading: 'What was deliberately deferred',
        body:
          'Directory-level permissions and scoped checkout (an agent that can see work/ but not personal/ — maps naturally onto git sparse checkout), native and web apps for browsing your substrate, and the business model (open-source core plus paid hosted sync, the Obsidian model) are all real ideas sitting in an explicit parking lot until the core contract is built and proven.\n\nThe candidate first slice: init (template, self-describing root, git), the onboarding prompt, and tree with descriptions — proven end-to-end by a real agent on a real task before any search infrastructure gets built.',
      },
    ],
  },
  {
    slug: 'ambient-knowledge-agent-for-notes',
    number: 'N° 015',
    title: 'An ambient knowledge agent for notes',
    tagline: 'A note-taking layer that quietly surfaces context, sources, and questions while you write.',
    domain: 'Knowledge tools · AI',
    status: 'seed',
    year: '2026',
    tags: ['notes', 'knowledge work', 'agents', 'research', 'Obsidian', 'capture', 'privacy', 'macOS'],
    summary:
      'Writing notes often creates a strange gap: the moment you are forming a thought is exactly when useful background knowledge, examples, counterpoints, and references would help, but searching for them pulls you out of the thought. This idea is an Obsidian-like writing surface with an AI agent working just outside the main canvas. It behaves less like autocomplete and more like a peripheral research companion: quiet, source-backed, and available when invited.',
    sections: [
      {
        heading: 'The friction',
        body:
          'Imagine writing notes about BM25. The note might mention term frequency, inverse document frequency, field length normalization, ranking functions, Elasticsearch, and retrieval-augmented generation. Each phrase is a doorway into useful context, but opening a browser tab breaks the writing flow.\n\nAutocomplete is the wrong metaphor. The writer does not necessarily want the tool to finish the sentence. In knowledge work, the valuable move is often adjacent rather than forward: a definition, a citation, a diagram idea, a contradiction, a related note, a missing assumption, or a small worked example. The tool should expand the room around the thought without grabbing the pen.',
      },
      {
        heading: 'What it does',
        body:
          'The product watches the active note, the nearby cursor context, linked notes, and optionally the surrounding vault. As the user writes, it maintains a quiet peripheral panel: related concepts, source snippets, local backlinks, examples, questions worth answering, and "you may be mixing these two ideas" warnings.\n\nNothing appears inline unless the user asks. The agent does not push completions into the sentence. It prepares knowledge off to the side, maybe one keyboard shortcut or hover away. For a BM25 note, it might show the core scoring formula, a plain-English explanation of k1 and b, a link to the original Robertson/Sparck Jones lineage, a note that BM25 is lexical rather than semantic retrieval, and a comparison to embedding search.',
      },
      {
        heading: 'Why it might work',
        body:
          'Code completion works because the next few tokens are often the product. In notes, the next words are not always the bottleneck. The bottleneck is the quality of the surrounding mental model.\n\nA peripheral agent fits the shape of writing better than a chat box or autocomplete bar. It can do slow, source-seeking, cross-note work while the user stays in the note. The user remains the author; the agent becomes the ambient research layer that keeps relevant material warm.',
      },
      {
        heading: 'Product shape',
        body:
          'The first wedge could be an Obsidian plugin. It indexes the vault locally, watches the active note, and runs a small background research loop only when confidence and usefulness are high enough. The visible surface is restrained: a collapsed right-edge rail, a keyboard-summoned tray, or a "context inbox" that accumulates candidate insights without interrupting the page.\n\nA more ambitious wedge is a Mac app that watches the writing surface itself. With screen monitoring and accessibility permissions, it could work across Obsidian, Apple Notes, Google Docs, a browser editor, a PDF margin note, or a code-adjacent Markdown file. That version is less tied to one vault, but more delicate: it has to infer what the user is writing about from the active window, OCR or accessibility text, selection state, and app context, then show insights in a small side panel or menu-bar popover.\n\nThe agent should separate local knowledge from external knowledge. Local notes get priority because they reflect the user\'s actual thinking. External search is opt-in or clearly marked, with source links and timestamps. Good outputs should be small: one paragraph, one citation, one equation, one question, one related note. The unit is not a generated essay; it is a prepared affordance.',
      },
      {
        heading: 'Open questions',
        body:
          'How does the system decide when to stay silent? What counts as useful context rather than ambient noise? Should insights appear only after pauses, only on explicit hotkey, or continuously in a low-priority rail? How much can be done locally before web research becomes necessary?\n\nThe platform choice is a real fork. An Obsidian plugin gets clean note structure, backlinks, and a natural local index, but lives inside one app. A Mac-level companion can follow the user anywhere they write, but inherits hard privacy, permission, and context-detection problems. Does the product need deep vault semantics first, or broad ambient awareness first?\n\nThe trust problem is also central. If the agent surfaces knowledge while someone is writing, it must make provenance visible and uncertainty normal. The product should reward checking sources, not laundering model confidence into the user\'s notes.',
      },
      {
        heading: 'The other half: capture',
        body:
          'There is a quiet assumption underneath all of this: that the vault the agent reads from is already rich enough to be worth surfacing. Usually it is not. The deeper idea is to close a loop — let the same attention that produces notes also feed the knowledge base, so the agent grows the same context its owner has and never loses the thread of what they were doing. What you read, and especially what you highlight, is the raw material; the writing companion is only the read end of a system whose write end is ambient capture.\n\nFramed this way, the Mac-level companion and a browser extension stop competing. They become sensors on a fidelity ladder — clean page text and precise highlights from the browser, accessibility text and screen OCR for everything else — normalizing into one personal store that a distilling agent turns into small, cited, atomic notes. Highlights are not decoration; they are the salience layer that tells the distiller what mattered.\n\nThe build note below works through that capture half in detail: the sensors and when each fires, how a highlight anchors and survives a reload, the single event the whole system speaks, the on-disk note format, and why privacy has to be the substrate rather than a later hardening pass.',
      },
    ],
  },
  {
    slug: 'personal-kindle-publishing-pipeline',
    number: 'N° 016',
    title: 'A personal publishing pipeline for Kindle',
    tagline: 'An agent that turns learning goals and source material into cited, serialized books delivered to your e-reader.',
    domain: 'Learning tools · Personal publishing',
    status: 'seed',
    year: '2026',
    tags: ['Kindle', 'EPUB', 'agents', 'learning', 'research', 'personal publishing', 'read-it-later'],
    summary:
      'A Kindle is excellent at making long-form reading feel finite, portable, and separate from the rest of the internet. The missing product is a personal press that keeps its shelf supplied: give it a paper, a reading list, a question, or a subject you want to learn; it researches and writes a source-cited book, packages it as EPUB, and delivers new editions on a schedule. The Kindle address is a destination, not the product. The real product is a persistent curriculum and a trustworthy publishing pipeline that turns intention into a reading habit.',
    sections: [
      {
        heading: 'The idea',
        body:
          'Imagine registering a private e-reader destination, choosing a subject, and waking up to a book that was made for the exact thing you are trying to understand. A research paper could become a patient 6,000-word explainer. A folder of saved articles could become a weekly field guide. A broad intention such as “teach me the foundations of Hinduism” could become a bounded course, one carefully sequenced chapter at a time.\n\nThis is not a feed pushed onto another screen. The service should produce books: a cover, a real table of contents, chapters with shape, footnotes, a glossary, a bibliography, and a durable file the reader owns. The e-reader matters because it changes the posture from checking to reading.',
      },
      {
        heading: 'The problem with today’s reading pipeline',
        body:
          'The internet makes acquisition effortless and completion difficult. Papers accumulate in browser tabs. Newsletters disappear beneath newer newsletters. Model-generated explainers remain trapped in chat histories even when they are good enough to deserve a quieter reading surface.\n\nRead-it-later tools solve transfer and organization. They generally do not own the intellectual work of turning a learning goal into a sequence: choosing prerequisites, finding sources, reconciling disagreement, maintaining continuity across chapters, and deciding when the book is complete. That editorial state is the opportunity.',
      },
      {
        heading: 'What the product does',
        body:
          'A reader creates a program with a topic, current knowledge, desired depth, chapter length, cadence, source policy, and destination. The system proposes a curriculum and source plan. On each run it assembles a bounded evidence pack, drafts the next artifact with citations, checks claims and continuity, validates an EPUB, and either asks for approval or delivers it.\n\nThe most useful modes are paper-to-explainer, personal course, weekly work briefing, and living field guide. The system keeps an internal shelf where every edition can be downloaded again, corrected, combined into a final volume, or sent to a different reading device.',
      },
      {
        heading: 'The Hinduism example',
        body:
          '“Teach me Hinduism” is exactly the kind of request that reveals whether the product is serious. A weak system would generate a single smooth story that collapses thousands of years, many philosophical schools, regional traditions, devotional practices, and contested interpretations into one voice.\n\nA good program would begin by clarifying the reader’s goal, name the traditions it is discussing, use primary texts alongside modern scholarship, distinguish historical description from living practice, and surface disagreement without turning every chapter into a disclaimer. A possible sequence might move from vocabulary and historical framing to the Vedas and Upanishads, dharma and karma, major philosophical schools, bhakti traditions, temple and household practice, modern reform movements, and the limits of treating “Hinduism” as one system. The personalization is in pace, prerequisites, examples, and questions—not in inventing a more convenient tradition.',
      },
      {
        heading: 'Why it might work',
        body:
          'The addressable audience is not every Kindle owner. It is the smaller group that already wants to read more deeply for work or self-directed learning but has a broken intake-to-completion loop. Existing paid tools prove that people will pay to get newsletters, articles, PDFs, and EPUBs onto an e-reader. The new value is editorial coherence and continuity.\n\nThe habit could be unusually sticky when it is bounded. Instead of subscribing forever to an infinite stream, a reader starts a six-week course, receives one weekly volume, finishes with a clean omnibus, and chooses the next subject. Completion becomes part of the product.',
      },
      {
        heading: 'The platform constraint',
        body:
          'Amazon offers a personal-document delivery workflow, not a general commercial publishing API. Users can approve sender addresses and receive supported files, including EPUB, but Amazon also warns about recipient limits, throttling, and personal/non-commercial use. That makes a shared bulk-sender shortcut too fragile to be the foundation of the business.\n\nThe safest early design is user-controlled delivery: a local companion or user-authorized mailbox sends from the reader’s own approved address, with ordinary EPUB download always available. Public Kindle Store publishing through KDP is a separate workflow with rights, quality, and AI-disclosure obligations; it should never happen automatically just because a private edition was generated.',
      },
      {
        heading: 'Product decisions',
        body:
          'EPUB should be canonical and Kindle should be an adapter. Every edition should be immutable, checksummed, versioned, and portable. Because a service cannot reliably append a new chapter inside an existing Kindle personal document, the recommended cadence is a weekly compiled volume, with daily chapter documents as an opt-in and a polished final book at the end.\n\nAutomatic delivery should be earned. The first three editions of a program stay in review mode. Once the reader trusts the source quality, voice, length, and framing, the program can graduate to automatic delivery. A single correction or changed topic can put it back into review.',
      },
      {
        heading: 'Open questions',
        body:
          'Does the winning wedge begin with uploaded research papers, where the value is concrete, or with personal courses, where the retention might be better? Will readers pay for books generated from sources they already have, or is expert curation the part they actually value? How much delivery automation can be offered without relying on an unsupported use of Amazon’s personal-document system?\n\nMost importantly: does receiving more material cause more reading, or only move the backlog to a nicer screen? The first pilot should measure completed chapters and completed courses, not books generated.',
      },
    ],
    references: [
      {
        title: 'Pew Research Center — U.S. book-reading formats, 2025',
        href: 'https://www.pewresearch.org/short-reads/2026/04/09/americans-still-opt-for-print-books-over-digital-or-audio-versions-few-are-in-book-clubs/',
        note:
          'Survey evidence for e-book usage: 31% of U.S. adults read an e-book in the previous year, including 42% of college graduates.',
      },
      {
        title: 'Amazon — 2024 Kindle lineup and sales signal',
        href: 'https://press.aboutamazon.com/2024/10/amazon-launches-entirely-new-kindle-lineup-including-reimagined-kindle-scribe-and-first-ever-color-kindle',
        note:
          'Amazon said Kindle device sales had reached a decade high and that most purchases came from first-time Kindle owners.',
      },
      {
        title: 'Amazon — supported Send to Kindle files',
        href: 'https://digprjsurvey.amazon.com/csad/help/node/TCUBEdEkbIhK07ysFu',
        note:
          'Official support page listing EPUB and other supported personal-document formats, with a 200 MB web-transfer limit.',
      },
      {
        title: 'Amazon — Send to Kindle delivery errors and limits',
        href: 'https://digprjsurvey.amazon.co.uk/csad/help/node/T48rsVm3gY7KeGkKUk',
        note:
          'Official troubleshooting guidance covering approved senders, recipient limits, throttling, suspension, and personal-use restrictions.',
      },
      {
        title: 'KTool pricing',
        href: 'https://ktool.io/pricing',
        note:
          'A direct market reference for paid Kindle delivery, newsletter bundling, document conversion, and EPUB download.',
      },
      {
        title: 'Readwise Reader',
        href: 'https://readwise.io/read/',
        note:
          'A broader power-reading subscription that can send documents to Kindle and anchors willingness to pay above simple delivery utility.',
      },
      {
        title: 'Amazon KDP content guidelines',
        href: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
        note:
          'The separate public-publishing path: Amazon requires disclosure of AI-generated content and makes publishers responsible for rights and quality.',
      },
    ],
  },
  {
    slug: 'agent-fantasy-football-competition',
    number: 'N° 017',
    title: 'A fantasy football league for agents',
    tagline: 'A season-long public competition where agents draft, trade, negotiate, manage rosters, and leave behind a dataset of how they learned.',
    domain: 'Agent competitions · Sports',
    status: 'exploring',
    year: '2026',
    tags: [
      'fantasy football',
      'agents',
      'competition',
      'agent evals',
      'sports',
      'trajectories',
      'agentsfs',
      'multi-agent systems',
    ],
    summary:
      'Fantasy football is a nearly perfect live environment for studying agents. It combines a fixed ruleset with incomplete information, delayed rewards, scarce resources, deadlines, negotiation, changing world state, and seventeen weeks of opportunities to learn. The proposal is to launch an agent-only NFL fantasy competition in 2026: one flagship league people can follow like a sport, a small set of open leagues for builders, and an immutable decision record that turns the season into a replayable benchmark rather than a disposable stunt.',
    sections: [
      {
        heading: 'The proposition',
        body:
          'People do not manage teams directly. They build or configure an agent, give it a strategy and a set of tools, and let it enter a real fantasy season. The agents participate in a live snake draft, set weekly lineups, submit blind waiver bids, propose and negotiate trades, react to injuries and bye weeks, and speak in a public league forum. Humans watch, improve their systems between allowed checkpoints, and own the resulting agent—not the individual picks.\n\nThe public surface should feel like a hybrid of a fantasy league, a Kaggle competition, and a documentary. Standings answer who is winning. Decision receipts explain what each agent believed without demanding private chain-of-thought. Version history shows what the builder changed. Weekly postmortems turn good and bad decisions into an unfolding story.',
      },
      {
        heading: 'Why this is a real agent test',
        body:
          'Most agent benchmarks are short, solitary, and easy to reset. A fantasy season is none of those things. Draft mistakes persist. A bad trade helps an opponent. Waiver money spent in September cannot be spent in December. Advice goes stale as depth charts, injuries, weather, and usage change. An agent has to operate under time pressure, maintain a durable model of its roster and rivals, and distinguish signal from a week of noisy outcomes.\n\nThe social layer matters just as much as prediction. Trades test persuasion, valuation, identity, and adversarial communication. The forum tests whether agents can make claims publicly without leaking secrets or swallowing prompt injection from a rival. Reliability becomes part of competence: the smartest system in the league still loses if it misses a lineup lock.',
      },
      {
        heading: 'The 2026 opening',
        body:
          'The 2026 NFL season opens on Wednesday, September 9. From July 28, that leaves 43 days—not enough time to build a universal fantasy platform, but enough for a deliberately narrow pilot. The right target is a twelve-agent flagship league plus four twelve-agent public divisions: sixty agents total, one ruleset, one live scoring feed, one open event log, and no entry fee.\n\nThe category is already being validated. The Bot League, Agents XI, AgenticLeague, and Fantopy are all exploring agent-native fantasy sports in 2026. Their existence makes speed useful, but also sharpens the differentiation: the durable opportunity is not merely agents selecting a squad. It is an NFL-length environment with unique player ownership, negotiation, failure recovery, controlled baselines, and a dataset designed to reveal which agent systems actually improve.',
      },
      {
        heading: 'Recommended first season',
        body:
          'Use a mainstream redraft format so the experiment tests agents rather than obscure rules: twelve teams, fifteen-round snake draft, full PPR scoring, nine starters and six bench spots, a $100 blind FAAB budget, individual-player lineup locks, and six-team playoffs in Weeks 15–17. The competition engine should be owned and deterministic; a licensed data provider supplies player status and official scoring inputs.\n\nYear one should have two different scoreboards. League standings determine the sporting winner. A separate research scorecard reports reliability, lineup regret, waiver efficiency, trade surplus, calibration, cost, and improvement over a stateless replay. Never combine those measurements into one mystical “agent score.” The football result should remain legible, while the research result explains why it happened.',
      },
      {
        heading: 'What should survive the season',
        body:
          'The durable artifact is a frozen 2026 world: every rules version, state snapshot, legal action, message, transaction, lineup, score correction, decision receipt, agent version, and delayed outcome. With builder consent, richer trajectory bundles can include tool summaries, source references, cost, latency, and the compact memories or playbooks the agent carried forward.\n\nThat corpus can power a replay environment in which the same agent runs with and without prior experience on the same historical decision points. It can seed regression tasks, identify tactics and traps, and make 2027 better before registration opens. The annual competition then compounds: a public sporting event on the surface, a growing longitudinal benchmark underneath.',
      },
      {
        heading: 'The open questions',
        body:
          'Can a small team license sufficiently reliable live scoring data before the draft? Will builders submit a stable endpoint for seventeen weeks, or should the platform host standardized agent containers? How much external data and compute should the open division permit, and what must be disclosed? Can private trade negotiation remain strategically interesting without becoming an unbounded prompt-injection channel?\n\nThe largest product question is whether the audience follows agents as characters. A technically fair league can still be boring. The draft, trade negotiations, weekly reveals, rivalries, and postmortems must create a story worth returning to—even for someone who never writes an agent.',
      },
    ],
    references: [
      {
        title: 'NFL — 2026 regular-season kickoff',
        href: 'https://www.nfl.com/news/seahawks-to-kick-off-2026-nfl-regular-season-on-wednesday-sept-9-in-seattle',
        note:
          'The 2026 season begins Wednesday, September 9 at 8:20 p.m. ET, establishing the immovable launch deadline.',
      },
      {
        title: 'NFL Fantasy — league types and default settings',
        href: 'https://support.nfl.com/hc/en-us/articles/35869678503060-League-Types-Settings',
        note:
          'Primary reference for ordinary roster sizes, league sizes, waiver systems, trades, lineup locks, and custom settings.',
      },
      {
        title: 'NFL Fantasy — scoring',
        href: 'https://support.nfl.com/hc/en-us/articles/35869730981140-Scoring',
        note:
          'Primary reference for head-to-head play, fractional scoring, official stat corrections, and default point values.',
      },
      {
        title: 'NFL Fantasy — draft basics',
        href: 'https://support.nfl.com/hc/en-us/articles/35869693560980-The-Basics',
        note:
          'Explains snake, linear, salary-cap, keeper, live, offline, and autopick draft mechanics.',
      },
      {
        title: 'NFL Fantasy — fair play and user conduct',
        href: 'https://support.nfl.com/hc/en-us/articles/35869738994068-Fair-Play-and-User-Conduct-Policy',
        note:
          'A useful baseline for collusion, multi-team ownership, roster dumping, and communication policy.',
      },
      {
        title: 'Sleeper — public fantasy API',
        href: 'https://docs.sleeper.com/',
        note:
          'A strong read surface for leagues, drafts, rosters, matchups, and transactions; the official API is explicitly read-only.',
      },
      {
        title: 'Yahoo — Fantasy Sports API',
        href: 'https://developer.yahoo.com/fantasysports/guide/',
        note:
          'A mature fantasy data model with OAuth and read/write scopes, useful as an integration reference even if the competition owns its engine.',
      },
      {
        title: 'The Bot League',
        href: 'https://www.thebotleague.com/',
        note:
          'A 2026 agent-only World Cup fantasy competition using a REST API, deterministic scoring, progressive pick reveals, and an open engine.',
      },
      {
        title: 'Agents XI',
        href: 'https://agentsxi.com/',
        note:
          'A 2026 agent-native football competition with bring-your-own-key agents, public decision traces, and separate fantasy and prediction boards.',
      },
      {
        title: 'Fantopy',
        href: 'https://about.fantopy.ai/',
        note:
          'A consumer and creator-league thesis for agent-vs-agent fantasy sports, with autonomous managers and conversational human oversight.',
      },
      {
        title: 'AgenticLeague',
        href: 'https://www.agenticleague.us/',
        note:
          'An early multi-sport fantasy platform whose agents register and join leagues through a SKILL.md-guided API flow.',
      },
      {
        title: 'Agent2Agent protocol specification',
        href: 'https://google-a2a.github.io/A2A/specification/',
        note:
          'Reference vocabulary for agent identity, capabilities, authenticated messages, tasks, and artifacts; useful for interoperability, not required for the first engine.',
      },
      {
        title: '31 U.S.C. § 5362',
        href: 'https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title31-section5362',
        note:
          'Federal statutory conditions relevant to fantasy contests, including advance prize disclosure, skill, and aggregated multi-event athlete statistics. State law and contest counsel still matter.',
      },
      {
        title: 'IRS Publication 525',
        href: 'https://www.irs.gov/publications/p525',
        note:
          'Official tax guidance stating that prizes and awards are generally taxable and specifically discussing fantasy-sports winnings.',
      },
    ],
  },
  {
    slug: 'markdown-to',
    number: 'N° 018',
    title: 'Markdown To: a portable file format for little apps',
    tagline:
      'A family of canonical Markdown formats that open as live Kanban boards, audio studios, trips, forms, books, and other rich apps—then download back to Markdown.',
    domain: 'Open formats · Agent-native software',
    status: 'exploring',
    year: '2026',
    tags: [
      'Markdown',
      'open standards',
      'portable software',
      'agents',
      'MCP',
      'CLI',
      'TTS',
      'Kanban',
      'developer tools',
    ],
    summary:
      'Markdown is already the closest thing agents and humans share as a universal working surface: readable without special software, easy to generate, friendly to version control, and durable enough to outlive an app. Markdown To turns that familiarity into a family of strict, versioned application formats. A file written as `kanban@0.1` opens as a live board whose drag-and-drop state can be downloaded as Markdown; a file written as `audio@0.1` opens as a paid high-quality narration studio. The Markdown file is the user-owned artifact, typed JSON is the runtime representation, and the website is the reference renderer, documentation hub, and optional host.',
    sections: [
      {
        heading: 'The proposition',
        body:
          'The idea is not that one magical file becomes every conceivable output. It is that Markdown To defines many small canonical formats, each with one clear application model. If a human or agent writes a Kanban file in the documented shape, Markdown To renders a Kanban app. If they write a trip file, it renders an itinerary and route map. If they write an audio manuscript, it renders a TTS production studio. The format tells the website what the file means.\n\nEach live app remains backed by the file. Dragging a card, completing a habit, changing a trip stop, or editing a pronunciation produces a deterministic source patch. At any point the user can download the current `.md` state, put it in git, email it, edit it in a text editor, or open it with another conforming renderer. The hosted UI is valuable; the user\'s state is never captive to it.',
      },
      {
        heading: 'Why Markdown, and where JSON belongs',
        body:
          'JSON is better at machine state. It has explicit types, clean nesting, mature schema validation, and predictable parsers. Markdown is better at being an artifact people and agents actually want to touch. It can hold prose beside structure, produces readable diffs, accepts comments and links naturally, and still makes sense when no application recognizes its special format.\n\nThe strongest architecture uses both. Strict Markdown is the portable format at rest. The compiler validates it and emits typed JSON intermediate representation for live renderers, APIs, patches, and tests. A serializer maps supported UI changes back to minimal Markdown diffs. High-write or multi-user data—form responses, analytics, concurrent operation logs—can live in a database or sidecar while the Markdown remains the canonical definition and downloadable snapshot. The product should not pretend a text file is a high-throughput database; it should make ordinary app state unusually ownable.',
      },
      {
        heading: 'What already exists—and what remains open',
        body:
          'The ingredients have substantial prior art. Adaptive Markdown makes one `.md` file into a programmable, agent-editable application containing its own styling and interactivity. Kanbaruu stores project tasks as Markdown, renders Kanban, Gantt, list, and calendar views, syncs with repositories, and exposes MCP. Obsidian Kanban is a mature Markdown-backed board; Markwhen turns a Markdown-like language into timelines and calendars; Pandoc and Quarto cover enormous publishing surfaces; MDX and Markdoc add components and typed semantics; AudioDoc already narrates Markdown.\n\nThat means “Markdown to Kanban” is not the novelty, and neither is the broad statement that a document can become an app. The unresolved opportunity is the standards layer: a public registry of small versioned application formats, a safe shared intermediate representation and mutation protocol, deterministic round-tripping, conformance fixtures, several interchangeable renderers for one format, and agent-native discovery across the entire ecosystem. Kanban should be described as the reference implementation, not as an invention.',
      },
      {
        heading: 'A format for every little app',
        body:
          'The obvious formats are only the beginning. Work formats include Kanban, Gantt, calendar, roadmaps, OKRs, incident rooms, runbooks, decision matrices, and release trains. Publishing formats include websites, documentation, books, interactive essays, slides, newsletters, teleprompters, and courses. Media formats include chaptered audio, private podcasts, narrated slides, captioned video, and walking tours.\n\nThe more interesting edge is personal software: a private CRM, habit tracker, household budget, pantry, recipe cook mode, meal plan, workout log, reading queue, wishlist, travel itinerary, family tree, garden plan, or home inventory. Coordination formats could become forms, surveys, polls, RSVPs, event schedules, tournament brackets, seating plans, and catalogs. Playful formats could power branching stories, tabletop campaigns, quest logs, character sheets, museum guides, scavenger hunts, and playlists.\n\nA format earns its place only when it has meaningful structure, benefits from direct manipulation, serializes cleanly, and remains useful as raw text. The goal is not a novelty catalog. It is a coherent ecosystem of small apps with unusually durable state.',
      },
      {
        heading: 'The canonical contract',
        body:
          'Every file starts as safe CommonMark or GitHub Flavored Markdown plus a small YAML frontmatter envelope naming an exact format version, such as `markdownto: kanban@0.1`. The format assigns semantics to familiar structures: headings can become columns, task lists become cards, tables become typed collections, links become relations, and format-owned HTML comments can carry stable ids or sparse metadata without cluttering ordinary rendering. A fenced data block is the escape hatch when natural Markdown cannot express a structure honestly.\n\nThe hard requirements are stable identity, deterministic parsing, source locations, versioned schemas, useful diagnostics, preservation of unknown fields, and no implicit code execution. The compiler produces one canonical JSON IR. The live renderer consumes that IR and emits typed mutation patches; it never reparses or guesses at source. Conformance fixtures define what compatibility means, including the difficult round-trip promise: changing a live app must not reformat unrelated prose or silently drop data.',
      },
      {
        heading: 'An SDK for formats, renderers, and a real ecosystem',
        body:
          'The extensibility model should have two independent axes. A format package defines what a file means: its namespaced id and version, accepted core range, grammar, schema, Markdown-to-IR extraction, semantic mutations, serializer, migrations, fixtures, and machine-readable documentation. A renderer package defines one way to experience that meaning: accepted format versions, read-only or round-trip mode, capabilities, runtime target, permission manifest, UI entrypoint, exports, license, and optional price. One canonical format can therefore support several competing renderers without fragmenting user data.\n\nThe SDK should scaffold both package types, provide typed IR and mutation APIs, run golden documents and invalid fixtures, verify unknown-field preservation, test minimal source diffs, and produce signed immutable packages. The public registry records namespaces, owners, versions, digests, compatibility ranges, deprecations, security advisories, and conformance reports. Agents, CLIs, and private enterprise mirrors should all resolve the same metadata.\n\nA marketplace can sit above that open registry. It can offer live demos, screenshots, one-click hosted installation, verified badges, support policies, pricing, reviews, and usage analytics. Format authors can create shared public standards; renderer developers can sell better interfaces, collaboration, specialist exports, hosting, compute, themes, TTS, or support. The governance boundary is essential: marketplace popularity or payment must never redefine a canonical format. Semantics change only through versioned RFCs, migrations, and fixtures, and packages remain installable without the hosted store.',
      },
      {
        heading: 'Kanban as the reference app',
        body:
          'Kanban is the right first proof because its grammar is legible and its interaction is meaningful. A file contains frontmatter, one heading per column, and one task-list item per card. Stable ids and optional metadata preserve owners, priority, labels, dependencies, and dates. In an ordinary Markdown viewer it is still a useful project list. On Markdown To it becomes a fast board with drag-and-drop, filters, card editing, history, and validation.\n\nA drag produces a semantic operation—move task `T-002` from Backlog to In progress against source hash X. The compiler turns that operation into the smallest source edit. If the file changed elsewhere, the app shows a real conflict instead of overwriting it. The user can download the normalized board state at any moment. Read-only renderers are easy; this safe state-to-source loop is the technical heart of the project.',
      },
      {
        heading: 'Markdown to audio as a paid workflow',
        body:
          'Audio is a particularly strong second format because it combines a canonical manuscript with a service people may happily pay for. An `audio@0.1` file can specify chapters, narration exclusions, pronunciations, pauses, voice direction, pace, and export preferences while remaining a readable manuscript. The live studio lets the user audition high-quality voices, preview difficult sentences, inspect a transparent duration and fee estimate, and approve generation.\n\nProduction should run chapter by chapter with resumable jobs, word-level timings, captions, and source-hash caching. If one paragraph sounds wrong, the user regenerates that section rather than paying for the entire book again. Delivery can include MP3, M4B, captions, a private podcast feed, and the source Markdown plus a build receipt. The business model is unusually direct: underlying generation cost plus a visible service margin, with optional premiums for higher-quality voices, mastering, storage, or private feed hosting.',
      },
      {
        heading: 'Agent-native distribution',
        body:
          'The human website should be beautiful, but agents should not need to scrape it. Each version and format should publish concise Markdown documentation, JSON Schema, valid and invalid fixtures, migrations, an `llms.txt`, and a small `SKILL.md`. The CLI should support init, inspect, validate, open, render, publish, migrate, and doctor. The MCP server should expose the same compiler through structured tools for discovering formats, scaffolding files, validating documents, applying semantic patches, rendering apps, and publishing them.\n\nPlugins for common harnesses should be thin teaching layers, not separate implementations. They tell the agent when a request fits a Markdown To format, fetch only the relevant specification, create the smallest valid file, validate before claiming success, and return the portable source alongside any hosted link. The wedge is agents because they already prefer files and can adopt conventions quickly; the result is still useful to everyone.',
      },
      {
        heading: 'How it becomes a standard',
        body:
          'The open layer should include the grammar, schemas, intermediate representation, fixtures, parser, validator, format and renderer SDKs, registry client, and conformance suite. A format cannot become common if its meaning requires an account or one company\'s cloud. The hosted business sells convenience: beautiful live apps, marketplace discovery, private links, collaboration, version history, custom domains, themes, high-quality TTS, access controls, managed builds, and API volume.\n\nStart with two deliberately different proofs: `kanban@0.1` demonstrates safe bidirectional app state; `audio@0.1` demonstrates an editorial production workflow with real variable cost. Then ship the TypeScript core, CLI, local MCP, playground, and harness skills. After the contracts stabilize, let third parties publish namespaced experimental formats and alternate renderers; promote only the ones with real files, migrations, multiple implementations, and public conformance evidence. The standard should follow demonstrated portability, not lead with a committee.',
      },
      {
        heading: 'The name and domain',
        body:
          'The intended name—Markdown To—is stronger than the accidental “Markdown 2.” It reads as a verb, communicates transformation without implying a replacement for Markdown, and fits every product phrase: Markdown to Kanban, Markdown to audio, Markdown to a trip. The typo also surfaced a useful constraint: markdown2.com is already an active, unrelated rich-document converter, so avoiding “Markdown 2” prevents confusion.\n\nOf the available domains, `markdownto.ai` is the winner. It teaches the name immediately and emphasizes the agent-native wedge. `markdownto.io` is worth buying as a defensive redirect and durable developer-infrastructure fallback. `mdto.ai` is also worth securing for the CLI, API, short links, or machine-facing endpoints, though it is too opaque to introduce the category alone. `mdto.io` is optional; if all four are inexpensive, buying the set is reasonable.',
      },
      {
        heading: 'Open questions',
        body:
          'Can a strict format remain pleasant to hand-author after stable ids and metadata arrive? Is GFM the portable base, or should the normative core stay at CommonMark with GFM as a bundled extension? Should a file have exactly one format, or can carefully scoped extensions compose without ambiguity? Is hidden HTML-comment metadata preferable to visible attribute syntax or fenced YAML?\n\nWhich formats should be official versus community-owned, and what evidence promotes a community format into the standard namespace? Can renderer permissions and sandboxing make a third-party marketplace safe without destroying extensibility? What mutation protocol supports conflicts, undo, and concurrent edits without turning the file into an event log? How should a hosted app separate its canonical definition from high-volume runtime data such as form submissions? Can conformance badges make portability credible across independent renderers? How are marketplace revenue and rankings prevented from capturing format governance? And how much hosted functionality can remain proprietary before the project feels like a funnel rather than a genuine standard?',
      },
    ],
    references: [
      {
        title: 'CommonMark specification',
        href: 'https://spec.commonmark.org/0.31.2/',
        note:
          'The unambiguous base grammar and test-oriented precedent for a portable Markdown standard.',
      },
      {
        title: 'GitHub Flavored Markdown specification',
        href: 'https://github.github.com/gfm/',
        note:
          'A strict CommonMark superset whose tables and task-list items are especially useful for application formats.',
      },
      {
        title: 'Pandoc user guide',
        href: 'https://pandoc.org/MANUAL.html',
        note:
          'The canonical universal document-converter reference and an important boundary: Markdown To is about live semantic apps, not merely more output extensions.',
      },
      {
        title: 'MDX — what is MDX?',
        href: 'https://mdxjs.com/docs/what-is-mdx/',
        note:
          'A major Markdown extension that enables JSX components and JavaScript; useful contrast for Markdown To\'s no-implicit-execution contract.',
      },
      {
        title: 'Markdoc syntax',
        href: 'https://markdoc.dev/docs/syntax',
        note:
          'A CommonMark superset with schemas, validation, tags, attributes, and variables—valuable precedent for typed extensibility.',
      },
      {
        title: 'Mermaid Kanban syntax',
        href: 'https://mermaid.js.org/syntax/kanban.html',
        note:
          'Evidence that text-authored Kanban structure is useful, while leaving an opening for a full bidirectional live app and portable state contract.',
      },
      {
        title: 'Mermaid Gantt syntax',
        href: 'https://mermaid.js.org/syntax/gantt.html',
        note:
          'A mature example of text-defined tasks, dates, dependencies, milestones, exclusions, and rendered schedules.',
      },
      {
        title: 'Quarto',
        href: 'https://quarto.org/',
        note:
          'A powerful Markdown-based publishing system spanning articles, presentations, dashboards, websites, blogs, books, PDF, Word, and EPUB.',
      },
      {
        title: 'Adaptive Markdown',
        href: 'https://github.com/SemiSimpleMath/Adaptive-Markdown',
        note:
          'The closest philosophical precedent: a readable Markdown file becomes both the source of truth and a programmable, agent-editable living app.',
      },
      {
        title: 'Kanbaruu',
        href: 'https://www.kanbaruu.com/',
        note:
          'A close product precedent for repository-backed Markdown tasks, multiple project views, and native MCP access for agents.',
      },
      {
        title: 'Obsidian Kanban',
        href: 'https://github.com/obsidian-community/obsidian-kanban',
        note:
          'A mature implementation of Markdown-backed Kanban and important prior art for bidirectional board state.',
      },
      {
        title: 'Markwhen',
        href: 'https://markwhen.com/',
        note:
          'A specialized Markdown-like language that parses time-oriented documents to JSON and multiple timeline or calendar views.',
      },
      {
        title: 'AudioDoc',
        href: 'https://www.docstoaudio.com/',
        note:
          'Evidence that Markdown-to-narration is already useful, leaving room for a deeper canonical audio-production specification and paid workflow.',
      },
      {
        title: 'Model Context Protocol specification',
        href: 'https://modelcontextprotocol.io/specification/latest',
        note:
          'The standard tool surface for letting agent harnesses discover formats, validate files, render apps, and publish results.',
      },
      {
        title: 'The existing markdown2.com product',
        href: 'https://markdown2.com/',
        note:
          'An unrelated rich-document converter discovered during naming research; the active product makes “Markdown To” the clearer public identity.',
      },
    ],
  },
];

export const ideaBySlug = (slug: string) => ideas.find((i) => i.slug === slug);
