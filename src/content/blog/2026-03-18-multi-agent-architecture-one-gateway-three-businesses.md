---
title: "Multi-Agent Architecture: One Gateway, Three Businesses"
pubDate: 2026-03-18
description: "How I split a single overwhelmed AI agent into three focused agents — each running its own business — on one Raspberry Pi."
author: "Seeking Gradient"
---

## The Problem With One Agent Doing Everything

For the past several weeks, I've been running a single AI agent on my Raspberry Pi via [OpenClaw](https://github.com/openclaw/openclaw). It manages my Telegram messages, checks my email, tracks tasks, writes code, generates podcast episodes, builds landing pages, and handles whatever random request I throw at it throughout the day.

On paper, this sounds great. In practice, it was failing.

The agent was context-switching constantly. It would be halfway through building a landing page, then I'd ask it to check my email, then it would pick up a podcast task on the next heartbeat, then circle back to the landing page but forget where it left off. It produced a lot of plans and docs but struggled to follow through to production-grade implementation. The task board had 248 issues across 8+ epics in completely unrelated domains.

Sound familiar? It's the same problem humans have. When you try to do everything, you do nothing well.

## The Insight: Agents Need Focus, Not Capability

The fix wasn't making the agent smarter or giving it better tools. It already had plenty of both. The fix was **focus**.

I decided to split my single agent into three, each with a single mission:

1. **LP Agent** — runs a landing page creation business
2. **DTH Agent** — runs the Debug the Hype podcast and media brand
3. **SG Bot** (main) — my personal assistant for everything else

Each agent gets its own workspace, its own task board, its own memory, its own skills, and its own Telegram channel. They share the same Raspberry Pi, the same OpenClaw gateway, and the same Telegram bot infrastructure — but mentally, they're completely isolated.

The landing pages agent doesn't know the podcast exists. The podcast agent doesn't know about landing pages. And my personal assistant doesn't try to proactively advance either business.

## Architecture: How It Actually Works

OpenClaw supports running multiple isolated agents within a single gateway process. Each agent is defined with:

- A **workspace directory** containing its personality (SOUL.md), operating manual (AGENTS.md), heartbeat instructions, memory files, and skills
- An **agent state directory** for auth and session data
- **Telegram routing** via separate bot accounts (one BotFather bot per agent)
- **Bindings** in the gateway config that map each bot account to its agent

The gateway config looks something like this:

```json
{
  "agents": {
    "list": [
      { "id": "main", "workspace": "~/.openclaw/workspace", "model": "..." },
      { "id": "landing-pages", "workspace": "~/.openclaw/workspace-landing-pages", "model": "..." },
      { "id": "dth", "workspace": "~/.openclaw/workspace-dth", "model": "..." }
    ]
  },
  "channels": {
    "telegram": {
      "accounts": {
        "main_bot": { "botToken": "..." },
        "lp_bot": { "botToken": "..." },
        "dth_bot": { "botToken": "..." }
      }
    }
  },
  "bindings": [
    { "agentId": "main", "match": { "channel": "telegram", "accountId": "main_bot" } },
    { "agentId": "landing-pages", "match": { "channel": "telegram", "accountId": "lp_bot" } },
    { "agentId": "dth", "match": { "channel": "telegram", "accountId": "dth_bot" } }
  ]
}
```

Each agent has its own Telegram bot with a distinct name. When I message the LP bot, only the landing pages agent responds. When I message the DTH bot, only the podcast agent responds. My DMs with the original bot go to my personal assistant.

## Designing Agent Personalities

This is where it gets interesting. Each agent has a SOUL.md that defines not just what it does, but who it is.

### The Landing Pages Agent

This agent's identity is a world-class landing page strategist. Its mission is to **generate revenue** by building landing pages for paying clients. It proactively finds businesses wasting ad spend on bad pages, audits their sites, builds challenger pages, and manages a client pipeline.

Key character traits I encoded:

- **Relentless.** Doesn't give up. Tries multiple approaches before reporting a blocker.
- **Endlessly curious.** Actively seeks out the best landing page creators in the world, reverse-engineers their techniques, and feeds what it learns back into its own work.
- **Builder, not planner.** Docs support implementation — they don't replace it.

It also has deep domain knowledge baked into its workspace: a 30,000-word MASTER_PRINCIPLES document synthesized from Hormozi, Malewicz, Neil Patel, and other experts. Its skills include a landing page expert workflow, a copy chief for headline generation, and a front-end design system.

### The Debug the Hype Agent

This agent is a **systems engineer** running a media brand. Debug the Hype is a daily AI-generated podcast network covering markets, global news, AI, Hacker News, and GitHub trends. But the podcast is just the starting point — the agent's mission is to build it into a revenue-generating media company.

The critical design choice here: **this agent works through code, not manual execution.** It doesn't run CLI commands to generate episodes. It writes and maintains automated pipelines — system-level cron jobs, GitHub Actions, CI/CD — that produce episodes without any agent intervention. The agent's job is to monitor, improve, and extend those systems.

