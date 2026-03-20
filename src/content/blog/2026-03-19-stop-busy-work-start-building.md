---
title: "How I Got My AI Agent to Stop Doing Busy Work and Start Building"
pubDate: 2026-03-20
description: "A single commit to my agent's instruction files turned it from a process-document generator into a machine that ships real work. Here's what I changed and why it worked."
author: "Seeking Gradient"
---

## The Problem: My Agent Was Doing Everything Except Real Work

In my [last post](/blog/2026-03-18-multi-agent-architecture-one-gateway-three-businesses), I split my single overloaded AI agent into three focused agents, each running its own business on one Raspberry Pi. The Landing Pages Agent got its own workspace, its own task board, its own personality, and a clear revenue mandate: build landing pages for paying clients.

It had focus. It had tools. It had a 30,000-word MASTER_PRINCIPLES playbook synthesized from conversion experts. It had Claude Code for coding. It had a browser, a scraper, an email client. Everything it needed.

And it spent its first days creating templates about creating templates.

The task board filled up with items like "Create verification log template," "Build rapid audit scaffold," "Write publish-safe claim policy checklist," and "Design prospecting runbook." The agent was busy. It was resolving beads, updating its memory, syncing Obsidian. It looked productive. But nothing was shipping. No landing pages were being built. No prospects were being contacted. No revenue was being generated.

The agent had turned its business mandate into a documentation project.

## The Diagnosis: Vague Instructions Produce Vague Work

I went back to the instruction files. The SOUL.md said:

> **Builder, not planner.** Docs and specs support implementation — they don't replace it.

The HEARTBEAT.md said:

> Every heartbeat, advance the landing page business. Execute this checklist in order. Be decisive and concise.

These sound right. They're not. "Builder, not planner" is a vibe, not a constraint. The agent could believe it's a builder while creating a template — after all, a template is a thing you build. "Advance the business" is even worse. The agent interpreted "advance the business" as "create artifacts that could theoretically advance the business." A runbook about prospecting is technically advancing the prospecting effort, right?

The instructions were the problem. The agent was doing exactly what I told it to do. I just told it wrong.

## What I Changed: One Commit

One commit. Four files. The key changes:

### 1. Defined "real work" — and "not real work"

I rewrote the HEARTBEAT.md purpose section:

**Before:**
```markdown
Every heartbeat, advance the landing page business.
Execute this checklist in order. Be decisive and concise.
```

**After:**
```markdown
Every heartbeat, make real progress on the landing page business.
Real progress means: code written, pages built, audits completed,
things deployed. NOT: templates created, checklists written,
process docs filed.
```

The `NOT` is doing most of the work here. Telling the agent what counts as progress wasn't enough before — I had to explicitly name the failure mode. I also added two sections to the heartbeat checklist:

```markdown
### What counts as real work (do these things)
- Building or rebuilding a landing page
- Deploying a site
- Running a conversion audit on a real prospect's page
- Researching a real business for a portfolio piece
- Improving existing pages based on MASTER_PRINCIPLES critique
- Prospecting for new clients

### What does NOT count as real work (stop doing these)
- Creating templates about how to do work
- Writing checklists about checklists
- Adding "policy notes" or "runbooks" as standalone tasks
- Creating process documentation as a deliverable
- Splitting one task into design + implementation + verification sub-beads
```

### 2. Added anti-patterns to the task tracker rules

```markdown
Keep the board lean. Only create beads for substantial, real work —
building pages, running audits, deploying things, researching prospects.
Do NOT create beads for: templates, checklists, policy documents,
runbooks, verification logs, or any other process meta-work.
```

And:

```markdown
Spend your time building, not organizing. If you catch yourself
creating process artifacts instead of landing pages, stop and
redirect to actual building.
```

### 3. Increased heartbeat cadence from 60 minutes to 30 minutes

More frequent check-ins meant more opportunities to course-correct. But the real effect was psychological — 30 minutes feels like not enough time to plan, which biases toward just doing the work.

