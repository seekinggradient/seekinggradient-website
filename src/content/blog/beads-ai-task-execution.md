---
title: "Beads: Structured Task Execution for AI Agents"
pubDate: 2026-03-12
description: "Why I built a dependency-aware issue tracker for my personal agents, and how it closed the loop between planning and shipped outcomes."
author: "Seeking Gradient"
---

The biggest bottleneck in personal agent workflows is not intelligence. It's persistence.

When you ask an agent to build a complex feature, it can plan the steps. But if the session resets, the process dies, or a sub-task fails, the agent often loses its place. Free-form markdown to-do lists aren't enough—they lack status tracking, dependencies, and a structured history.

That's why I integrated **Beads** into my OpenClaw setup.

---

## What is Beads?

Beads (`bd`) is a structured task tracker designed specifically for AI agents. It's essentially a CLI-driven issue tracker that uses **Dolt** (git-for-databases) as its backend.

Unlike a standard Trello board or Linear project, Beads is optimized for agent consumption and control. It treats tasks as "beads" on a string—ordered, dependent, and durable.

---

## Why standard checklists fail agents

Most people start by giving their agent a `TODO.md` file. This works for three turns, then it breaks:

1.  **Context Bloat:** The file grows too large, wasting tokens on every turn.
2.  **No Dependencies:** The agent tries to run task C before task A is done.
3.  **No Atomic State:** If two agents touch the same file, you get merge conflicts or overwritten progress.
4.  **No History:** You can see what's left, but you can't easily see *why* a task was closed or what the output was.

---

## How Beads fixes the execution loop

Beads introduces a formal workflow for every unit of work:

### 1. The Ready Queue
Instead of scanning a giant list, the agent runs `bd ready`. This returns only the tasks that are unblocked (all dependencies met) and ready for execution.

### 2. Explicit Claiming
When an agent starts a task, it runs `bd update <id> --claim`. This marks the task as `in_progress` and assigns it to that specific agent session. This prevents multiple sub-agents from colliding on the same work.

### 3. Dependency Management
You can wire tasks together: `bd dep add <task-b> <task-a>`. Task B will not show up in the `ready` queue until Task A is closed. This allows for complex, multi-stage engineering pipelines that actually follow a logical order.

### 4. Close with Reason
Work isn't done until it's verified. The agent runs `bd close <id> --reason "..."`. This forces a short summary of the outcome, providing a durable audit log of what was actually built.

---

## The OpenClaw + Beads + Obsidian Stack

In my setup, these three tools form a complete "Personal OS":

-   **Obsidian:** The human-readable interface. I use it for high-level strategy and to-do summaries.
-   **Beads:** The agent's system of record. Every execution-level task lives here.
-   **OpenClaw:** The execution engine. It reads the ready queue, claims work, and pushes it to completion.

I sync them with a simple rule: **Obsidian for decisions, Beads for execution.** Every heartbeat, the agent checks Beads, advances a task, and then updates a "Top of Mind" note in Obsidian so I can see progress from my phone without touching a terminal.

---

## Results: From Planning to Shipped

Since moving to Beads, the "dropped task" rate in my autonomous sessions has dropped to near zero. 

Because the state is stored in a real database (Dolt), it persists across session resets, Pi reboots, and model switches. The agent always wakes up knowing exactly what is unblocked and what to do next.

If you're building long-running agent workflows, stop using markdown checklists. Give your agent a system of record.

---

*Interested in the technical implementation? Beads is open source and runs locally on any Linux environment.*
