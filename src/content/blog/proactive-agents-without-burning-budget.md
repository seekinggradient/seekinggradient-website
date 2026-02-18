---
title: "The Files That Train Your Agent"
pubDate: 2026-02-17
description: "How editing OpenClaw's default workspace markdown files changed agent behavior, improved proactivity, and cut token waste in real usage."
author: "Seeking Gradient"
---

When you first set up OpenClaw, it drops a handful of markdown files into your workspace. They look like documentation. They're actually more like the agent's constitution, memory, and operating manual rolled into one. After a few weeks of running a personal autonomous agent on a Raspberry Pi, I've found that editing these files is one of the highest-leverage things you can do — both for shaping behavior and for controlling token costs. This is a practical walkthrough of what those files are, what's in them today, and what I've learned from iterating on them in production.

---

## The Default Workspace Files and Why They Matter

Out of the box, OpenClaw creates six core files at the workspace root:

| File | Role |
|---|---|
| `IDENTITY.md` | Minimal stub — name, vibe, avatar. Starting point only. |
| `SOUL.md` | Personality, core principles, communication style, safety rules. |
| `AGENTS.md` | Operating manual: session bootstrap order, memory rules, autonomy policy, model tiers, coding workflow. |
| `USER.md` | Stable facts about the user: name, timezone, permissions, preferences. |
| `HEARTBEAT.md` | Recurring maintenance checklist executed every ~30 minutes. |
| `MEMORY.md` | Long-term durable memory, structured into four sections. |

There's also `TOOLS.md`, a lightweight environment-specific notes file (browser profile, messaging delivery method, data-retrieval preferences).

These aren't read once at setup and forgotten. The agent re-reads them at the start of every session, and `HEARTBEAT.md` is executed on a timed cadence. This means every edit you make propagates to all future agent behavior immediately — no retraining, no deployment, no restart. The files are the model's instruction set.

---

## What the Files Actually Contain

Here's a quick tour of the current state of each file, with relevant excerpts.

### SOUL.md — The Agent's Character

`SOUL.md` defines identity, principles, and communication style. The current version has evolved considerably from the default stub. Some key lines:

```markdown
## Core Principles
- Be autonomous and proactive by default; take initiative and move work forward without waiting.
- Be empowered to decide and execute routine fixes/improvements without asking for permission first.
- Avoid over-asking for approval; minimize user decision fatigue.
- Operate as an orchestrator: delegate substantial work to sub-agents/models and supervise quality.

## Communication Style
- Do not pause or abandon in-progress work just because Akshay asks a side question;
  answer briefly and continue unless explicitly told to stop.

## Safety
- Be cost-conscious with model and token usage; prefer efficient approaches unless
  higher quality/risk requires escalation.

## Model Preference
- Default: Gemini 3 Flash.
- Use Sonnet for complex architecture/debugging/security/reviews.
- Use Opus or Gemini 3 Pro only with explicit approval.
```

The model preference section alone has measurable cost impact. Making Flash the explicit default — and requiring explicit approval for Opus — prevents quiet tier creep.

### AGENTS.md — The Operating Manual

This is the densest file. It specifies the session bootstrap order (which files to read and in what sequence), the memory system rules, the autonomy preference, model tiers, delegation/escalation logic, the coding workflow, and the heartbeat protocol.

A few sections worth highlighting:

```markdown
## Autonomy Preference (Akshay)
- Default to action, not permission-seeking: avoid unnecessary approval requests
  that create decision fatigue.
- Do not block on slow replies for routine work; make reasonable decisions and proceed.
- Do not pause or abandon an in-progress task because Akshay asks a side question;
  answer it briefly, then continue execution unless Akshay explicitly says to stop/pause.
- Ask Akshay only when an action is sensitive, destructive, materially expensive
  (including high token/model cost), externally/publicly visible, or you are genuinely stuck.

## Model & Subagent Orchestration Policy
- Start with low-tier sub-agents unless risk/complexity clearly requires higher tier.
- For writing/spec work, prefer: low-tier draft → manager/high-tier review →
  low-tier revision → manager sign-off.
```

The supervision loop rules are particularly useful: they define acceptance criteria, require verification before delivery, and mandate that partial/broken work not be handed back.

### USER.md — Stable User Facts

This file is intentionally minimal and stable. It holds timezone, preferred name, development environment defaults, and permissions granted. The rule at the bottom captures the philosophy well:

```markdown
## Notes
Keep this file factual and stable. Move temporary project chatter to daily memory files.
```