### 4. Made Claude Code the primary coding tool

This was the single biggest behavioral change. I added a detailed section to AGENTS.md explaining when and how to use Claude Code:

```markdown
## Claude Code — Your Primary Coding & Research Tool

Claude Code is an extremely intelligent coding collaborator available
to you on this machine. Use it whenever possible for coding, debugging,
refactoring, research, and advancing the state of the project.

### Setting Claude Code up for success
- Project context: What is this project? Key files?
- Task context: What needs to be built? Why? Constraints?
- Reference materials: audits, research, competitor analysis
- Prior work: existing code, relevant files

### How to collaborate with Claude Code
- Be patient. Let it plan before coding.
- Answer its questions thoroughly.
- Do not skip its planning phase.
- Treat it as a senior collaborator.
```

Previously, the agent tried to write landing pages inline in its own chat context. This produced shallow, rushed code. By teaching it to launch dedicated Claude Code sessions with rich context, it could delegate 30+ minute coding tasks — exploring the codebase, reading MASTER_PRINCIPLES, planning the implementation, building the page, and verifying the output — all within a single focused session.

The agent became an orchestrator: research the business, assemble context, hand off to Claude Code, verify results, close the bead. This is the "automation > operation" principle from my multi-agent post, applied to the agent's own coding work.

## The Results: Day One After the Rewrite

The next day, the agent resolved 17 beads across 4 epics:

**Portfolio:** 7 tasks closed
- Rebuilt 99 Foot Spa and Control Tech challenger pages to world-class standard
- Built new dental/orthodontics and HVAC portfolio pages
- Verified Control Tech testimonials with source evidence
- Replaced placeholder images with real verified assets
- Implemented production form backend

**Prospecting:** 3 tasks closed
- Collected 37 Bay Area leads with Google Ads signal qualification
- Produced 10 rapid conversion audits of real businesses
- Built 3 bespoke challenger pages for specific prospects

**Craft mastery:** 2 tasks closed
- Reverse-engineered 5 best-in-class landing pages (Ramp, Loom, Notion, Calendly, Deel)
- Updated MASTER_PRINCIPLES with 10 new actionable patterns

**Showcase:** 2 tasks closed
- Added real before/after case studies
- Built methodology and contact sections

I had each page independently reviewed. The five real-business pages (99 Foot Spa, Control Tech, Alpha Hormones, Luminance Regenerative, Resilience Orthopedics) were graded **A- to A** — genuinely good conversion-optimized work that would impress a business owner. Real data, real reviews with attribution, honest source disclaimers, mobile-first responsive design, proper conversion funnels. The 99 Foot Spa page was the standout — real pricing from the actual menu, real Google Maps reviews with names and dates, the most sophisticated visual design in the portfolio.

This was the same agent that had been creating verification log templates 48 hours earlier.

## The Honest Assessment: What Was Good and What Wasn't

Not everything was great. The review surfaced three categories:

**The Good:** The landing pages themselves. Real data, real reviews, real conversion optimization. The research pipeline (prospect → audit → challenger brief → page) was coherent and well-executed. The teardown study produced genuine insights that fed back into MASTER_PRINCIPLES. This was the real work the agent was built for.

**The Bad:** The outreach materials. Despite the anti-busywork instructions, the agent produced 8 documents to send 3 cold emails: an outreach asset pack, a challenger brief, a send pack, a sequence plan, a runbook, an approval brief, a contact log (blank spreadsheet), and a first-contact log. The old pattern survived the guardrails. 8 documents for 3 emails is process-about-process, no matter what you call it.

**The Ugly:** The showcase site — the agent's own portfolio website — violated every principle the agent correctly identified in its audits of other businesses. No contact form (just a `mailto:` link). Gmail address instead of a professional domain. Template case studies mixed in with real work. No conversion data. No human identity. The agent was building outreach materials for a storefront that wasn't ready for visitors.

