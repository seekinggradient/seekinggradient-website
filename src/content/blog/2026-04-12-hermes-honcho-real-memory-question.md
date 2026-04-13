---
title: "Hermes, Honcho, and the Real Memory Question in Personal Agents"
pubDate: 2026-04-12
description: "Hermes is best understood not as magical self-improvement, but as a personal-agent runtime organized around memory, transcript recall, and reusable skills. Here’s how it compares to OpenClaw, where Honcho fits, and what the implementation actually seems to be doing."
author: "Seeking Gradient"
---

# Everyone Keeps Talking About Hermes. Here’s What It Actually Is.

![Hermes editorial memory architecture](/images/blog/hermes-editorial-memory-architecture.png)

*Hermes is a personal-agent runtime organized around memory, transcript recall, and reusable skills.*

If you already know OpenClaw, you can get to Hermes faster than most people. You already know what this category looks like when it stops being a toy: persistent sessions, chat surfaces, background work, memory, retrieval, maybe cron, maybe subagents, maybe too many moving pieces. You also know how quickly the discourse gets sloppy. Every repo has "memory." Every repo is "agentic." Half of them are allegedly self-improving.

Hermes is worth sorting out because it is not just another generic agent repo with a fashionable README. But it is also not some magical break from the rest of the field. It lives in the same neighborhood as OpenClaw. It just has a different obsession.

OpenClaw increasingly looks like the everything runtime. That is not an insult; it is what the project has become. It keeps widening: more channels, more memory layers, more media tools, more node/device surface, more plugin lifecycle machinery, more task-flow substrate, more imported history, more ways to run while you sleep. If you want one personal-agent runtime that tries to touch your whole digital life, OpenClaw is still the obvious reference point.

Hermes is making a narrower bet.

It seems much more interested in the question, "What useful residue from this session should still be around next time?" Not in a vague memory-marketing sense. In a very literal sense. What should stay in prompt memory? What should live in searchable transcript history? What should become a reusable skill? What should be handed off to a richer memory layer like Honcho?

That is the reason to care about Hermes. Not because it has tools. Not because it can sit in Telegram. Not because Nous built it. The interesting part is that it is trying to make memory, recall, and procedural carryover feel like runtime primitives instead of side features bolted onto a tool loop.

If I had to compress the whole comparison into one sentence, I’d put it this way:

> OpenClaw is the everything runtime. Hermes is the runtime with the sharper opinion about what should survive from one session to the next.

That is not the whole story, but it is the right place to start.

---

## So what is Hermes, exactly?

At the plain-English level, Hermes is a Python-based personal-agent runtime from Nous Research with:

- a CLI
- a messaging gateway
- cron / scheduled automations
- ACP/editor surfaces
- a fairly broad tool system
- multiple execution backends
- persistent session storage
- bounded built-in memory
- searchable transcript history
- and a background review loop that can save memory or create or update reusable skills

That probably sounds familiar if you know OpenClaw. It should. These systems are solving adjacent operator problems.

The difference is emphasis.

When OpenClaw adds something, it often feels like the project getting broader. When Hermes adds something, it often feels like the project asking, "Does this help the agent carry useful state forward without turning into mush?"

That is a cleaner design question than most of the field is asking.

---

## The first thing people get wrong: Hermes is not doing strong continuous learning

The label that follows Hermes around is some variation of "the self-improving one." That phrase is directionally useful and technically sloppy.

Hermes does not appear to be doing online fine-tuning, RL-style post-deployment updates, or anything else that would justify strong claims about parameter-level learning. If that is what you hear when you hear "self-improving," you are going to come away disappointed.

What Hermes actually has is more modest and, frankly, more believable.

It learns through **artifacts**.

That means the runtime gets better, when it gets better, by creating and reusing things like:

- `MEMORY.md`
- `USER.md`
- `SKILL.md` files
- searchable session history
- recalled summaries of previous work

That sounds less sexy than "self-improving agent." It is also much closer to what is really there.

This matters because a lot of agent writing blurs together three very different things:

- the model getting better
- the runtime getting better at retrieval and recall
- the system accumulating better instructions and memory artifacts

Hermes is mostly the third thing, with a bit of the second.

The honest sentence is:

> Hermes implements a procedural-memory loop, not a parameter-learning loop.

And honestly, that is already more interesting than most of the category deserves.

---

## What Hermes seems to think the hard problem is

A lot of agent projects still behave as if the real challenge is one of these:

- tool calling
- browser automation
- model routing
- prompt engineering

Those matter. But if you read the Hermes docs and code with OpenClaw in the back of your mind, the stronger pattern is that Hermes seems preoccupied with **state discipline**.

