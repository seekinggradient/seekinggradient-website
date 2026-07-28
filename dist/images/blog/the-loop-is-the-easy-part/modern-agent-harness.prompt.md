---
description: Reusable art direction and content specification for regenerating or extending the modern-agent-harness infographic series.
verified: 2026-07-11
---

# Modern agent harness visual direction

These graphics are editorial explanations, not decorative hero art. They should make one system relationship legible before the accompanying prose is read.

## Shared visual system

- Landscape 16:9 composition; the current files are 1672 × 941 PNGs.
- Warm off-white paper background with charcoal typography and outlines.
- Cobalt blue, vermilion, teal, and mustard accents.
- Crisp geometric editorial illustration with subtle depth and generous negative space.
- Minimal, large text; icons carry secondary meaning.
- Avoid generic dashboards, ornamental circuitry, photorealism, tiny labels, and decorative “AI glow.”
- Prefer causal arrows, containment boundaries, gates, rails, layers, and clearly different scopes.
- Use generic channel/service icons unless a product comparison specifically requires a product name.

## Graphic specifications

1. **Five-layer ladder:** five ascending, widening steps labeled `MODEL ADAPTER`, `CANONICAL HARNESS`, `DURABLE RUNTIME`, `AGENT PLATFORM`, and `PRODUCT APP`. The small model chip at the bottom grows into a user-facing application at the top.
2. **Time and failure:** contrast a request path broken by `DISCONNECT`, `CRASH`, and `DEPLOY` with a checkpointed durable-session rail that can `RESUME`; end with the warning `REPLAY SAFELY`.
3. **Context compaction:** an overflowing `FULL HISTORY` passes through a deliberate `COMPACTION` funnel into bounded `WORKING CONTEXT`, while a separate `DURABLE STORE` remains intact.
4. **Human approval:** a workflow reaches a secure gate, can `PARK`, must `VERIFY PERSON` and `BIND DECISION`, then `RESUME ONCE` with an `AUDIT` record. Questions and OAuth consent share the same park/resume shape.
5. **Authority and credentials:** distinguish `TOOLS`, `SANDBOX`, `POLICY`, `CREDENTIAL BROKER`, egress, and audit. No secret should visually enter the model conversation or sandbox.
6. **Channels:** many differently shaped requests—web, team chat, email, SMS, webhook, issue tracker—enter a semantic-adapter box that owns `IDENTITY`, `THREAD → SESSION`, `ORDER & RETRY`, `ATTACHMENTS`, `APPROVAL UI`, and `DELIVERY`, then hands one normalized session envelope to the agent.
7. **Scheduling:** `TIME`, `EVENT`, and `STATE CHANGE` initiate a `DURABLE RUN` that checks overlap policy and credentials, performs work, and delivers through a channel. The visual transition is from responsive to proactive.
8. **Observability and evals:** expand raw logs into an ordered trace of `SESSION`, `TURN`, `MODEL`, `TOOL`, `WAIT`, `RETRY`, failure, tokens, and cost. Compare observed behavior with an eval and block the deploy gate on regression.
9. **Five stores:** separate floors for `CHECKPOINTS & EVENTS`, `SESSION WORKING STATE`, `PRODUCT TRANSCRIPT`, `CROSS-SESSION MEMORY`, and `DOMAIN SOURCE OF TRUTH`. Put `CREDENTIALS ≠ MEMORY` in a vault outside the hierarchy.
10. **Ecosystem map:** place Fly.io under the workload as compute, Eve around it as runtime, Vercel above as managed operations, AgentsFS beside it as durable knowledge, and agentsfs-chat beside it as product experience. Arrows communicate composition rather than competition.

## Extension rule

New graphics should reuse this system but earn their existence by clarifying a new relationship. If prose plus one of the existing ten images already explains the concept, do not create another near-duplicate.
