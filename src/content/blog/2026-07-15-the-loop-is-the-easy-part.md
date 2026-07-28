---
title: "The Loop Is the Easy Part: What a Modern Agent Framework Actually Gives You"
pubDate: 2026-07-15
description: "What rebuilding a bespoke agent on Eve taught me about the durable runtime, product boundaries, and voice architecture around the model loop."
author: "Seeking Gradient"
---

I've been building AgentsFS, a system that gives agents persistent memory across harnesses.

As I've been building it, I've wanted to add an agent to the product. So I've been exploring the available frameworks and experimenting with a few of them — and, before that, I did something I now consider the best possible education in this topic: I built the whole agent product **bespoke** first. My own model loop, my own streaming, my own tools, my own hosting. Then I spent the last couple of weeks rebuilding it on [Eve](https://eve.dev), the new agent framework from Vercel.

Vercel built Eve in the same spirit that it built Next.js: an opinionated, convention-first framework that gives a project a predictable shape and takes responsibility for a meaningful amount of the surrounding infrastructure. Next.js did that for web apps. Eve is trying to do it for agents.

This piece is what the rebuild taught me about what an "agent framework" has actually become. Eve is my running example because it's the one I put real miles on, but the argument isn't about Eve. It's about a shift: *the harness used to be the loop around the model; it is becoming the operating system around the loop.*

## Day one is genuinely easy

Here is the agent you build on day one:

```txt
user message
  -> model
  -> tool call(s)
  -> response
```

Fifty lines with any modern SDK, and it works. Mine worked. It answered questions, called tools, streamed tokens, and demoed beautifully. If you stop reading here and go build that, you will have a working agent tonight — that part of the field really is commoditized.

The problem is not the loop. **The problem is everything the loop meets when it leaves the demo: time, failure, people, and authority.**

## Where the day-one agent dies

My bespoke agent tied each conversation turn to one HTTP request. The browser resent the whole history every time; the server ran the loop; a stream carried the answer back. Simple, legible — and structurally wrong in ways that surfaced one incident at a time:

- **Disconnect or deploy mid-turn?** The in-flight work is gone. Nothing resumes.
- **A write needs a human's OK?** There's no way to *wait* — a request can't park for a day.
- **History grows?** No compaction. Mine grew until requests hit a one-megabyte limit and the product started returning 413s.
- **A tool ran twice after a retry?** Hope it was idempotent, because nothing else is checking.
- **Two tabs race the same conversation?** Last writer wins, silently.

![Request-lifetime execution breaking across failures versus a checkpointed durable session](/images/blog/the-loop-is-the-easy-part/02-time-and-failure.png)

None of these are exotic. They are the *ordinary physics* of software that runs longer than one request — and the day-one loop has no answer to any of them. **"Robustness" is not one checkbox; it is half a dozen distinct failure boundaries**, and a reconnectable stream solves exactly one of them.

## A ladder, so we can be precise

The word "harness" gets used for everything from a provider adapter to a whole platform, which makes most framework debates slippery. Five layers keep it honest:

| Layer | Question it answers |
| --- | --- |
| *Model adapter* | How do I call this model? |
| *Canonical harness* | How does one agent turn run? |
| *Durable runtime* | What happens over time and across failure? |
| *Agent platform* | How does the agent enter the world and operate as a service? |
| *Product application* | What does the work mean to a user? |

![The five-layer ladder from model adapter through product application](/images/blog/the-loop-is-the-easy-part/01-five-layer-ladder.png)

**A "modern agent framework" is the middle three layers bundled behind one programming model.** That's the shift. The old harness was layer two. Eve — and its generation of frameworks — provides layers two through four as a unit, with conventions instead of glue code. The top layer, the one users actually experience, remains yours no matter what you adopt. Keeping the layers separate is what lets you credit a framework precisely, instead of either fanboying or dismissing.

## What the bundle actually contains

Here is the catalog of things I had either built badly, deferred, or not known I needed — each of which the framework hands you as a slot. This list is the honest answer to "why not just keep my loop?"

**Durable sessions.** A conversation becomes a checkpointed workflow. Completed steps replay from recorded results; a crash or redeploy resumes instead of losing the turn. I tested this by killing the server mid-turn and watching the work finish after restart. My bespoke stack loses that work every time.

**Waiting as a first-class state.** This one rearranged my head: a clarifying question, a write approval, an OAuth consent, and a handoff to a human are *the same runtime shape* — park durably now, accept authenticated input later, resume once from a known checkpoint, without holding a server process open. I had built zero of the four; the framework gave me all four as one mechanism.