Not "memory" in the vague sense. More like:

- what belongs in always-on prompt memory?
- what should be searchable but not always loaded?
- what should become a reusable procedure?
- what should just remain transcript history?
- when does a one-off success become durable operational knowledge?

That is the sort of question you ask after you’ve already built the obvious agent loop and discovered that the real mess starts later.

Here is the stack as I now think it looks:


The important thing is not the diagram. It is the separation. Hermes does not flatten everything into one fake concept called memory. That alone puts it ahead of a lot of the field.

---

## How Hermes actually works

At the center is a large `AIAgent` runtime serving multiple surfaces:

- CLI
- messaging gateway surfaces like Telegram, Discord, Slack, WhatsApp, Signal
- cron jobs
- ACP/editor integrations
- batch and research workflows

The high-level loop is what you would expect:

1. assemble prompt and runtime context
2. call the model
3. dispatch tools
4. continue until complete or interrupted
5. persist the session
6. optionally run a background review pass for memory or skills

That sixth step is the real tell.

Most agent runtimes stop at "respond and persist." Hermes goes one step further and asks whether the just-finished session produced anything worth keeping in a more durable form.

That sounds small. It isn’t. In practice, it changes what the runtime is for.

---

## Hermes has three memory layers that matter

This is the part of the implementation that actually made me take it seriously.

![Agent state taxonomy](/images/blog/agent-state-taxonomy.png)

### 1. Built-in prompt memory

Hermes has a small built-in memory system centered on two files:

- `MEMORY.md`
- `USER.md`

These hold compact, curated facts:

- user preferences
- working style
- environment notes
- recurring conventions
- durable instructions or lessons

The implementation detail worth noticing is that these are loaded as a **frozen snapshot at session start**.

That means if Hermes writes new memory during the session, the files on disk update immediately, but the prompt does not get rewritten mid-session. The new memory shows up on the next session.

I buy this design choice. It is the kind of boring systems tradeoff that people skip when they are still in demo mode. Hermes is clearly choosing prompt stability and prefix-cache preservation over the illusion of constant freshness.

It is also worth noticing that the built-in memory is tiny. That is not a bug. It is the runtime saying: always-on prompt memory should be scarce. If you let it swell, it stops being memory and becomes swamp.

OpenClaw readers should appreciate the contrast here. OpenClaw has gone in a much broader direction with diary flows, dreaming, memory-wiki, imported chat history, active-memory, and pre-reply retrieval layers. Hermes looks narrower and cleaner. OpenClaw looks broader and more operator-native. Both are real choices.

### 2. Searchable transcript recall

Hermes stores sessions and messages in SQLite and uses FTS5-backed search over past transcripts.

So now you have a second memory layer:

- not tiny
- not always loaded
- but large and searchable

This is the right complement to bounded memory. A personal agent should not try to live entirely inside the prompt. It should have a small bias layer and a larger recall layer. Hermes gets that.

Again, OpenClaw-aware readers will recognize the same need. The difference is mostly one of legibility. Hermes’ version of the stack is easier to explain in one breath.

### 3. Procedural memory through skills

This is the strongest part of the Hermes story.

Skills in Hermes are structured instruction packages centered on `SKILL.md`, with optional references, templates, scripts, or assets. The agent can create them, patch them, rewrite them, and remove them.

That matters because it gives the runtime a place to store **how to do things**, not just facts about the user.

A good skill can encode:

- when to use a workflow
- what sequence of steps works
- what tools to prefer
- what mistakes to avoid
- what scripts or templates make the workflow more reliable

This is why the project’s self-improvement language is not total nonsense. A lot of systems say they learn and mean they retrieve old chat snippets. Hermes is at least aiming at something more durable than that. It is trying to turn good work into reusable procedure.

The obvious risk is skill rot. If the runtime saves too much, or saves low-quality patterns, or never prunes anything, the whole thing turns into procedural sediment. But at least that is the right failure mode. I would rather argue about whether the skills are good than whether the system has any mechanism at all.

---

## One concrete scenario: where Hermes is better than a generic tool loop

Imagine the kind of task where most agent demos start looking fake:

> Review my research repo, summarize what we already know about agent memory systems, compare that to Hermes, write a blog draft, and keep track of what worked so next time the writing process is better.

A normal tool-calling agent can do a decent version of the first half:

- read files
- search the web
- draft text

Then the session ends and most of the useful meta-knowledge disappears.

Hermes is designed so more of that residue survives.

### During the task
It can:

- use its normal tools
- persist the transcript
- keep execution history searchable

### After the task
It can run a background review pass and ask:

- did I learn a durable preference about how this user wants blog posts structured?
- did I discover a reusable workflow for research -> critique -> draft -> revise?
- should that become a skill instead of dying with the session?

