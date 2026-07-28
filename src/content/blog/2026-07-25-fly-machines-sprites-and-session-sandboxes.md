---
title: "Fly Machines, Sprites, and Session Sandboxes: Three Ways to Give an Agent a Computer"
pubDate: 2026-07-25
description: "Three ways to give an agent a computer, and the operational lesson that persistence without a rebuild recipe turns cattle into pets."
author: "Seeking Gradient"
---

I've been building AgentsFS, a knowledge system for knowledge workers who want their agents to develop compounding intelligence rather than start from scratch in every session.

To run the hosted version, I had to answer a plumbing question that turned out to be more interesting than it looks: where does the agent's *computer* live?

An agent that can run a shell, clone repositories, install packages, and start services needs a real machine underneath it. There is no shortage of ways to provide one. But the choices are not interchangeable.

**Each makes a different bet about persistence** — about what survives when the agent goes idle, and what has to be rebuilt when it comes back.

In the companion piece, [*The Loop Is the Easy Part*](/blog/2026-07-15-the-loop-is-the-easy-part), I argued that knowledge should compound outside any one session, in a portable store the application owns. This is the infrastructure version of the same argument.

The three primitives below — Fly Machines, Fly Sprites, and per-session sandboxes — are three answers to "how much of the computer do you keep?" I ran one of them in production for a couple of days, and the lesson it taught me is the point of this article.

## The building block: Fly Machines

