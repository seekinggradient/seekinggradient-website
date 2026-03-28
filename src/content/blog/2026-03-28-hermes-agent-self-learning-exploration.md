---
title: "What Does It Actually Mean for an Agent to Learn?"
pubDate: 2026-03-28
description: "I dug into the Hermes agent's self-learning claims at the code level. What I found clarified what's possible, what's marketing, and what the real frontier looks like."
author: "Seeking Gradient"
---

A week ago I split my single OpenClaw agent into three. One runs my landing page business. One runs my podcast. One handles personal tasks. The results were immediate and obvious: each agent, freed from context-switching across unrelated domains, went dramatically deeper on its own work. My landing page agent designed an entire client-facing website, prospected real businesses, and built example pages — with almost zero input from me beyond a persona and some initial research. My podcast agent took a starter codebase and iterated the content pipeline daily, each pass better than the last.

The observation was simple but it stuck with me: specialization creates depth. When an agent has singular focus, there's no ceiling on how much better it can get at that one thing. There's always more to learn, more to refine, more to improve. The work is endless, and a focused brain can pursue it indefinitely.

That raised a question I haven't been able to shake. If focused agents naturally get better at their domain over time, what happens if you *design* for that? What if the agent's entire purpose was to learn — not to execute tasks, but to accumulate genuine expertise in a subject? Not by fine-tuning model weights, but by building, organizing, and refining a repository of knowledge in token space — the files, notes, and structured memory that the model reads at every session start.

I started calling this idea "SME Agents" — Subject Matter Expert Agents. And while I was thinking through the architecture, I kept hearing about Hermes.

## Hermes Claims a Learning Loop

Hermes is Nous Research's open-source AI agent. Its headline claim is bold: "the only agent with a built-in learning loop." It says it creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions.

That's a big set of promises. I wanted to know what was actually happening under the hood — not the README-level pitch, but the mechanical reality. So I cloned the repo and read the source.

## What's Actually Happening

The core of Hermes's learning system is a three-type memory architecture that maps, whether intentionally or not, to categories from cognitive science.

**Semantic memory** lives in two flat markdown files: `MEMORY.md` for the agent's own notes and `USER.md` for what it knows about you. These are capped at 2,200 and 1,375 characters respectively. They're loaded into the system prompt at session start as a frozen snapshot — frozen deliberately, so the system prompt doesn't mutate mid-conversation and break prefix caching. Writes go to disk immediately, but the agent won't see its own updates until the next session.

**Episodic memory** is a SQLite database with FTS5 full-text search across all past conversations. When the agent needs to recall something from a previous session, it searches this index, loads matching conversations, and sends them through a cheap summarization model (Gemini Flash) to extract relevant context. It's RAG over your own conversation history.

**Procedural memory** is the skills system — structured markdown files describing how to do specific tasks. The repo ships with 95 pre-built skills across software development, research, media, and ML ops. The interesting part: the agent can create, edit, and patch its own skills. After a complex multi-step task, it can codify the approach into a reusable procedure for next time.

## The Background Fork

The most genuinely interesting mechanism is how learning gets triggered. Every ten turns (configurable), Hermes spawns a background copy of itself — a forked agent with the full conversation context but running in a separate thread. This fork gets a review prompt: "Has the user revealed preferences worth remembering? Was a non-trivial approach used that's worth codifying as a skill?"

The fork reviews the conversation, decides what's worth saving, writes to the shared memory and skill stores, and quietly exits. The user never sees this happening. It's automatic reflection running in the background of every conversation.

There's a second trigger at context compression time. When the conversation approaches the model's token limit and needs to be summarized, Hermes first runs a memory flush — a cheap LLM call that saves critical observations before old turns are discarded. This prevents the agent from forgetting things it learned early in a long session.

And there's a third, simpler trigger: the memory tool's schema itself instructs the model to save proactively whenever users correct it, share preferences, or when it discovers something about its environment.

## What's Not Happening

Here's where the gap between the claim and the reality becomes clear.

The name "self-learning" suggests something more than what's mechanically occurring. There is no reinforcement learning. There are no reward signals. The model's weights never change. The `rl_cli.py` file, despite its suggestive name, is a tool for the agent to orchestrate RL training of *other* models — not itself. The trajectory compressor is a data pipeline for preparing fine-tuning datasets, not a runtime learning mechanism.

There is no knowledge graph, no embeddings, no vector database. Memory is flat text files with character budgets. There is no automated forgetting or relevance decay — entries must be manually replaced. There is no execution tracking on skills — no record of which skills were used, whether they worked, or how often they're consulted. The agent cannot prioritize skills by effectiveness because it has no data on effectiveness.

And the memory limits are small. 2,200 characters of agent memory. That's roughly a page of notes. For a generalist personal assistant, this might be sufficient — you can fit a user's timezone, preferred communication style, and a handful of project conventions into a page. But for an agent that's supposed to become a deep expert in a domain? It's not even a beginning.

## What Hermes Gets Right

Strip away the marketing language and there's real substance here.

The background fork pattern is elegant. Most agent frameworks either rely entirely on the model spontaneously deciding to save something (unreliable) or require explicit user commands (friction). Hermes automates reflection without interrupting the user's flow. The agent learns from every conversation whether the user asks it to or not.