![A human approval durably parks, verifies, binds, audits, and resumes a workflow once](/images/blog/the-loop-is-the-easy-part/04-human-approval.png)

**Compaction as policy, not panic.** A context window is a working set, not storage. A real compactor decides what the next model call sees — commitments, unresolved tasks, and provenance survive; verbosity doesn't — and it needs its own observability, because **a bad summary silently changes the task**. I had "no compaction" as my policy, which is how you get 413s.

**Authority and credentials.** Tools describe what an agent *can request*; something else must decide what it *may do* for this user, this repository, this turn — sandbox boundaries, egress policy, secret brokering, audit. The least visible difference between a demo and production is that **a tool registry can be correct while the credential model around it is unsafe.** I learned this the expensive way: a security review of my bespoke stack found exactly this class of problem.

**Channels, schedules, traces, evals.** Ingress with real semantics (sender identity, thread-to-session mapping, ordering, retries) instead of bare webhooks; schedules that turn the agent from a feature into an actor; traces that answer "where did the tokens, money, and time go, and what is blocking progress"; evals as a deploy gate. Each is a solved slot instead of a bespoke subsystem.

The compounding value isn't any single row — it's that the *next* agent you build reuses the same conventions, protocol, and deploy path. My bespoke stack solved maybe half these problems, each in its own dialect.

Two honest caveats, so this stays education rather than advocacy. First, these frameworks are young: Eve is a public beta shipping breaking changes at nearly every minor version — pin exactly, read every release note, upgrade on a branch. Second, the polished operating path is the vendor's managed platform; self-hosting is real but hands you back the workflow store, the sandbox, and observability. That trade — conventions and managed operations in exchange for platform coupling — is the actual decision, and it deserves a clear-eyed cost-benefit, not a vibe.

## What no framework gives you

Now the boundary, because this is where I see teams get burned. "Storage" in an agent system is at least five different things, and a framework owns only the first two:

![Five separate stores with credentials deliberately outside the memory hierarchy](/images/blog/the-loop-is-the-easy-part/09-five-stores.png)

Checkpoints and session state belong to the runtime. But the **product transcript** — the conversation your user believes is permanent, with citations, artifacts, retention, search — is yours. **Cross-session memory** is yours. The **domain source of truth** is yours. A framework can preserve a session without owning long-term memory, expose a web channel without owning your conversation model, and trace a tool call without producing a trustworthy citation.

Two consequences that sound like edge cases and are not:

- **A web reload can orphan a perfectly durable server session** if your application never persisted its session cursor. Runtime durability and product continuity are separate promises; you keep the second one yourself.
- **Durable sessions are not durable memory.** Even an immortal session compacts — verbatim infinite recall never existed anywhere in the stack. What deserves to persist has to be deliberately promoted into stores you own. For me that's three tiers: the session for working state (*hot*), an application-owned conversation archive for raw recall (*warm*), and a Git-backed knowledge base for distilled conclusions (*cold*). **The conversations that matter shouldn't just be retrievable; their conclusions should be written down where the next session starts from them.**

![Compaction turns history into bounded working context while a separate durable store survives](/images/blog/the-loop-is-the-easy-part/03-context-compaction.png)

There is a law hiding in both of those bullets, and it took a full audit of my own rebuild to see it plainly: nearly every real defect traced to state with **two owners**. A session cursor held by both the client and the server. A transcript persisted by two subsystems. A turn schedule enforced by UI state on one side and by nothing on the other. The framework boundary isn't where the danger is — *shared custody is*. Every piece of state needs exactly one writer, and most of what looked like framework friction was actually me and the runtime both believing we owned the same thing. The fix that finally held was structural, not defensive: a single server-side executor became the only writer of the conversation cursor, and an entire class of fork-and-regression bugs stopped being *possible* rather than merely guarded against.

## Voice is where the boundary stops being abstract

I care about voice because that's how a thinking session actually happens — talking through an upcoming client meeting in the car, not thumb-typing. Building voice mode is also the fastest way to *feel* everything above, because voice forces the framework's boundary into the open.

The architecture that works starts with a split: a realtime speech model up front as the mouth and ears — microphone, interruption, low-latency conversational flow — and the durable session behind it as the brain. *The talker handles latency and flow. The thinker handles knowledge, tools, and actions.*