Start at the bottom. A [Fly Machine](https://fly.io/docs/machines) is a Firecracker microVM stamped from an OCI image. You hand Fly a container image and a machine config; it boots a hardware-isolated VM from it. The image is the recipe, and every machine is a fresh, identical stamp of that recipe.

That framing makes machines *cattle* in the classic ops sense. You do not log in and fix a machine. You change the image, roll a new machine from it, and throw the old one away.

**An update is an image swap, not a patch**, so there is nothing to drift and nothing to reconcile — the running machine never diverges from a base you can no longer reproduce.

The economics reward this shape.

A stopped machine bills only for its root filesystem at $0.15/GB-month; a small, mostly-idle instance (shared-cpu-1x with 1 GB of memory, active perhaps half an hour a day) comes out around $0.27/month, versus roughly $0.0079/hour while it is actually running.

Waking is fast: a [suspended machine resumes](https://fly.io/docs/reference/suspend-resume) in a few hundred milliseconds, and a fully stopped one cold-starts in a couple of seconds. You pay almost nothing to keep a machine parked and very little to bring it back.

This is the building block. It is clean precisely because it holds no durable state of its own — the disk is scoped to the machine, and the machine is disposable. Everything above it is a decision about how much of that cleanliness to trade away for memory.

![Fly Machines as cattle: one OCI image stamped into interchangeable Firecracker microVMs, where an update is a fresh stamp rather than a patch](/images/blog/fly-machines-sprites-and-session-sandboxes/06-fly-machines-cattle.png)

## Sprites: persistence as the feature

A [Sprite](https://sprites.dev) is a persistence layer on top of that machine.

The distinguishing move is simple to state and large in its consequences: the *whole filesystem* checkpoints across sleep and wake. The sprite goes idle, its entire disk is preserved, and when the next request arrives it wakes back into exactly the world it left.

That is a genuinely different primitive, and an underrated one. A machine is a disposable stamp; **a sprite is a persistent personal computer for an agent**.

Whatever the agent did last time — the repositories it cloned, the packages it installed, the services it started, the scratch files it left around — is still there. You are not rebuilding a working environment on every wake. You are resuming one.

I leaned into that. AgentsFS runs one sprite per user, named `afs-user-<user>`: a single hardware-isolated Firecracker microVM that holds all of that user's Git checkouts as sibling working trees, runs the agent service persistently on its own port, keeps the conversation store on local disk, and carries no model-provider key on the box (model calls are proxied through the Hub instead).

It auto-sleeps when idle and wakes on request. For a product where a user comes back day after day to the same accumulated workspace, this is a lovely fit. Statefulness *is* the feature: a real POSIX world the agent can build in, warm latency because nothing has to be reconstructed, one durable identity per user, and wake-on-request economics inherited from the machine underneath.

**Sprites are powerful.** If your mental model is "each user has a computer that is always theirs and picks up where it left off," a sprite gives you that almost for free, with isolation and idle economics you would otherwise build by hand.

The lesson that follows is about some of the gotchas when it comes to actually having persistence at this level. It is about the bill that comes with persistence, and who pays it.

![A sprite as a persistent personal computer for an agent: the whole filesystem checkpointed across sleep and wake, so the workspace resumes instead of rebuilding](/images/blog/fly-machines-sprites-and-session-sandboxes/07-sprite-persistent-computer.png)

## The lesson: persistence without a rebuild recipe becomes pets

Here is the part I learned by running it.

Provisioning a sprite happens *once*, at creation.

In my case that meant creating the VM, minting a per-user credential, pushing the agent bundle and a Linux `afs` binary onto the disk, cloning every one of the user's repositories, seeding config files, and registering the agent as a persistent service whose environment — mode flags, the LLM proxy URL, the credential — was baked in at that moment.

After that first boot, **the sprite is a running animal**, and it keeps running its original configuration across every subsequent wake.

Which is exactly what you asked for, until you need to change the base software. A new CLI binary. A new agent bundle. A changed environment variable in the service definition.

On cattle, that is an image swap. On a sprite, there is no image to swap — the durable disk *is* the source of truth now, and it is already populated. So the update becomes surgery on a live animal: reach into a running, stateful machine and mutate it in place, hoping it lands in a consistent state.

It often does not land cleanly. You get partial states, where some sprites took an update and others did not. You get stale service environments, where the process is still running with the environment it was born with because nothing re-created the service. And you discover that the only *reliable* update path — the one that always works — is to delete the sprite and reprovision it from scratch.

In my usage, a real change to the base software needs an explicit fleet migration rather than trusting the provisioning path to converge them. When a security review found a credential-handling problem, the remediation was not "patch the fleet." It was, in the end, that every existing sprite had to be sanitized or reprovisioned before the claim could be true again.

That is the lesson, and it is not a complaint about Fly or about sprites. It is a property of persistence itself. The moment you keep the whole filesystem, you have opted out of the image-swap update model, and unless you replace it with something equally reliable, **your cattle quietly become pets** — each one a slightly different, hand-tended individual that you are afraid to touch and can only truly fix by putting down and hatching a new one.

![Provision-once drift: base-software updates arriving as in-place surgery on a running sprite, producing partial states and stale environments that end in delete-and-reprovision](/images/blog/fly-machines-sprites-and-session-sandboxes/08-persistence-becomes-pets.png)

## The tax on persistence is a convergence story

If keeping state is the feature, then owning a *convergence story* is the tax. A convergence story is the thing an image swap gives you for free and a persistent disk takes away: a way to declare the desired state of the machine and reconcile the actual state toward it, reliably, on every wake — not just at birth.

I built pieces of one, and the pieces are instructive because of where they stopped.

On cold wake, the sprite does a best-effort warm-up. At turn boundaries, the workspace reconciles: before a chat turn or a focus change, the relevant checkout runs a fast-forward `git pull`, and if it cannot sync cleanly the turn fails loudly rather than answering from stale files.

Those are real convergence loops — for the *content*. The user's knowledge is kept honest on every turn because Git is the desired state and the checkout reconciles to it.

But the *base software layer* never got the same treatment. There was no equivalent loop that said "on wake, make sure the agent bundle, the binaries, and the service environment match the current desired versions, and re-create them if they do not." So the content converged and the platform drifted.

Provision-once plus reconcile-content is a coherent design, but it is only half a convergence story, and the missing half is exactly the half that made reprovisioning the fallback. If I were to keep the sprite architecture, the work item is unambiguous: give the base layer the same declare-and-reconcile treatment the workspace already has.

### Bridging the gap
Push that far enough and a question appears.

If the base layer had a real convergence story of its own, would a sprite simply become a sandbox?

Mechanically, it could. The server would hold a desired-state key — the binary versions, the agent bundle's hash, the schema of the service environment — and on every wake a converger would compare the sprite's local stamp against it and reconcile the two before the box served a single request.

Done properly it would go further and re-partition the disk into two regions: a *system layer* the converger is free to destroy and rebuild, and a *state layer* it never touches. That is the very split the sandbox enforces between its template and a session's scratch.

I would just be drawing the line by hand, on a disk that was never designed to have one.

### Why not to do that

**Drawing it by hand is the whole cost.** Everything the sandbox hands you for free becomes yours to build: the template that gets built and cached, the warm instantiation, the revalidation logic that decides when a cached template is stale, the snapshot lifecycle that ages scratch state out.

And two quieter items on that list are the ones that actually bite.
1. The first is *atomicity*. An image swap cannot half-apply — the machine boots the new image or it does not — but a converger script can fail halfway and leave the box in a state that is neither the old world nor the new one, which is precisely the pathology I lived.
2. The second is *enforcement*. Nothing on a sprite stops a process from writing into the system layer outside the recipe; the boundary between what is rebuildable and what is durable holds only because I promise to respect it. Vercel enforces that boundary by construction — a session cannot mutate its template — while I would be enforcing it by discipline, which is another name for eventually not.

**The elegant version of this already exists**, and it is worth naming: a declarative system layer, content-addressed, with atomic switches between whole generations and a clean rollback when one goes bad.  That is essentially NixOS running on the sprite.

It is real engineering and it would work. It is also a serious project whose entire purpose is to give a persistent disk the one property the disposable image had for nothing — and seeing that trade plainly is the point before you sign up to make it.

![The DIY convergence loop: a server-side desired-state key driving a wake-time converger that rebuilds the system layer while the state layer persists, and the ledger of everything you now own by hand](/images/blog/fly-machines-sprites-and-session-sandboxes/12-diy-convergence-loop.png)

## The opposite bet: per-session sandboxes

The other end of the spectrum is a sandbox-as-a-service, and [Vercel Sandbox](https://vercel.com/docs/sandbox) is the concrete example I evaluated. It makes the opposite bet on purpose: persistence is scoped to a *session*, and nothing about the base software is ever hand-patched.

The shape is inverted from a sprite.

Dependencies do not live on a long-tended disk; they come from a template that is rebuilt at deploy time, keyed so that a warm template is reused only while its inputs are unchanged and rebuilt from scratch the moment they are not.

A session gets a fresh environment stamped from that template — the cattle model, back again, one level up. What persists is only the session's own scratch state, captured as a snapshot, and even that is deliberately temporary: snapshots expire thirty days after last use, after which a dormant session simply rebuilds from the template and the canonical source. There is no long-lived animal to drift.

The operational profile follows from the bet. Compute bills only while a session runs — around $0.128 per vCPU-hour — and idles out after a few minutes by default, so an always-current environment costs nothing between turns; a representative workload lands near $3/month.

The constraints are the honest cost of the model: a fixed 32 GB disk, a single region today, and no assumption that anything you leave behind is permanent. Updates, though, are free in the way that matters — you push a new template and the next session is current, with nothing to migrate and nothing to reconcile. **Long-lived statefulness is simply not the product.**

![A per-session sandbox: dependencies rebuilt from a template at deploy, only session scratch snapshotted, and the snapshot expiring so nothing is ever hand-patched](/images/blog/fly-machines-sprites-and-session-sandboxes/09-session-sandbox-rebuilt.png)

## Same engine, different altitude

It is tempting to read Machines and the sandbox as opposites, but at the virtualization layer they are nearly the same thing. Both are Firecracker microVMs, both boot from an image, both start fast, and both bill by use. **The difference is not the engine. It is the product wrapped around it.**

A Machine is infrastructure you rent. It hands you a durable identity, volumes that outlive a boot, public services on real ports, your own registry, and your own orchestration — a general-purpose server that happens to live one floor down from where you work.

The sandbox is an execution service. Its API is scoped to sessions, its template lifecycle is keyed to your deploys, it idles itself out and restores on demand, it injects credentials for you, and it has no ambition to be a server at all.

**Same primitive, two altitudes: one hands you a box and gets out of the way, the other hands you a narrow contract and takes the operations.**

Which means you could build a sandbox-like service on top of Machines — take the raw box and wrap it in session scoping, template revalidation, and idle economics until it behaves like an execution API.

That is very nearly what a sprite is: an opinionated persistence product built on the Machines substrate. It simply makes the opposite bet from the sandbox. Where the sandbox wraps the machine to persist almost nothing, the sprite wraps it to persist everything.

![Same engine, different altitude: one Firecracker microVM layer below, and above it two different product towers — a rentable Machine with durable identity and volumes, and a session-scoped sandbox with a template and an expiry timer](/images/blog/fly-machines-sprites-and-session-sandboxes/11-same-engine-different-altitude.png)

## They persist different things

Once you see the two side by side, the framing that dissolves the "which is better" argument is that they persist *different things*.

**A sprite persists the computer. A per-session sandbox persists the conversation's workspace and lets the computer be rebuilt around it.** Neither is right in the abstract; the choice is a product decision.

If what your users need is a durable personal machine that accumulates state, stays warm, and is theirs across every visit, the sprite's bet is the good one — and you accept that you owe it a convergence story.

If what your users need is clean, disposable, always-current compute scoped to a task, the sandbox's bet is the good one — and you accept that nothing survives the session except what you deliberately store elsewhere.

The trap is picking one and then quietly fighting its nature: hand-patching a sandbox until it becomes the pet you were trying to avoid, or leaning on a sprite's persistence for state you never gave a rebuild recipe. The primitive is only as good as your honesty about which thing you are asking it to keep.

## None of this is new — except the question

It is worth being honest that almost none of the machinery in this article is new.

A microVM per workload is 2018 technology: Firecracker was built to run AWS Lambda, and putting one hardware-isolated VM behind every function call has been in production at enormous scale for years.

Per-session agent sandboxes are already a crowded category — E2B, Modal, Daytona, Vercel — and what separates them is packaging and ergonomics, not the underlying primitive. Even the sprite's headline trick, checkpointing and restoring a whole machine, is old: CRIU has been freezing and thawing process trees for a decade, hypervisors have suspended and resumed VMs for longer than that, and Firecracker snapshots are a documented feature rather than a secret.

**What is actually rare about sprites is the product framing.**

A durable personal computer for each user, one that sleeps for pennies and wakes by name with its entire world intact, is not a common thing to be handed as a primitive.

The closest priors are Codespaces — persistent per-user development VMs that sleep when idle — and the various branching-VM services, which is enough to place sprites as rare and newly relevant rather than as something that never existed. The pieces were all on the shelf. Assembling them into "every user gets a computer" as a first-class product is the uncommon move.

The genuinely new ingredient is the agents. Agents are what made "every user gets a computer" economically serious for the first time: a fleet of mostly-idle personal machines only pencils out when each one costs pennies while it sleeps and a software agent, not a human, is the thing that wakes it.

And agents are what promoted the old operations question — persist the machine or rebuild it — into a product decision. It used to be a matter of how you preferred to run your servers. Now it is a bet about what your users' agents accumulate and what they can afford to lose. **The primitives are commodity; the choice between bets about what persists is the new thing.**

## Keep the brain outside the runtime

There is one pattern that makes *either* bet safe, and it is the same conclusion the companion piece reaches from the memory side. **Keep the real state outside the runtime, in a portable, rebuildable store.**

For AgentsFS that store is a set of Git-backed knowledge bases. The durable facts — sources, decisions, project context, distilled conclusions — live in plain files in Git, not on any particular machine's disk. That is what lets the workspace reconcile on every turn: the checkout is disposable because the Git remote is canonical.

It is also what makes a dormant sandbox re-cloning from scratch a non-event rather than a data-loss risk, and what would let me delete and reprovision a sprite without a second thought.

That is the whole trick, and it cuts both ways.

When the brain is portable, the runtime can be cattle: a sprite you can reprovision, a sandbox you can rebuild, a machine you can restamp, because none of them hold anything you cannot regenerate. When the brain is *not* portable — when the state that matters is trapped on a running machine with no recipe to recreate it — every runtime becomes a pet, no matter how disposable the underlying primitive was designed to be.

A sandbox you start hand-patching is a pet. A sprite whose durable state lives safely in Git is not.

![The durable brain — a git-backed knowledge base — held outside the runtime, letting the sprite, the sandbox, and the machine all be treated as cattle](/images/blog/fly-machines-sprites-and-session-sandboxes/10-portable-brain-cattle-runtimes.png)

So the sprite lesson generalizes past sprites. Persistence is a feature worth paying for, but the bill is a convergence story, and the cheapest way to keep that bill small is to make sure the thing worth persisting never depends on any single computer staying alive. Give the agent a portable brain, and you get to treat its computer — whichever of these three you choose — as something you can always throw away and stamp again.
