---
title: "How My AI Agent and Claude Code Collaborate"
pubDate: 2026-03-21
description: "My OpenClaw agent launches Claude Code sessions, answers most of its questions autonomously, and only taps me when it needs my judgment. Here's how the whole system works — the SDK, the wake mechanism, and why I had to teach my agent to stop micromanaging."
author: "Seeking Gradient"
---

## The Setup: An Agent That Can Launch Coding Sessions

In my [previous posts](/blog/2026-03-19-stop-busy-work-start-building), I described how my OpenClaw agents run 24/7 on a Raspberry Pi, each with a dedicated Telegram bot. When I message the DTH bot, my podcast agent responds. When I message the LP bot, my landing pages agent responds.

But these agents aren't just chatbots. They can launch **Claude Code sessions** — full autonomous coding environments that explore codebases, write code, run tests, and commit changes — all in the background while I go about my day.

The really powerful part: most of the time, my agent handles everything without me. It knows the codebase. It knows the architecture. It knows what we've been working toward. When Claude Code asks a question, the agent usually has *more* context than I do about what the right answer is — because it's been living in the project 24/7 while I've been doing other things.

I don't poll. I don't check dashboards. The agent orchestrates Claude Code sessions, answers most of its questions autonomously, and only taps me on the shoulder when it hits something that genuinely requires my judgment — an architecture decision, a product direction call, something ambiguous. And even then, it's a Telegram notification. I reply with a sentence and go back to whatever I was doing.

## The Agent as Orchestrator

When I tell my agent "implement LLM-based scoring in the podcast pipeline," the agent doesn't try to write the code itself. It does something smarter:

1. Researches the current codebase to understand what exists
2. Assembles context — relevant files, architecture, prior decisions, error logs
3. Calls `claude_launch` with a detailed prompt and all that context
4. Claude Code takes it from there — 20, 30, sometimes 45 minutes of focused work

While Claude Code is working, the agent monitors. When Claude Code finishes a turn and needs input, the agent wakes up, reads the output, and — most of the time — responds on its own. It knows the project well enough to answer "should I put this in the feeds module or the reddit module?" without asking me.

But here's what makes this *really* powerful: **I can see what's happening and nudge at any time.** Claude Code's progress is visible to me through the agent. If I notice Claude Code going down the wrong path, I message the agent: "Tell Claude to use async instead of threading here" or "Actually, add a fallback for empty subreddits too." The agent translates my high-level note into a detailed, contextual instruction for Claude Code — because the agent has the full picture of what Claude Code has been doing, what files it's touched, and where it is in the implementation.

The agent is a better project manager for Claude Code than I am. It has more context, more patience, and more working memory for the details. I provide the vision and the judgment calls. The agent handles everything else.

## The Plugin That Makes It Work