### On the next similar task
It can start with:

- small durable memory already in prompt
- searchable prior transcript history
- reusable skill instructions if the previous run produced one

This is what Hermes is trying to do better than a normal agent loop. Not solve learning in the grand sense. Just retain more of the useful residue of prior work.

That sounds modest. It should. Most of the grander language in this category is fake.

---

## The actual learning loop in practice

This is the part most projects hand-wave. Hermes at least implemented the boring part.

The runtime has explicit review prompts for:

- memory review
- skill review
- combined review

After the user-visible answer is already delivered, Hermes can run a background review pass over the conversation and ask:

- did the user reveal something durable about preferences or working style?
- did the agent discover a reusable method?
- should an existing skill be updated?
- should a new skill be created?

If yes, Hermes writes the memory or patches the skill.

Here is the lifecycle in one picture:

![What survives after a session](/images/blog/what-survives-after-a-session.png)

This is what people should mean when they say Hermes learns.

Not mystical recursion. Not model training. Just a runtime that responds, persists the interaction, then looks back and decides whether anything should survive in a more useful form.

The hard question is whether the loop is selective enough to compound useful knowledge faster than it accumulates clutter. That is not a rhetorical question, either. It is the whole game.

---

## Is Hermes any good?

Yes. With caveats. More specifically: yes, because it is trying to solve the right problem.

### Why I think Hermes is real

#### 1. It has an actual point of view

A lot of agent repos are really just tool loops with inflated self-descriptions. Hermes has a clearer worldview.

It seems to believe a useful personal agent needs:

- multiple user surfaces
- persistent state
- bounded prompt memory
- searchable transcript recall
- procedural skills
- background review
- support for long-running or off-laptop execution

That is not the same thing as saying the system is finished or superior. It just means there is a real design opinion underneath the repo.

#### 2. Its memory architecture is cleaner than average

Hermes does not collapse all state into one blob called memory. It distinguishes:

- small curated prompt memory
- searchable transcript history
- procedural memory through skills
- optional richer external memory providers

That sounds obvious until you look at how many agent systems still blur those layers together.

#### 3. It is built for runtime life, not just terminal theater

Hermes is explicit about execution backends such as local, Docker, SSH, Modal, and others. It is trying to be something you can actually run, not just something you can demo once.

#### 4. The implementation story cashes out

This is why I take it seriously at all.

The repo and docs point to actual runtime machinery:

- bounded memory files
- SQLite + FTS5 transcript search
- background review prompts
- skill creation and patching
- memory provider plugins

That is a lot better than the usual genre move of claiming "persistent memory" when what you really mean is "we pasted old snippets into the prompt again."

### Where I would still be skeptical

#### 1. "Self-improving" still oversells it

Hermes is one of the more defensible users of that phrase in open-source agents, but it still overshoots what is really there.

What Hermes has is:

> reflection after the fact, plus durable procedural artifacts

That is useful. It is not strong continuous learning.

#### 2. The loop still depends on judgment calls from the model

If the background review loop is too eager, you get noise. If it is too conservative, nothing compounds. If retrieval over old notes and skills is sloppy, the runtime pays complexity tax without gaining much intelligence.

This is the central risk in the whole design.

#### 3. OpenClaw still looks broader in operator terms

I think this is worth saying plainly. If you already know OpenClaw, Hermes does not obviously beat it on breadth of runtime surface, channel depth, or operator-native feel. OpenClaw still looks broader and more lived-in as a personal-agent operating environment.

Where Hermes looks sharper is not breadth. It is the memory / procedural-learning thesis.

That is a narrower claim, but a strong one.

My blunt verdict is this:

**Hermes is real, interesting, and architecturally more serious than most of its peers — but it is still much better described as a runtime with procedural memory than as a truly self-improving intelligence.**

I mean that as praise.

---

## So what is Honcho?

If you come from OpenClaw, the easiest way to place Honcho is this: it is not the runtime. It is the memory bet.

Honcho is **not** another personal-agent runtime that substitutes cleanly for Hermes or OpenClaw.

It is better understood as a **memory and reasoning layer** built around a more ambitious idea:

> memory should not just retrieve prior text; it should build evolving representations of entities over time.

That is a stronger claim than standard RAG-style memory. It is also a riskier one.

Honcho is organized around a set of primitives that tell you what kind of system it wants to be:

- **workspace**: isolation boundary
- **peer**: persistent entity like a user or agent
- **session**: bounded interaction thread
- **message**: atomic write unit
- **conclusions**: derived inferences
- **representation**: evolving model of a peer
- **summaries**: compressed session memory
- **search / context**: retrieval surfaces over all of the above