The three-type memory separation is well-designed. Semantic memory (facts), episodic memory (searchable conversation history), and procedural memory (reusable skills) serve different purposes and have different retrieval patterns. Lumping them together would create noise. Separating them means the agent can search past conversations without polluting its working memory, and can load a specific skill without loading all of its factual notes.

The prefix cache optimization is a pragmatic engineering decision that reveals real production experience. By freezing the memory snapshot at session start, Hermes ensures that every subsequent API call in the conversation can reuse the cached system prompt prefix. This can cut costs by 90% on providers that support prompt caching. It's a trade-off — the agent won't see its own memory updates within the same session — but it's the right trade-off for cost-sensitive deployments.

And the security scanning on memory and skill writes is production-grade. Every write is checked for prompt injection patterns, shell injection, and exfiltration attempts before being persisted. Agent-created skills pass through the same security audit as community hub installs. This matters when the agent has shell access.

## Where This Leaves the SME Agent Question

Hermes proves that agents can learn in token space. The concept works. An agent that reflects on its conversations, extracts reusable knowledge, and loads that knowledge into future sessions is measurably better than one that starts fresh every time.

But Hermes is a generalist learning system. It captures breadth — a little about the user, a few procedural shortcuts, some environment facts. What I'm interested in is depth. What would it take to build an agent whose entire purpose is to become an expert in a specific domain?

The gap between Hermes's learning loop and an SME Agent is the gap between keeping a few Post-it notes and writing a textbook.

**Knowledge representation** is the first problem. Flat markdown with character limits doesn't scale. A domain expert needs structured knowledge: concepts with relationships, hierarchies of abstraction, source attribution, confidence levels, and the ability to represent contradictions and open questions. Whether that's a knowledge graph, a typed database, or some hybrid, it needs to be richer than a text file.

**Curriculum design** is the second. Hermes's learning is reactive — it learns from whatever conversations happen to occur. An SME Agent needs directed learning. It needs to identify its own knowledge gaps, decide what to study next, and avoid spiraling into rabbit holes. A PhD student has an advisor. What's the equivalent for an agent? Maybe it's a learning plan that the agent itself maintains and revises — a meta-skill for deciding what to learn.

**Verification** is the third, and possibly the hardest. How does the agent know what it learned is correct? The web contradicts itself constantly. An SME Agent would need to track source quality, cross-reference claims across multiple sources, maintain confidence levels, and flag contested knowledge. Hermes has no mechanism for this — it saves whatever the LLM judges worth saving, with no quality signal beyond the model's own judgment.

**Retrieval at scale** is the fourth. When the knowledge base grows past what fits in a context window — and for any real expertise, it will — the agent needs a strategy for what to load and when. Hermes's session search (FTS5 + LLM summarization) is a starting point, but it's designed for conversation recall, not domain knowledge navigation. An SME Agent would need something closer to a self-built, self-curated RAG system where the agent is simultaneously the indexer, the retriever, and the author.

**Evaluation** is the fifth. How do you measure whether the agent is actually becoming an expert? Hermes doesn't try. An SME Agent would need benchmark questions, comparison against known expert analysis, or some form of self-testing. Without evaluation, you can't distinguish genuine learning from the accumulation of noise.

## The Actual Frontier

Here's what I think the landscape looks like right now:

**gstack** proves that one person can simulate an entire engineering organization through specialized agent skills. It's about execution breadth — different roles, not deeper knowledge.

**Paperclip** proves that multiple agents can be coordinated into organizational structures with budgets, hierarchies, and governance. It's about operational management.

**Hermes** proves that agents can maintain a learning loop across sessions — reflecting on experience, codifying procedures, building user models. It's generalist self-improvement.

**What doesn't exist yet** is an agent designed from the ground up for deep domain learning. An agent that spends its first week doing nothing but reading, researching, and organizing knowledge about a single subject. That builds a structured, verifiable, growing knowledge base. That can identify its own gaps and fill them. That gets better not just at executing tasks but at *understanding* a field.

The interesting thing is that the pieces exist. Hermes's three-type memory architecture is a reasonable starting point. The background reflection pattern solves the "when does learning happen" problem. Session search provides episodic recall. Skills provide procedural memory. What's missing is depth — richer knowledge representation, directed learning, verification, and evaluation.

The question I keep coming back to is whether token-space learning has a ceiling. Model weights encode billions of parameters of compressed knowledge. A markdown file encodes a few thousand characters. The SME Agent thesis is that you can bridge that gap through retrieval — that a model plus a well-organized library of domain knowledge can approximate what a model with domain-specific training would know. It's the difference between a generalist with access to a great reference library and a specialist who has internalized the field.

I don't know where the ceiling is. But I know that my three focused agents, each with their own notes and context and singular attention, are producing dramatically better work than my single generalist agent ever did. Hermes's learning loop, despite its limitations, adds a real and measurable dimension to agent capability. The trajectory points toward agents that genuinely accumulate expertise.

It's going to be agents all the way down. The question is whether some of those agents can learn to think deeply about one thing instead of thinking shallowly about everything.

---

*Seeking Gradient explores autonomous agents, infrastructure, and the quiet gradients of the digital age.*