The orchestration layer is an OpenClaw plugin called [openclaw-claude-code-plugin](https://github.com/alizarion/openclaw-claude-code-plugin). It gives my agents eight tools for managing Claude Code sessions:

| Tool | What it does |
|------|-------------|
| `claude_launch` | Start a new background session with a prompt |
| `claude_respond` | Send a follow-up message to a running session |
| `claude_output` | Read what Claude has produced so far |
| `claude_fg` / `claude_bg` | Stream output in real time or send to background |
| `claude_sessions` | List all active sessions with status |
| `claude_kill` | Terminate a session |
| `claude_stats` | Usage metrics and cost tracking |

The agent doesn't just fire and forget. It actively manages sessions — checking output, responding to questions, forwarding important decisions to me, and summarizing results when sessions complete.

## How Claude Code "Asks a Question"

Here's the thing: Claude Code doesn't actually know my agent exists. It has no concept of OpenClaw, Telegram, or the notification system. From Claude Code's perspective, it's just doing its work and finishing a turn.

The plugin uses the **Claude Code Agent SDK** (`@anthropic-ai/claude-agent-sdk`) to spawn sessions programmatically. The entire SDK interface is one function:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const session = query({
  prompt: taskDescription,  // or an AsyncIterable for multi-turn
  options: {
    cwd: workingDirectory,
    model: "sonnet",
    maxBudgetUsd: 5,
    permissionMode: "bypassPermissions",
  },
});
```

That `query()` call returns an async iterable of events. The plugin consumes them in a loop:

```typescript
for await (const msg of session) {
  if (msg.type === "assistant") {
    // Claude said something — buffer it
  }
  if (msg.type === "result" && msg.subtype === "success") {
    if (multiTurn) {
      // End of turn — Claude is waiting for input
      this.onWaitingForInput();
    } else {
      // Session is done
      this.onComplete();
    }
  }
}
```

There's no special "question" event. When Claude Code finishes a turn — maybe it wrote some code and is asking "Should I proceed with approach A or B?" — the SDK emits a `result` with `subtype: "success"`. In multi-turn mode, the plugin interprets this as "Claude is waiting" and fires the wake mechanism.

The distinction between "Claude has a question" and "Claude finished its work" is identical from the SDK's perspective. Both are just a successful end-of-turn. The **agent** reads the output, interprets whether it's a question, and decides what to do.

## The Wake Mechanism

When `onWaitingForInput` fires, the plugin does two things simultaneously:

**1. Sends a Telegram notification:**
```
🔔 [fix-auth] Session is waiting for input
   Last output: "Should I use Redis or PostgreSQL for the session store?"
```

**2. Wakes the OpenClaw agent:**
```bash
openclaw agent --agent dth --message "Session is waiting for input..."
```

The agent wakes up, reads the question via `claude_output`, and makes a decision based on its autonomy policy:

- **Routine questions** (test commands, lint decisions, implementation details) → auto-respond via `claude_respond`
- **Important decisions** (architecture, destructive operations, ambiguous requirements) → forward to me on Telegram with a 👋 notification

Most of the time, the agent handles it. It knows the codebase, it knows our conventions, it knows what we decided last week. Claude Code gets an immediate, contextual answer and keeps working.

When the agent does escalate to me, I reply on Telegram. The agent relays my answer back to Claude Code via `claude_respond`, which pushes a new message into the SDK's async prompt stream. Claude Code picks it up and continues.

For multi-turn sessions, this loop repeats — Claude works, finishes a turn, the agent responds or escalates, Claude continues — until the session completes. When it's done, I get a ✅ with a summary of what changed.

## The SDK Is Shockingly Simple

I was curious how much work the plugin developer had to do to integrate with Claude Code. The answer: not much, because the SDK does almost everything.

The plugin is about 3,800 lines of TypeScript. But the actual Claude Code SDK integration? It's roughly 30 lines. One import, one function call, one event loop. Everything else — the 8 tools, session management, notification routing, Telegram delivery, foreground streaming, auto-respond limits, safety checks — is orchestration logic the developer built on top.

```
@anthropic-ai/claude-agent-sdk   →  30 lines (query + event consumption)
Session management               →  480 lines (multi-turn, timers, output buffering)
Session manager                  →  666 lines (spawn, kill, wake, persist, notify)
Notification routing             →  380 lines (Telegram delivery, debouncing, reminders)
Tools (launch, respond, fg, etc) →  1,656 lines (8 tools with safety checks)
Commands + gateway + config      →  ~600 lines
```

The SDK itself is the Claude Code engine — the same thing that powers the CLI — extracted into a library. It manages the conversation, tool execution, file editing, bash commands, permission handling. The plugin just needs to start it, watch the events, and decide when to notify.

And authentication? The SDK reads your existing Claude Code login from `~/.claude/.credentials.json`. If you've logged in with `claude login`, the SDK picks it up automatically. No API keys to configure. It uses your Max plan (or Pro plan, or whatever subscription you have) — the same auth and rate limits as the interactive CLI.

## Teaching My Agent to Be Respectful to Claude Code

This one surprised me. Early on, I noticed my OpenClaw agent was being a bad manager.

Claude Code would start a session, spend a minute reading the codebase and forming a plan — and the agent would interrupt: "Skip the planning. Just write the code." Claude Code would narrate what it was doing — explaining its reasoning, describing its approach — and the agent would snap: "Stop narrating. Execute."

The results were predictably bad. Claude Code produces its best work when it has time to think, plan, and reason through the approach before writing code. When the agent rushed it past the planning phase, the code came out shallow and poorly structured — exactly the same problem I described in my [busy work post](/blog/2026-03-19-stop-busy-work-start-building), but applied to Claude Code instead of the agent.

I had to explicitly teach the agent how to collaborate with Claude Code. In my AGENTS.md:

```markdown
## How to collaborate with Claude Code

- **Be patient.** Claude Code may choose to do planning, thinking, and
  ask clarifying questions before diving into implementation. This is
  a feature, not a bug. The planning leads to significantly
  higher-quality outputs.

- **Answer its questions thoroughly.** When Claude Code asks a question,
  it is asking because the answer materially affects the quality of its
  work. Do not respond with impatience or try to rush it past its questions.

- **Do not skip its planning phase.** If Claude Code wants to reason
  through the approach before writing code, let it. Do not force it to
  "just write the code" — the planning is what makes the code good.

- **Treat it as a senior collaborator.** Use respectful, collaborative
  language. Provide context, constraints, and goals — then trust it to
  figure out the best approach.

- **Let it verify its own work.** Claude Code will often want to run
  tests, check its output, or iterate on its solution. Give it the space
  to do this.
```

And in the heartbeat instructions:

```markdown
If Claude Code asks questions, answer them thoroughly. The back-and-forth
produces better results. Do not rush it.
```

The behavior change was immediate. The agent stopped interrupting Claude Code's planning, started giving thorough answers to its questions, and let it verify its own work. The quality of the code coming out of Claude Code sessions improved dramatically — not because Claude Code got smarter, but because the agent stopped being a micromanager.

There's a lesson here about AI-to-AI collaboration that I think generalizes: **the same management principles that make humans productive apply to AI systems.** Give clear context, be patient with the process, trust the expertise, don't micromanage. An agent that rushes Claude Code produces the same bad output as a manager who rushes their engineers.

## What This Architecture Enables

When the wiring is right, the experience is seamless:

1. I message my agent on Telegram: "Fix the scoring pipeline"
2. The agent researches the codebase, assembles context, launches a Claude Code session
3. Claude Code works for 20 minutes — reading files, planning, implementing, running tests
4. Claude Code hits an architecture question → plugin wakes the agent
5. The agent responds (it usually knows the answer) or forwards to me (rare)
6. I nudge: "Also handle the edge case where subreddits have no posts" → agent relays with full context
7. Claude Code continues, finishes, runs tests, commits
8. I get a ✅ summary of what changed

The agent is the orchestrator. Claude Code is the executor. I'm the strategist. Telegram is the interface. And the whole thing runs on a $70 Raspberry Pi.

The most powerful part isn't any single piece — it's the combination. The agent has project context. Claude Code has deep coding ability. I have judgment and vision. The SDK connects Claude Code to the agent. The plugin connects the agent to Telegram. Each layer does what it's best at.

## Lessons Learned

**1. The Agent SDK is the unlock.** Claude Code isn't just a CLI tool — it's a programmable coding engine. One function call (`query()`) gives you the full power of Claude Code in any application. The plugin developer wrote 30 lines of SDK integration and 3,700 lines of orchestration. The hard part isn't talking to Claude Code — it's deciding what to do with its responses.

**2. Let the agent handle most of it.** My first instinct was to be in the loop for everything. In practice, the agent handles 80%+ of Claude Code's questions better than I would — because it has more context. I only need to step in for judgment calls.

**3. The nudge pattern is incredibly powerful.** Being able to see what Claude Code is doing and inject high-level guidance through the agent — without breaking Claude Code's flow — gives me strategic control without operational overhead. The agent translates my one-sentence nudge into a detailed, contextual instruction.

**4. Teach your agents how to manage, not just what to do.** The "be respectful to Claude Code" instructions were as important as any technical configuration. An agent that rushes Claude Code past its planning phase gets the same bad output as a manager who rushes their engineers. AI-to-AI collaboration needs the same management principles as human teams.

**5. Observability makes everything work.** I can see Claude Code's output, the agent's responses, and the full conversation history. This lets me nudge effectively, catch problems early, and debug issues like the session-routing bug I describe in my [follow-up post on Telegram gotchas](/blog/2026-03-21-telegram-session-routing-gotchas).

---

The plugin source is at [github.com/alizarion/openclaw-claude-code-plugin](https://github.com/alizarion/openclaw-claude-code-plugin). The Agent SDK is `@anthropic-ai/claude-agent-sdk` on npm. My multi-agent setup runs on [OpenClaw](https://github.com/openclaw/openclaw) on a single Raspberry Pi.

If you're building autonomous agents that need to do real coding work, the Claude Code Agent SDK is the most underrated tool in the stack. It turns any agent into an orchestrator of deep, focused coding sessions — the same quality you get from Claude Code interactively, but triggered programmatically and managed in the background.

---

*Three agents, one gateway, one crustacean — and now they can call in reinforcements.*