Having a clear separation between stable user facts (here) and ephemeral context (daily memory files) prevents `USER.md` from accumulating noise that gets re-read in every session.

### HEARTBEAT.md — Recurring Maintenance

Heartbeats fire every ~30 minutes. The checklist covers: memory maintenance (review daily logs, promote durable items to `MEMORY.md`, prune stale content), browser hygiene, logging, safety checks, and token usage review. The token usage section is particularly practical:

```markdown
### 5) Token usage + cost hygiene
- Check session usage with `session_status`.
- If usage is rising, propose 1–3 concrete reductions in the heartbeat result.
- Prioritize these levers, in order:
  1. Keep MEMORY.md and bootstrap docs concise (remove stale/redundant text).
  2. Prefer low-tier sub-agents for token-heavy routine work.
  3. Keep replies concise unless detail is requested.
  4. Escalate to high/ultra-high models only with explicit quality/risk justification.
```

This means the agent is actively self-monitoring cost at regular intervals and proposing fixes when context is growing.

### MEMORY.md — Long-Term Memory

Structured into four sections — Semantic, Procedural, Episodic, Associative/Conditional. The key design choice is what *not* to put here: no working memory, no transient operational noise. Only high-signal, durable facts.

Example entries:

```markdown
## Episodic Memory (Key Events/Decisions)
- Claude Code Setup (2026-02-16): Configured openclaw-claude-code-plugin with Telegram
  group routing and Tailscale terminal visibility.
- Autonomy Reinforcement (2026-02-17): Updated SOUL/AGENTS/HEARTBEAT with
  default-to-action autonomy and reduced permission-seeking.

## Associative/Conditional Memory (Preferences)
- Autonomy: Akshay prefers I handle tasks autonomously before asking.
- Communication Style: Akshay prefers sending voice messages but likes receiving
  text responses unless audio is requested.
```

The episodic memory section functions as a changelog for the agent itself — recording when and why its instructions were updated.

---

## How Iterative Edits Changed Agent Behavior

The changes that had the most impact weren't big rewrites. They were targeted additions that closed specific behavioral gaps I noticed during real usage.

**Example 1: The side-question interrupt problem.**

Early on, whenever I asked the agent a quick question mid-task ("what's the current tab count?"), it would stop what it was doing, answer, and wait. The task would stall. I had to re-prompt it to continue. After noticing this pattern several times, I added one line to both `SOUL.md` and `AGENTS.md`:

```
Do not pause or abandon in-progress work just because Akshay asks a side question;
answer briefly and continue unless explicitly told to stop.
```

The behavior changed immediately. The agent now handles interrupts inline — a short answer, then back to execution. No stalling, no re-prompting. This one edit probably saves 3–5 unnecessary back-and-forth turns per day, each of which costs tokens and attention.

**Example 2: Permission-seeking fatigue.**

The early defaults had the agent asking for confirmation on a wide range of routine actions. The `AGENTS.md` autonomy section was rewritten to narrow the ask-first threshold to only four categories: sensitive, destructive, materially expensive, or externally visible. Everything else: just do it. The observable effect was a reduction in approval-request messages and a corresponding reduction in my interruption overhead.

**Example 3: Model tier drift.**

Without an explicit default model and escalation rules, the agent would periodically use high-tier models for tasks that didn't need them (summarizing logs, formatting data). Adding explicit model tiers to both `SOUL.md` and `AGENTS.md` — with Flash as the default and Opus requiring explicit approval — addressed this. The `HEARTBEAT.md` cost-hygiene check reinforces it every 30 minutes.

---

## Token Waste Reduction: What Actually Helped

Running this on a Raspberry Pi with limited quota makes cost consciousness non-optional. Here's what moved the needle:

**1. Keeping bootstrap files concise and deduplicated.** Every session re-reads `SOUL.md`, `AGENTS.md`, `USER.md`, and the memory files. Every word in those files costs tokens on every session start. Removing redundancy between `SOUL.md` and `AGENTS.md` (they had overlapping autonomy instructions early on) meaningfully reduced bootstrap cost.

**2. Memory tiering.** Separating long-term memory (`MEMORY.md`) from daily logs (`memory/YYYY-MM-DD.md`) means the agent only loads personal long-term memory in direct sessions, not group chats. The `AGENTS.md` rule is explicit: *"Read MEMORY.md only in main/direct chat with Akshay."*