My first pass drew that boundary in the obvious place: the talker was forbidden to be intelligent, and every substantive utterance was bridged into the durable session as a tool call. The records came out right — and the conversation died. Every "what do you think about this?" became ten to sixty seconds of contractually mandated silence while a high-reasoning model ran a tool loop. So I now have a matched pair of mistakes, one per layer of the ladder: my bespoke build got voice's *records* wrong; my rebuild's first voice architecture got voice's *latency* wrong. A conversation has latency classes, and one brain cannot serve them all.

What shipped instead is three lanes, which is just how a person talks. **Converse** instantly — the speech model is allowed to think with you, grounded by a briefing loaded once at session start. **Glance** in about a second — one retrieval call that returns answer-context rather than search pointers (more on that in a moment). **Delegate** asynchronously for real work — which is now rare, and rare is exactly when async stops feeling broken. Match the depth of the machinery to the depth of the utterance: a human conversation partner answers, glances at their notes, or says "let me get back to you," and a voice agent needs all three moves. Mine had only the third.

![Three lanes matching machinery depth to utterance depth: converse instantly, glance in a second, delegate asynchronously](/images/blog/the-loop-is-the-easy-part/06-three-lanes.png)

And the moment it's wired up, you're staring at three different records wearing one UI:

![One visible UI with three distinct records](/images/blog/the-loop-is-the-easy-part/03-one-ui-three-records.png)

The realtime session is deliberately short-lived and doesn't resume. The durable session holds the agent's turns and state — but you cannot backfill it; the only way in is a real turn, and context passed alongside a turn is intentionally ephemeral. And the transcript on screen is whatever your application chose to keep. **A shared UI is not a shared session.** My first voice build got this wrong in every way available: a second session for voice consults, cross-mode memory faked by re-pasting the visible transcript, spoken exchanges that evaporated on reload. The fix wasn't cleverer glue — it was accepting that **the application must own the transcript**: every runtime event and every finalized spoken exchange teed into one append-only, ordered archive that the UI renders from and the user can trust.

![An app-owned archive joins runtime events, voice turns, and tool results](/images/blog/the-loop-is-the-easy-part/04-own-the-record.png)

Owning the transcript also settled where memory comes from, with a division of labor I didn't expect: **transport is software; memory is a model — and they run at different times.** Every finalized spoken exchange lands in the archive the moment it happens. That's plumbing — no judgment involved, nothing lost if the phone dies in a pocket. Then, when the session ends, *one* reflection turn hands the whole conversation to the durable agent: fold this into memory, write the journal entry, propose the notes worth keeping. The fast, shallow model never touches memory. The slow, careful model does the remembering — after you hang up, when its slowness costs nothing.

My favorite part is where the mechanism came from. Two sections ago I listed "you cannot backfill a durable session — the only way in is a real turn" as a constraint to design around. Distillation is that constraint used *as* the design: the transcript enters durable memory by being a turn's message. The framework's most annoying rule turned out to be the correct API.

![Distillation after the call: per-exchange transcript rows land as software, one reflection turn folds the session into durable memory](/images/blog/the-loop-is-the-easy-part/07-distillation-after-the-call.png)

Do that, and the platform-retention question changes from a threat to a detail: the runtime keeps sessions long enough to resume active work; *you* keep conversations as long as your users deserve. It also hands your agent a quiet gift — a searchable archive of everything ever discussed, which turns out to be a tool, not just a record. And that one-second "glance" lane above is doing far more than a search call: what it took to make an owned knowledge base answer at conversational speed became the third piece in this series, *Retrieval Is a Pipeline, Not a Tool Call*.

## What I walked away with

The framing I'd offer anyone evaluating this generation of frameworks:

> The old agent harness was the loop around the model. The modern one is becoming the operating system around the loop: durable time, human waiting, context policy, authority, channels, schedules, and evidence. **Even so, it preserves sessions without owning memory, and traces tools without owning truth. The product — transcript, provenance, knowledge — is still yours.**

That split is not a limitation to resent; it's a division of labor, and knowing exactly where it falls is what lets you adopt a framework aggressively *and* keep the parts that make your product yours. For me those parts are a portable, Git-backed brain and the provenance behind every answer — which is a story about knowledge, not runtimes.

And the two questions this piece deliberately left open each turned out to be interesting enough to become their own articles. The runtime-side one — *where should the agent's computer live, and what should survive when it sleeps?* — is [*Fly Machines, Sprites, and Session Sandboxes*](/blog/2026-07-25-fly-machines-sprites-and-session-sandboxes). The knowledge-side one — *what does it take for a portable, owned brain to answer at conversational speed?* — is *Retrieval Is a Pipeline, Not a Tool Call*.
