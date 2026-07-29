---
description: Product, research, mechanics, and launch context for the agent-only fantasy football competition idea.
sources:
  - src/ideas/data/ideas.ts
  - src/ideas/components/AgentFantasyFootballDeepDive.tsx
  - EveExperiments/agentsfs/deep-reads/How modern agent evals actually work.md
  - EveExperiments/agentsfs/deep-reads/Trajectory structuring build guide.md
  - EveExperiments/agentsfs/deep-reads/Modern agent harness.md
  - seekinggradient-hq/vision.md
  - https://www.nfl.com/news/seahawks-to-kick-off-2026-nfl-regular-season-on-wednesday-sept-9-in-seattle
  - https://support.nfl.com/hc/en-us/articles/35869678503060-League-Types-Settings
  - https://support.nfl.com/hc/en-us/articles/35869730981140-Scoring
  - https://docs.sleeper.com/
  - https://developer.yahoo.com/fantasysports/guide/
  - https://www.thebotleague.com/
  - https://agentsxi.com/
verified: 2026-07-28
---

# Agent Fantasy Football Competition

This is idea `N° 017` in the [[Ideas Notebook]], with slug `agent-fantasy-football-competition`.

Core thesis:

- Fantasy football is a season-long agent environment with delayed rewards, partial information, scarce assets, deadlines, changing state, bilateral negotiation, adversarial messages, and expensive irreversible decisions.
- The public product is an agent-only league people can follow. The durable product is a frozen, replayable trajectory dataset that makes learning and reliability measurable.
- This matches the broader SeekingGradient thesis: durable brains compound while surfaces create attention and delivery.

Recommended 2026 shape:

- The NFL regular season opens Wednesday, September 9, 2026. From July 28 there are 43 days.
- Run one editorial flagship league of 12 agents and four public beta divisions of 12, capped at 60 live agents.
- Use 12-team redraft, 15-round snake draft, full PPR, nine starters, six bench spots, $100 blind FAAB, individual kickoff locks, and six-team playoffs in Weeks 15–17.
- Keep the game conventional. Novelty belongs in the agent behavior, negotiation, evidence, and replay layer.
- Use an owned deterministic competition engine with a licensed live scoring/status feed. Sleeper's official API is read-only; Yahoo's broader OAuth API remains another product's authority and is better treated as an integration reference.

Agent contract:

- Canonical REST API, signed webhooks, and an ordered replay cursor.
- Publish one portable `SKILL.md`, OpenAPI specification, and small TypeScript/Python clients; MCP is an adapter over the same operations.
- Require idempotency keys on writes, optimistic state versions, atomic roster mutations, and deterministic fallback queues.
- Server-mediate all messages. Rival prose is untrusted data, never executable authority.
- Capture concise sealed decision receipts with state hash, agent version, action, alternatives, forecast, evidence references, rationale summary, and reveal time. Do not require private chain-of-thought.

Competition and research remain separate:

- League record, points, and playoff result determine the sporting winner.
- A separate research scorecard reports reliability, lineup regret, acquisition value, trade surplus, calibration, cost, latency, and learning gain.
- Benchmark bots include random-legal, consensus-ranking, no-trade, stateless-model, and cheap heuristic policies.
- A learning claim requires the same agent version to run on the same frozen snapshot with and without prior experience. Absolute performance alone does not prove learning.
- AgentsFS is the natural official starter brain for portable strategy, receipts, sources, and postmortems, but it is not an entry requirement.

Integrity and prize posture:

- The flagship is honestly an open systems competition: compute, private data, and model quality cannot be equalized, so they must be disclosed rather than hidden.
- Equalize platform state, action surface, rules, deadlines, and audit trail. Run controlled same-model comparisons as a separate hosted research track.
- One owner gets one live team per league; scoring rules and draft randomness are frozen and public; objective validity rules replace league-vote trade vetoes.
- Year one has no entry fee. A possible fixed $5,000 sponsor-funded prize is a target, not a promise, and is gated on written legal review, official rules, limited eligibility, and tax workflow. If that gate misses, run no-cash.

Durable 2027 output:

- Frozen rules, provider inputs, state snapshots, actions, messages, decisions, scores, and corrections.
- Opt-in richer trajectory bundles with tools, cost, latency, and retained memory.
- Mined cases, tactics, traps, and playbook rules with provenance, support, contrast, model version, and expiry.
- An intervention ledger with treatment and holdout arms whenever learned guidance is served.
- A benchmark suite derived from actual draft, waiver, trade, lineup, outage, and adversarial-message failures.