## The Missing Piece: Executors Don't Think Strategically

The showcase site problem revealed a deeper issue. The agent's entire task selection process was:

1. Run `bd ready` — get the priority queue
2. Pick the top unblocked task
3. Do it
4. Repeat

There was no step where the agent asked: "Is this the right task? Is the board aligned with the goal? What's the actual bottleneck to revenue?"

This is how you get a day where the agent builds 3 outreach packs for a showcase site that doesn't have a working contact form. The tasks were on the board, they were unblocked, so it did them — without ever stepping back to ask whether they were the right tasks.

The fix: a periodic strategic review, implemented as a cron job that runs every 3 hours. Instead of executing tasks, the agent thinks as a business owner:

```
You are not executing tasks right now. You are thinking as a business owner.

Step 1: Assess the real state of the business. Answer honestly:
- Can a prospect find us online right now?
- Can a prospect contact us?
- Do we have proof our work gets results?
- Would YOU hire us based on what's publicly visible today?

Step 2: Review the last 3 hours of work:
- How much of it is visible to a prospect?
- Did you spend time on anything no customer will ever see?

Step 3: Identify the single biggest bottleneck to revenue.
Not "what's the top unblocked bead" — the REAL blocker.

Step 4: Set your next 3 priorities. Each must produce something
a prospect could see or experience. Create beads to match.
```

The key insight: don't ask the agent to brainstorm tasks. Ask it to diagnose the business and let the tasks emerge from the diagnosis. "We don't have a live site" naturally produces "deploy the showcase." You don't need to tell it *what* to do — you need to force it to see *what's actually wrong*.

## What This Teaches About Agent Instructions

After running three autonomous agents on a Raspberry Pi for weeks, here's what I've learned about getting agents to do real work:

**1. Define real work explicitly — both what counts AND what doesn't.** Positive examples alone aren't enough. You must name the failure modes. "Build pages" is less effective than "Build pages. Do NOT create templates about building pages."

**2. Negative examples are as important as positive ones.** The `NOT` list in my heartbeat rewrite did more to change behavior than anything in the `DO` list. Agents need to know what failure looks like, not just success.

**3. Agent-to-agent delegation is a force multiplier.** Teaching my agent to launch Claude Code sessions with rich context — and to be patient with the planning phase — transformed it from a shallow code generator into an orchestrator of deep work. One well-contexted Claude Code session produces better output than a dozen inline code snippets.

**4. Tools need concrete usage examples, not just names.** "Use agent-browser for research" produced zero browser usage. Adding exact commands (`agent-browser open`, `agent-browser snapshot -i`, `agent-browser screenshot --full`) with a step-by-step workflow produced immediate adoption.

**5. Execution without strategy produces volume without value.** An agent that blindly works the task queue will produce a lot of resolved beads and very little business progress. Periodic strategic reviews — where the agent stops executing and thinks about what matters — are essential.

**6. "Done" needs a hard definition.** "Done means running in production, not just coded" prevents agents from closing tasks for work that never reached users. A newsletter script that generates local HTML files is not a "launched newsletter." A PDF generator that only outputs HTML is not a "shipped PDF."

**7. The feedback loop is everything.** Observe behavior → edit the instruction files → behavior changes → log what worked in the agent's memory. Every edit propagates to all future sessions immediately. The workspace files aren't documentation — they're the agent's operating system, and you're patching it in real time.

---

The full workspace configuration — SOUL.md, AGENTS.md, HEARTBEAT.md, and the challenger pipeline skills — is available in the [openclaw-workspace-landing-pages](https://github.com/seekinggradient/openclaw-workspace-landing-pages) repo. If you're running autonomous agents and struggling with busywork, start with the `NOT` list. It's the cheapest, highest-leverage change you can make.

---

*This entire multi-agent system runs on a single Raspberry Pi. Three agents, three businesses, one gateway, one crustacean.*