If OpenClaw makes you think in terms of memory features, Honcho is closer to a memory **ontology**. It is trying to model users and agents as entities, not just store things they said.

The cleanest summary I can give is:

> generic memory systems retrieve what was said; Honcho tries to model what can be concluded.

That is why people keep attaching it to bigger conversations about agent memory.

---

## The best Honcho idea is perspective

The most interesting thing about Honcho is not just persistence. It is perspective.

Honcho is built around peers and observation. That means memory can be conditioned by who observed what in which sessions. It does not have to become one omniscient shared blob.

That matters for:

- multi-agent setups
- assistants that operate across different contexts
- socially bounded memory
- personalization that depends on recurring observed patterns, not just literal prior statements

Most memory systems flatten everything into one profile. Honcho is trying something more ambitious. It wants memory to reflect entities, relationships, and observation, not just semantic similarity.

That is a real conceptual difference. It is also where the danger enters, because once a system moves from retrieval to inference it can become wrong in a more structured and persuasive way.

---

## How Honcho fits into Hermes

Hermes' built-in memory is intentionally small and frozen. Honcho gives Hermes another path:

- dynamic cross-session memory
- peer-centric user modeling
- semantic search over richer memory objects
- natural-language query interfaces over an inferred memory layer

That is why Hermes plus Honcho makes sense as a stack.

Hermes by itself can already do:

- compact prompt memory
- transcript recall
- procedural adaptation via skills

Adding Honcho says:

- I also want a richer memory layer that reasons about entities and patterns over time

So Hermes and Honcho belong in the same conversation, but not because they are the same kind of thing.

Hermes is the runtime.

Honcho is the more ambitious memory layer.

---

## The whole thing in three miniature code sketches

These are conceptual rather than literal copy-paste snippets, but they capture the shape of the architecture.

### Hermes built-in memory

```python
# small, curated, prompt-stable memory
MEMORY.md   # environment facts, durable lessons, agent notes
USER.md     # user preferences, working style, expectations
```

### Hermes learning loop

```python
respond_to_user()
persist_session()
background_review()

if review_finds_durable_fact:
    write_memory()

if review_finds_reusable_workflow:
    create_or_patch_skill()
```

### Honcho mental model

```python
workspace
  ├── peers
  ├── sessions
  ├── messages
  ├── conclusions
  ├── representations
  └── context / search interfaces
```

If you understand those three little sketches, you understand most of what matters here.

---

## Should an OpenClaw-literate reader care?

Yes, for two reasons.

First, Hermes is one of the clearest current examples of a personal-agent runtime trying to make **procedural memory** real instead of merely rhetorical.

Second, Honcho points toward a memory future that is more ambitious than retrieval and more structurally interesting than stuffing more text into prompts.

You should care about Hermes if you are interested in:

- personal-agent runtimes rather than one-shot coding shells
- systems that try to accumulate useful state over time
- cleaner distinctions between prompt memory, recall, and procedural memory
- long-running or off-laptop agent usage
- open-source runtimes that treat self-improvement as an implementation problem rather than a slogan

You should be more skeptical if what you want is:

- true continuous learning in the ML sense
- a tiny architecture with obvious boundaries
- strong guarantees that the memory and skill loop will stay clean as it grows

Hermes is not smoke. It is not just a loud repo with a good README. It is a fairly serious attempt to build a personal-agent runtime that compounds through artifacts.

That is already more than most of the category can honestly claim.

---

## Final take

If you already know OpenClaw, the right way to look at Hermes is not "same thing, different logo."

The better way to look at it is:

- OpenClaw keeps broadening into the everything runtime
- Hermes is making a sharper bet on memory, recall, and procedural learning
- Honcho is the adjacent memory layer that makes the state story more ambitious still

That is the map.

---

## Further reading

### Hermes
- Repo: https://github.com/NousResearch/hermes-agent
- README: https://github.com/NousResearch/hermes-agent/blob/main/README.md
- Architecture docs: https://hermes-agent.nousresearch.com/docs/developer-guide/architecture
- Memory docs: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
- Security docs: https://hermes-agent.nousresearch.com/docs/user-guide/security
- Honcho integration spec: https://github.com/NousResearch/hermes-agent/blob/main/docs/honcho-integration-spec.md

### Honcho
- Docs: https://docs.honcho.dev/
- Hermes integration guide: https://docs.honcho.dev/v3/guides/integrations/hermes
- GitHub: https://github.com/plastic-labs/honcho

### OpenClaw context from the local knowledge base
- `knowledge/core-harnesses.md`
- `knowledge/agent-memory.md`
- `knowledge/personal-agents.md`