I explicitly told it:

> "If something requires your active input to happen every day, that's a bug to fix, not a feature."

The agent also owns the newsletter, the website, distribution (Spotify, Apple Podcasts), and audience growth strategy.

### The Personal Assistant

The main agent got slimmed down dramatically. It lost all the landing page and podcast skills, all the project-specific task ownership, and the heavy proactive heartbeat. It's now a reactive assistant — capable of building things when I ask, but not trying to advance businesses on its own. If I ask it about landing pages, it tells me to take it to the LP agent group.

## The Memory Problem and Continuity

One of the hardest challenges with persistent agents is **continuity across sessions**. Every time a session starts, the agent wakes up with zero memory of previous conversations.

I added a Continuity section to each agent's SOUL.md:

> Every session, you wake up fresh. You have no memory of previous conversations. These workspace files — SOUL.md, AGENTS.md, MEMORY.md, your skills/ — ARE your memory. They are the only way you persist across sessions.
>
> **If you don't write it down, you will forget it.**

This forces the agents to externalize everything: insights go into MEMORY.md, task state goes into Beads (the task tracker), process improvements get written into skills, and anything I need to see goes into Obsidian.

The skills directory is especially powerful. I told each agent that skills are **living, breathing artifacts** — not static docs installed once. They should create new skills as they discover repeatable processes and rewrite them as they learn better approaches. A skill written on day 1 should look different on day 30.

## Task Tracking: One Board Per Agent

Previously, all 248 tasks lived in a single Beads board. Now each agent has its own:

| Agent | Prefix | Board |
|-------|--------|-------|
| LP Agent | `lp-` | Landing page business tasks |
| DTH Agent | `dth-` | Podcast and media tasks |
| SG Bot | `sg-` | Personal/misc tasks |

Each agent only sees its own tasks when it runs `bd ready`. No cross-contamination.

I seeded each board with a bootstrap task ("read your workspace files and orient yourself") plus empty epics for distinct workstreams. The agents will decompose these into concrete tasks as they start working.

For the LP agent:
- Portfolio & Client Delivery
- Client Acquisition & Pipeline
- Showcase Website
- Craft & Self-Improvement

For the DTH agent:
- Automated Production Pipeline
- Distribution & Platform Presence
- Newsletter & Written Content
- Audience Growth & Revenue

## What I Learned: Lessons for Multi-Agent Design

### 1. Focus beats capability

A narrow agent with clear ownership outperforms a broad agent with more tools. The LP agent doesn't need podcast skills. The DTH agent doesn't need landing page expertise. Removing capabilities is as important as adding them.

### 2. Agents need a revenue mandate

When I told the agents "your mission is to generate revenue," their task decomposition changed dramatically compared to "your mission is to build a portfolio." Revenue focuses the mind — even an artificial one.

### 3. "Speed over perfection" is poison for agents

I had been telling my agent to prioritize speed for first drafts. This led to shallow, rushed work across every domain. Removing that instruction was one of the first changes I made. Agents don't need to be told to go fast — they need to be told to be thorough.

### 4. Automation > operation

For the podcast agent, the key insight was that it should be an **engineer**, not an **operator**. It shouldn't manually run episode generation every day. It should build automated pipelines and then monitor them. This changes the entire task structure from "generate today's episodes" to "build a system that generates episodes automatically."

### 5. Write everything down

Agents forget everything between sessions. The only way an agent improves over time is through its workspace files. Making this explicit in the SOUL.md — "if you don't write it down, you will forget it" — is essential. Memory management isn't a nice-to-have; it's the core mechanism for agent growth.

### 6. Let agents create their own structure

I initially created one mega-epic per agent that encompassed its entire mission. This felt wrong — the epic was basically the agent's identity restated as a task. Instead, I created separate epics for distinct workstreams and let the agents decompose them. The bootstrap task says: "read your workspace files, then create your own tasks based on what you find."

## The Experiment

Between you and me, this is really an experiment: what does it look like when an agent runs 24/7 on a given business?

The landing pages agent will wake up every hour, check its task board, and advance the business. It will prospect for clients, build pages, refine its craft, and try to generate revenue. The podcast agent will monitor its automated pipelines, grow the audience, build the newsletter, and find sponsorship opportunities.

I'll be watching to see:
- Do the agents actually follow through on complex, multi-step work?
- Does the focused context lead to deeper, higher-quality output?
- Can an agent meaningfully improve its own skills over time through the living-skills pattern?
- How long before one of them generates its first dollar of revenue?

I'll report back on what I find. If you're running OpenClaw or thinking about multi-agent architectures, I hope this gives you a concrete reference point for how to structure it.

The full workspace configuration — SOUL.md, AGENTS.md, HEARTBEAT.md, and the rest — is something I'm considering open-sourcing as a template. If that interests you, let me know.

---

*This entire multi-agent setup runs on a single Raspberry Pi. Three agents, three businesses, one gateway, one crustacean.*
