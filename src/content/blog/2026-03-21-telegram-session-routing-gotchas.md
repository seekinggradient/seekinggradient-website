---
title: "The Telegram Session Routing Bug That Had My Agent Arguing With Itself"
pubDate: 2026-03-21
description: "Group chats, DMs, and heartbeats all create separate sessions inside the same agent. When you don't know that, things break in confusing ways."
author: "Seeking Gradient"
---

## Why I'm Writing This

After two months running OpenClaw agents on Telegram, I've hit more message routing issues than I can count. Messages landing in the wrong session, heartbeats running without conversation context, cron jobs delivering to stale group chats. Most of them were small annoyances I worked around without fully understanding.

Then I hit one that cost me an hour of debugging and had my agent actively undoing my instructions. That one forced me to actually understand how OpenClaw session routing works under the hood. This post is what I learned: how sessions map to Telegram surfaces, where automated messages land, and the gotchas that will bite you if you're running heartbeats, cron jobs, or [Claude Code sessions](/blog/2026-03-21-claude-code-wakes-up-my-agent) through a messaging platform.

## The Core Problem: Session Isolation

Every OpenClaw agent conversation lives in a **session** — a persistent context window with its own message history. Different Telegram surfaces create different sessions:

- `agent:dth:main` — DMs and system messages
- `agent:dth:telegram:group:<id>` — a group chat
- `agent:dth:telegram:group:<id>:topic:<n>` — a forum topic

These are completely isolated. The group chat has no idea what was said in DMs. DMs have no idea what was said in the group chat. Same agent, same bot — different realities.

The problem: **automated messages don't always land where you expect.**

| Event | Where it lands |
|-------|---------------|
| You message in a group chat | Group chat session |
| You DM the bot | Main session |
| Heartbeat fires | Main session |
| Claude Code wake message | Main session (always) |
| Cron job | Wherever `sessionKey` points |

## What Went Wrong

I was chatting with my agent in a **group chat**, telling it to change the podcast pipeline. The agent launched a Claude Code session from the group chat. So far, so good.

But when Claude Code needed input, the wake message went to the **main session** — which had never seen my instructions. The main session had its own stale context where it had earlier approved a different approach. **So it told Claude Code to revert my changes.**

Two sessions were fighting over the same Claude Code process. Every time the group chat forwarded my instructions, the main session woke up seconds later and overrode them. I killed the session, started a fresh one, and the main session immediately told the new one to stop too.

I only figured it out by reading the raw session logs and tracing which session sent each `claude_respond` call. The group chat was doing exactly what I asked. The main session was undoing it — confidently, with full justification based on its own (outdated) context.

## The Fix: Use DMs

When you DM the bot, your messages land in `agent:dth:main` — the same session that receives wake messages and heartbeats. One session, one context, no split.

I updated three things:

1. **Heartbeat delivery** — pointed `to` at my Telegram user ID (DM) instead of the group chat ID
2. **Claude Code plugin routing** — updated `agentChannels` to deliver notifications to my DM
3. **Cron job session keys** — changed `sessionKey` to `agent:dth:main` and delivery to my DM

After `openclaw gateway restart`, everything converged into one session.

## Why This Matters Beyond Claude Code

**Heartbeats lose context.** If your conversation is in a group chat but heartbeats run in main, the heartbeat has no idea what you've been working on. Mine reported "all healthy" while the group chat session knew about an ongoing pipeline issue.

**Cron jobs land in the wrong place.** A strategic review cron that's supposed to reflect on recent work can't do that if it runs in a session with no recent conversation history.

**Group IDs are unstable.** Telegram changes group IDs when you convert to a supergroup, enable forum topics, or disable them. I had a stale group ID in my heartbeat config that worked via Telegram's redirect — until it didn't. DM user IDs never change.

## The Real Fix (For Plugin Developers)

DMs are a workaround. The real issue is that the Claude Code plugin wakes agents with `--agent` (always routes to main) instead of `--session-id` (routes to the originating session). The plugin has `ctx.sessionKey` available at launch time but doesn't store it. That's a small fix in [the plugin source](https://github.com/alizarion/openclaw-claude-code-plugin) — until it lands, DMs are reliable.

## The Key Takeaway

It doesn't matter whether you use DMs or group chats — what matters is that **everything points to the same place.** Your conversation, heartbeats, cron jobs, and Claude Code wake messages all need to land in the same session. If there's a mismatch — you're chatting in a group but heartbeats run in main, or Claude Code wakes go to main while you're in a forum topic — your agent is operating with split context and will make bad decisions.

Pick one surface. Route everything there. Verify it.

## Quick Checklist

- **Pick DMs or a group chat — then make everything match.** Heartbeat `to`, cron `sessionKey` and `delivery.to`, and `agentChannels` should all point to the same Telegram destination.
- **Search your config for mismatches** — check `openclaw.json` and `cron/jobs.json` for any IDs that don't match your chosen surface
- **If an agent seems to ignore you**, check which session is actually handling the automated responses — it's probably a different one than where you're chatting

---

The full story of how Claude Code and my OpenClaw agents collaborate is in the [companion post](/blog/2026-03-21-claude-code-wakes-up-my-agent).

---

*Same bot, same agent, different session, different reality. Now you know.*
