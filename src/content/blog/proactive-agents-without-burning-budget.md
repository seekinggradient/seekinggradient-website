---
title: "The Files That Train Your Agent"
pubDate: 2026-02-17
description: "How editing OpenClaw's default workspace markdown files changed agent behavior, improved proactivity, and cut token waste in real usage."
author: "Seeking Gradient"
---

When you first set up OpenClaw, it drops a handful of markdown files into your workspace. They look like documentation. They're actually more like the agent's constitution, memory, and operating manual rolled into one.

After a few weeks of running a personal autonomous agent on a Raspberry Pi, I've found that editing these files is one of the highest-leverage things you can do — both for shaping behavior and for controlling token costs.

This is a practical walkthrough of what those files are, what's in mine today, and what changed when I started iterating on them in production.

## The default workspace files and why they matter

Out of the box, OpenClaw creates a core set of files at the workspace root:

| File | Role |
|---|---|
| `IDENTITY.md` | Minimal stub: name, vibe, avatar. |
| `SOUL.md` | Personality, principles, communication style, safety rules. |
| `AGENTS.md` | Operating manual: bootstrap order, autonomy policy, model tiers, workflows. |
| `USER.md` | Stable user facts (preferences, permissions, constraints). |
| `HEARTBEAT.md` | Recurring maintenance loop (~every 30m). |
| `MEMORY.md` | Durable long-term memory. |
| `TOOLS.md` | Local environment notes (profiles, delivery details, defaults). |

These are not “set and forget” docs. The agent re-reads them continuously across sessions, and heartbeat executes on a cadence. Every edit propagates into behavior without retraining or redeploying.

That makes these files your real control surface.

## What my files contain today

### `SOUL.md` (behavior baseline)

This is where I push high-level behavior preferences:

```md
- Be autonomous and proactive by default; take initiative and move work forward without waiting.
- Avoid over-asking for approval; minimize user decision fatigue.
- Operate as an orchestrator: delegate substantial work to sub-agents/models and supervise quality.
```

Also communication style and cost behavior:

```md
- Prefer concise answers; expand only when useful.
- Be cost-conscious with model and token usage; prefer efficient approaches unless higher quality/risk requires escalation.
```

### `AGENTS.md` (execution rules)

This file holds the operational policy. For me, the most important section is autonomy boundaries:

```md
- Default to action, not permission-seeking.
- Do not block on slow replies for routine work.
- Ask only for sensitive, destructive, materially expensive, or externally visible actions.
```

It also includes model-tiering and delegation rules (low-tier first pass, escalation only when needed), which helps keep routine work cheap.

### `USER.md` (stable facts only)

This should stay concise and factual. Mine includes fixed preferences like timezone, development defaults, and permissions granted.

Key rule:

```md
Keep this file factual and stable. Move temporary project chatter to daily memory files.
```

### `HEARTBEAT.md` (maintenance + self-correction)

Heartbeat turned out to be more than a status ping. It became a control loop:

- memory maintenance
- browser hygiene
- token usage checks
- proactive reflection and project execution

The token section matters most for cost control:

```md
- Check session usage with session_status.
- If usage is rising, propose 1–3 concrete reductions.
```

### `MEMORY.md` (durable memory only)

I split memory into four types:

- Semantic (stable facts)
- Procedural (workflows)
- Episodic (key events/decisions)
- Associative/Conditional (preferences/triggers)

This reduced retrieval noise and made behavior more consistent.

### `TODO.md` (execution spine)

This gives the agent a durable task surface across sessions:

- active priorities
- current status
- next action
- blockers

Without this, “proactive” often decays into scattered starts.

## The change that made proactivity feel real

One behavior bug was recurring: if I asked a side question during an in-progress task, the agent would answer and then stop the main task.

I added this line to both `SOUL.md` and `AGENTS.md`:

```md
Do not pause or abandon an in-progress task because Akshay asks a side question; answer briefly, then continue unless explicitly told to stop/pause.
```

That one instruction changed execution quality immediately.

Before: frequent stalls and re-prompts.
After: brief side-answer, then automatic continuation.

It sounds small, but it removed a lot of coordination friction and turn waste.

## How modifying these files reduced token waste

The biggest savings came from structure, not from fancy prompts.

### 1) Keep bootstrap docs concise

`SOUL.md`, `AGENTS.md`, `USER.md`, and memory are repeatedly loaded. Redundant text there becomes recurring token tax. Pruning duplication reduced context noise.

### 2) Separate durable vs transient memory

`MEMORY.md` stays durable. Daily logs go into `memory/YYYY-MM-DD.md`. That prevents transient noise from bloating every future session.

### 3) Enforce model-tier routing

Explicit low-tier-first routing in `AGENTS.md` prevented expensive-model drift for routine tasks.

### 4) Make heartbeat enforce cost hygiene

A recurring usage check catches context growth early and prompts corrective action before things spiral.

## Continuous co-training in practice

The key shift is treating these files as a living training interface.

Loop:

1. Observe behavior during real work.
2. Add/adjust a concrete instruction in the right file.
3. Verify behavior change.
4. Keep what works, remove what doesn’t.
5. Log durable decisions in `MEMORY.md`.

This turns the assistant from “generic and capable” into “aligned to how I actually work.”

You’re not retraining a model. You’re tightening the operating system around it.

## Actionable checklist

If you’re running OpenClaw (or any agent stack with persistent policy files), do this:

- [ ] Audit `SOUL.md` and `AGENTS.md` for overlap; dedupe aggressively.
- [ ] Define explicit autonomy boundaries for when to ask vs act.
- [ ] Add the side-question continuation rule.
- [ ] Set explicit model tier defaults and escalation rules.
- [ ] Keep `USER.md` factual and stable.
- [ ] Keep `MEMORY.md` durable-only; move transient notes to daily files.
- [ ] Add token-hygiene checks to heartbeat.
- [ ] Maintain `TODO.md` as a durable execution surface.
- [ ] Verify behavior changes with real tasks, not just by reading files.

## What I’d do differently next

1. **Version file edits more rigorously.** Better commit discipline would make behavior changes easier to trace.
2. **Attach acceptance criteria to each new rule.** “Be proactive” is vague; observable outcomes are better.
3. **Further separate preference policy from orchestration policy.** `AGENTS.md` can become too dense without clear boundaries.
4. **Add rationale comments for high-impact rules.** Future edits are safer when the “why” is preserved.

The core lesson: these markdown files are not setup artifacts. They are the cheapest, highest-leverage way to tune both behavior and cost.

If you want more proactivity *and* lower waste, start by rewriting your workspace files — then keep rewriting them as you work.