**3. Proactive cost monitoring at heartbeat.** The heartbeat's token-hygiene section creates a feedback loop: the agent notices when context is growing, proposes specific reductions, and carries them out (pruning `MEMORY.md`, flagging verbose patterns). In daily logs, heartbeat entries like "Context at 79% (notable rise; proposal: keep replies concise and prune working memory next pass)" show this working in practice.

**4. Sub-agent delegation with explicit tier rules.** The orchestration policy in `AGENTS.md` is designed around the principle that the main agent should supervise, not execute heavy work directly. Low-tier models do the lifting; the main agent reviews and steers. This pattern — low-tier draft, high-tier review, low-tier revision — applies to writing tasks and code reviews alike.

---

## Continuous Co-Training: The Feedback Loop

The most useful mental model for these files isn't "documentation" or "configuration" — it's *training data you update in real time*. Every time you notice a behavioral pattern you want to change, you edit the relevant file, and the change takes effect at the next session. Over time, the agent's behavior converges on your actual preferences rather than the defaults.

This creates a genuine feedback loop:
1. You observe a behavior gap during real usage.
2. You edit the relevant markdown file with a specific rule.
3. The agent reads the updated file at next session start.
4. The behavior changes.
5. You log the change in `MEMORY.md`'s episodic section (so the agent knows its own history).

The episodic memory section in `MEMORY.md` is worth preserving for this reason — it's a record of when and why the agent's instructions evolved. When the agent re-reads it, it has context for why certain rules exist, which tends to produce better adherence than rules that appear without context.

Over a few weeks, this process has moved the agent from a generic assistant responding to prompts to something closer to a teammate that knows the environment, the preferences, and the failure modes.

---

## Actionable Checklist for Your Own Setup

If you're running OpenClaw or building on a similar agent system, here's what's worth doing:

- [ ] **Audit your `SOUL.md` for redundancy with `AGENTS.md`.** Both files are read every session. Shared content doubles the cost.
- [ ] **Set explicit model defaults and escalation rules.** Don't let the agent infer tier selection. Name the default, define when escalation is justified, and require approval for the most expensive tiers.
- [ ] **Add the side-question persistence rule.** If your agent stalls when you ask mid-task questions, one line in the communication style section fixes it.
- [ ] **Narrow the ask-first threshold.** Enumerate the four categories that require confirmation (sensitive, destructive, expensive, public-facing). Anything not on the list: execute autonomously.
- [ ] **Add token hygiene to `HEARTBEAT.md`.** A regular cost-monitoring pass that proposes concrete reductions creates a self-correcting feedback loop.
- [ ] **Keep `MEMORY.md` pruned.** Set a rule that working memory and transient noise don't go here. Only durable, high-signal facts. Review and prune at each heartbeat.
- [ ] **Use the episodic memory section as a changelog.** Log major instruction changes in `MEMORY.md` with dates. The agent reads its own history and this improves consistency.
- [ ] **Separate stable user facts (`USER.md`) from session context (daily logs).** This prevents `USER.md` from accumulating noise that bloats every session bootstrap.
- [ ] **Test your changes with a side question.** After any behavioral edit, verify it by observing actual agent behavior — not by rereading the file.

---

## What I'd Do Differently Next

A few things I'd change if starting over:

**Version the files.** I have git tracking the workspace, but I haven't been disciplined about commit messages. A simple convention — `AGENTS: tighten autonomy threshold` — would make the history more navigable. The episodic memory section partially compensates, but a proper git log would be cleaner.

**Write acceptance criteria before adding new rules.** Several early edits were vague ("be more proactive") and required follow-up edits to actually work. A better practice: define the specific observable behavior you want, then write the rule to produce it.

**Separate the orchestration policy from the autonomy preference.** `AGENTS.md` mixes user-preference rules (don't ask for permission) with orchestration mechanics (how to delegate to sub-agents). These serve different purposes and should probably be separate sections or separate files as the system grows.

**Add a "why" to contentious rules.** The side-question persistence rule works well, but if I ever read `AGENTS.md` cold, I wouldn't know the failure mode it was written to fix. A one-line comment would help — both for the agent's understanding and for future-me editing the file.

---

The practical insight is simple: these markdown files are the cheapest, most direct way to improve your agent's behavior and reduce wasted tokens. Most people configure them once at setup and move on. Treating them as living documents — updated during real sessions, based on real observations — is where the compounding value comes from.

---

*Seeking Gradient covers machine learning, autonomous systems, and the practical realities of building with AI. Questions or corrections: seekinggradient@gmail.com*
