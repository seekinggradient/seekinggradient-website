function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-3 mt-10">
      {children}
    </h3>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-4 border border-[color:var(--color-rule)] bg-[#171717] text-[#f6f2ea] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#bdb8a8] border-b border-[#3b3a36] font-mono">
        <span>{language}</span>
        <span aria-hidden>·</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-[1.65] font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const manifestExample = `{
  "title": "Morgan Hill Open Houses",
  "description": "A Saturday route and shortlist for home tours.",
  "views": {
    "page": { "entry": "index.html" },
    "card": { "entry": "card.html", "height": 280 },
    "widget": { "entry": "widget.html", "height": 220 }
  },
  "permissions": {
    "network": false,
    "storage": "local",
    "externalLinks": true
  }
}`;

const mcpTools = `publish_artifact({
  slug: "home-search-open-houses",
  title: "Morgan Hill Open Houses",
  files: ["index.html", "card.html", "assets/map.png"],
  visibility: "private-link"
})

// returns
{
  url: "https://creator.example.com/home-search-open-houses",
  cardUrl: "https://creator.example.com/home-search-open-houses?view=card",
  version: "v7"
}`;

const cliSketch = `$ artifact login
$ artifact publish ./dist \\
    --slug home-search-open-houses \\
    --title "Morgan Hill Open Houses" \\
    --visibility private-link

Published v7
https://creator.example.com/home-search-open-houses`;

const corePackageSketch = `packages/
  artifact-core/       # validation, packaging, API client, manifests
  artifact-cli/        # commander-style CLI wrapper around core
  artifact-mcp/        # MCP tools that call the same core operations
  artifact-worker/     # Cloudflare Worker API implementation

// CLI and MCP both call this:
publishArtifact({
  workspace,
  files,
  manifest,
  visibility,
  auth
})`;

const workerSketch = `export default {
  async fetch(request, env) {
    const route = parseArtifactRoute(request.url);

    if (route.kind === "deploy") {
      return deployArtifact(request, env.DB, env.ARTIFACTS);
    }

    const artifact = await env.DB
      .prepare("select * from artifacts where owner = ? and slug = ?")
      .bind(route.owner, route.slug)
      .first();

    const file = await env.ARTIFACTS.get(artifact.current_key);
    return new Response(file.body, {
      headers: artifactHeaders(artifact)
    });
  }
}`;

const mcpServerSketch = `const server = new McpServer({
  name: "html-artifacts",
  version: "0.1.0"
});

server.tool("publish_artifact", schema, async (input, ctx) => {
  const result = await publishArtifact({
    files: input.files,
    manifest: input.manifest,
    visibility: input.visibility,
    auth: await authFromContext(ctx)
  });

  return {
    content: [{ type: "text", text: result.url }],
    structuredContent: result
  };
});`;

const authDataModel = `users
  id, email, name, created_at

namespaces
  id, user_id, handle, custom_domain?, created_at

sessions
  id_hash, user_id, expires_at, last_seen_at

deploy_tokens
  id, token_hash, user_id, name, scopes, expires_at, revoked_at

artifacts
  id, namespace_id, slug, visibility, current_version_id

artifact_acl
  artifact_id, subject_type, subject_id, permission`;

const authCheckSketch = `async function requireDeployAuth(request, env) {
  const token = parseBearerToken(request);
  if (!token) throw new Unauthorized();

  const tokenHash = await sha256(token);
  const row = await env.DB
    .prepare("select * from deploy_tokens where token_hash = ?")
    .bind(tokenHash)
    .first();

  if (!row || row.revoked_at || isExpired(row.expires_at)) {
    throw new Unauthorized();
  }

  requireScope(row.scopes, "artifact:write");
  return { userId: row.user_id, tokenId: row.id };
}`;

const viewModes = [
  {
    name: 'Page',
    role: 'Use it',
    body: 'The full single-page app: route planner, explainer, dashboard, calculator, game, or report.',
  },
  {
    name: 'Card',
    role: 'Encounter it',
    body: 'A compact live view for a profile feed, collection, search result, or inbox-like stream.',
  },
  {
    name: 'Widget',
    role: 'Compose it',
    body: 'A small embeddable surface that can sit inside another artifact, dashboard, or profile.',
  },
  {
    name: 'Preview',
    role: 'Share it',
    body: 'A static image and metadata bundle for links, messaging, search, and archival browsing.',
  },
];

const platformLayers = [
  {
    title: 'Namespace',
    body: 'Every user gets a durable address and a profile surface: username.domain.com plus artifact slugs below it.',
  },
  {
    title: 'Artifact store',
    body: 'HTML, assets, metadata, and versions live together. Rollback and link stability are part of the product.',
  },
  {
    title: 'Sandbox',
    body: 'Artifacts render as plain web pages, but cards and widgets run inside constrained iframes with explicit permissions.',
  },
  {
    title: 'Agent API',
    body: 'A CLI or MCP gives agents one obvious target: publish, update, list, retrieve, archive.',
  },
];

const toolSurface = [
  {
    name: 'publish_artifact',
    body: 'Create a new artifact or first version from HTML files, assets, and optional manifest metadata.',
  },
  {
    name: 'update_artifact',
    body: 'Publish a new version for an existing slug while keeping the public URL stable.',
  },
  {
    name: 'list_artifacts',
    body: 'Return the user namespace inventory with title, slug, visibility, current version, and updated time.',
  },
  {
    name: 'get_artifact',
    body: 'Fetch metadata, manifest, current URLs, and optionally the source bundle for an artifact.',
  },
  {
    name: 'set_visibility',
    body: 'Move an artifact between private, private-link, unlisted, and public profile visibility.',
  },
  {
    name: 'rollback_artifact',
    body: 'Point the live URL back at a prior version without losing newer archived bundles.',
  },
  {
    name: 'generate_card_view',
    body: 'Ask the platform or agent to produce a compact card.html from the full artifact when one is missing.',
  },
  {
    name: 'delete_or_archive',
    body: 'Remove from the public surface while preserving an owner-visible archive and audit trail.',
  },
];

const sharedCoreModules = [
  {
    name: 'Packager',
    body: 'Walks a folder, normalizes paths, detects entry files, builds checksums, and rejects unsafe filenames.',
  },
  {
    name: 'Manifest',
    body: 'Parses optional metadata, applies defaults, validates view contracts, and records permissions.',
  },
  {
    name: 'API client',
    body: 'Handles auth, uploads, retries, progress, structured errors, and deploy-result formatting.',
  },
  {
    name: 'Policy',
    body: 'Centralizes size limits, file allowlists, visibility states, and sandbox permission rules.',
  },
];

const mcpDeploymentModes = [
  {
    mode: 'Local stdio',
    bestFor: 'Codex, Claude Desktop, local agents',
    body:
      'Ship an npm package that runs on the user machine, reads local files directly, stores a deploy token locally, and talks to the hosted Worker API. This is the fastest and most capable first MCP.',
  },
  {
    mode: 'Remote HTTP',
    bestFor: 'Browser agents and hosted agent platforms',
    body:
      'Host an MCP server endpoint with Streamable HTTP and OAuth-style authorization. It cannot read arbitrary local files, so uploads arrive as tool inputs, URLs, or temporary upload sessions.',
  },
  {
    mode: 'Provider-native',
    bestFor: 'Later marketplace distribution',
    body:
      'Wrap the same tool surface for specific agent ecosystems if they require manifests, registries, review, or hosted connector conventions.',
  },
];

const authSurfaces = [
  {
    name: 'Web dashboard',
    credential: 'Secure session cookie',
    body:
      'The user signs in with email magic link or OAuth. The browser receives an HttpOnly, Secure, SameSite session cookie. This is for dashboard/profile editing, not for agents.',
  },
  {
    name: 'CLI',
    credential: 'Scoped deploy token',
    body:
      'The CLI runs a browser login once, then stores a long-lived deploy token in the OS keychain. Token scopes decide what the CLI can do.',
  },
  {
    name: 'Local MCP',
    credential: 'Same deploy token',
    body:
      'The local stdio MCP server reuses the CLI auth store. It can read local files, package artifacts, and call the hosted API without needing separate user setup.',
  },
  {
    name: 'Remote MCP',
    credential: 'OAuth access token',
    body:
      'A hosted MCP server should use transport-level OAuth-style authorization. This is more complex, so it can wait until hosted agents need it.',
  },
];

const authFlows = [
  'User signs into web dashboard',
  'User claims namespace',
  'CLI opens browser login',
  'Dashboard mints scoped deploy token',
  'CLI stores token in keychain',
  'Local MCP reads token through shared core',
  'Worker validates token hash and scopes',
];

const visibilityModes = [
  {
    name: 'Private',
    body: 'Only the owner can open it. Good for drafts, personal dashboards, and artifacts with sensitive context.',
  },
  {
    name: 'Private link',
    body: 'Anyone with an unguessable share URL can open it. Good for spouse, friends, clients, or one-off planning.',
  },
  {
    name: 'Unlisted',
    body: 'The artifact has a stable URL but does not appear on the public profile timeline.',
  },
  {
    name: 'Public',
    body: 'The artifact appears on the profile, can be indexed, and can participate in feeds or discovery.',
  },
];

const authComplexity = [
  {
    title: 'Simple alpha',
    body: 'Use magic-link login plus personal deploy tokens. Store only hashed tokens in D1. Local CLI and MCP share the same token store.',
  },
  {
    title: 'Real SaaS',
    body: 'Add OAuth/social login, token rotation, per-device sessions, teams, audit logs, rate limits, and artifact-level access control.',
  },
  {
    title: 'Remote MCP',
    body: 'Add a proper OAuth flow for hosted MCP clients, token audience checks, consent screens, and shorter-lived access tokens.',
  },
];

const cloudflareStack = [
  {
    layer: 'Workers',
    role: 'Router + API',
    body: 'One edge Worker receives profile, artifact, asset, and deploy requests. Bindings give it scoped access to storage without shipping raw cloud credentials.',
  },
  {
    layer: 'D1',
    role: 'Catalog',
    body: 'SQL tables for users, namespaces, artifacts, versions, views, visibility, deploy tokens, and profile timeline events.',
  },
  {
    layer: 'R2',
    role: 'Artifact files',
    body: 'Object storage for index.html, card.html, widget.html, images, JS, CSS, generated screenshots, and archived versions.',
  },
  {
    layer: 'Queues',
    role: 'Background work',
    body: 'Async jobs for screenshot generation, abuse scanning, metadata extraction, card inference, link previews, and search indexing.',
  },
  {
    layer: 'Durable Objects',
    role: 'Coordination',
    body: 'Optional per-artifact or per-user coordinators for live previews, deploy locks, collaborative editing, and rate-limit buckets.',
  },
  {
    layer: 'Workers for Platforms',
    role: 'Later upgrade',
    body: 'If customers eventually deploy executable server-side code, dispatch namespaces become the official isolation path. Static HTML artifacts do not need this on day one.',
  },
];

const deployFlow = [
  'Agent calls deploy',
  'Worker authenticates token',
  'Manifest parsed',
  'Files written to R2',
  'Version rows written to D1',
  'Queue creates preview',
  'Stable URL returned',
];

const clientFlow = [
  'Human or agent chooses files',
  'Shared core builds package',
  'CLI or MCP calls core publish',
  'API client opens upload session',
  'Worker persists bundle and metadata',
  'CLI/MCP returns URLs and version',
];

const readFlow = [
  'Visitor opens URL',
  'Worker resolves namespace',
  'D1 finds live version',
  'R2 streams HTML/assets',
  'Sandbox headers applied',
  'Artifact renders',
];

const firstArtifacts = [
  'Trip companion pages for private sharing',
  'Interactive explainers for papers and concepts',
  'Decision apps for homes, purchases, travel, or planning',
  'Tiny calculators and trackers that become reusable widgets',
  'Agent-generated research reports with live tables and diagrams',
  'Lightweight prose posts that can still carry custom HTML',
];

function StackCard({ item }: { item: (typeof cloudflareStack)[number] }) {
  return (
    <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <h4 className="display text-3xl">{item.layer}</h4>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
          {item.role}
        </span>
      </div>
      <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{item.body}</p>
    </div>
  );
}

function FlowDiagram({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
      <h4 className="display text-3xl mb-5">{title}</h4>
      <ol className="grid gap-3">
        {steps.map((step, index) => (
          <li key={step} className="grid grid-cols-[auto_1fr] gap-3 items-center">
            <span className="font-mono text-[11px] text-[color:var(--color-ink-mute)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="border border-[color:var(--color-rule)] bg-[color:var(--color-paper)] px-4 py-3 text-[15px] text-[color:var(--color-ink-soft)]">
              {step}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CloudflareArchitectureDiagram() {
  return (
    <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-4 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr_0.8fr] items-stretch">
        <div className="grid gap-3">
          <DiagramNode title="Human" body="Dashboard, profile, collections" tone="paper" />
          <DiagramNode title="Agent" body="CLI or MCP publish tools" tone="paper" />
          <DiagramNode title="Visitor" body="Profile, card, widget, full page" tone="paper" />
        </div>

        <div className="grid gap-4">
          <div className="border-2 border-[color:var(--color-accent)] bg-[color:var(--color-paper)] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent)] mb-2">
              Cloudflare Worker
            </div>
            <h4 className="display text-4xl mb-3">Artifact gateway</h4>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">
              Routes usernames and slugs, handles deploy APIs, applies auth and sandbox policy, then
              streams the right HTML or asset.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <MiniNode title="Auth" />
            <MiniNode title="Routing" />
            <MiniNode title="Headers" />
          </div>
        </div>

        <div className="grid gap-3">
          <DiagramNode title="D1" body="Users, artifacts, versions, timeline" tone="warm" />
          <DiagramNode title="R2" body="HTML bundles, assets, screenshots" tone="warm" />
          <DiagramNode title="Queues" body="Preview, scanning, indexing jobs" tone="warm" />
        </div>
      </div>
    </div>
  );
}

function DiagramNode({ title, body, tone }: { title: string; body: string; tone: 'paper' | 'warm' }) {
  return (
    <div className={`border border-[color:var(--color-rule)] p-4 ${tone === 'warm' ? 'bg-[#f7ead9]' : 'bg-[color:var(--color-paper)]'}`}>
      <div className="display text-2xl mb-1">{title}</div>
      <p className="text-[14px] leading-[1.55] text-[color:var(--color-ink-soft)]">{body}</p>
    </div>
  );
}

function MiniNode({ title }: { title: string }) {
  return (
    <div className="border border-[color:var(--color-rule)] bg-[#171717] px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#f6f2ea]">
      {title}
    </div>
  );
}

export function HtmlArtifactsDeepDive() {
  return (
    <section className="mb-14">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
        Deep dive — the artifact primitive
      </h2>

      <div className="mb-12 border border-[color:var(--color-rule)] bg-[#fffaf0] p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-[0.65fr_0.35fr] md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-accent)] mb-5">
              Companion strategy
            </p>
            <h3 className="display text-3xl sm:text-4xl leading-tight">
              MadeWeb GTM and growth strategy
            </h3>
            <p className="mt-3 text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
              A richer companion page for product positioning, launch plan, pricing and packaging,
              domain-name notes, agent-first workflows, and modern generated product mockups.
            </p>
          </div>
          <a
            href="/ideas/agent-native-html-artifacts/gtm/index.html"
            className="inline-flex justify-center bg-[color:var(--color-ink)] px-4 py-3 text-sm font-semibold text-[#fffaf0] transition-colors hover:bg-[color:var(--color-accent)]"
          >
            Open GTM strategy
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-stretch mb-12">
        <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-accent)] mb-5">
              One object, many surfaces
            </p>
            <h3 className="display text-4xl sm:text-5xl leading-[1.02] mb-5">
              The post becomes a little piece of software.
            </h3>
            <p className="text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
              The clean abstraction is not a separate post, widget, embed, and app. It is one
              artifact that can present itself at different sizes. The platform preserves identity,
              provenance, permissions, and version history while leaving the center as plain HTML.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {viewModes.map((mode) => (
              <div key={mode.name} className="border border-[color:var(--color-rule)] bg-[color:var(--color-paper)] p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                  {mode.role}
                </div>
                <div className="mt-1 display text-2xl">{mode.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-3 sm:p-5">
          <img
            src="/mockups/specific/agent-native-artifact-feed.png"
            alt="Concept mockup of a personal artifact feed with deployed HTML pages, cards, and widgets."
            className="w-full h-full object-cover rounded-sm border border-[color:var(--color-rule)]"
          />
        </div>
      </div>

      <SubLabel>View contracts</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {viewModes.map((mode) => (
          <div key={mode.name} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h4 className="display text-3xl">{mode.name}</h4>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                {mode.role}
              </span>
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{mode.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Minimal artifact package</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The platform should avoid becoming a framework. The default artifact can be just an
          <code> index.html</code> file and assets. A manifest only adds metadata, view entries, and
          permissions. If it is missing, the service can infer a title, generate a screenshot, and
          serve the full page as the only view.
        </p>
      </div>
      <CodeBlock language="manifest.json" code={manifestExample} />

      <SubLabel>Agent-native publish surface</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The agent integration is the wedge. The experience should feel like giving an assistant a
          shelf on the web: publish this, update that, make it private, generate a card view, show me
          the URL. A CLI can serve developers, but MCP gives coding agents the natural tool shape.
        </p>
      </div>
      <CodeBlock language="MCP tool call" code={mcpTools} />

      <SubLabel>CLI and MCP: one implementation, two shells</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The CLI and MCP server should not become two products. They should be two adapters over the
          same publish core. The shared package owns file packaging, manifest validation, auth, API
          calls, retries, and result formatting. The CLI translates terminal flags into core calls.
          The MCP server translates tool invocations into the same core calls.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock language="CLI" code={cliSketch} />
        <CodeBlock language="shared packages" code={corePackageSketch} />
      </div>

      <SubLabel>Tool surface</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {toolSurface.map((tool) => (
          <div key={tool.name} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[12px] text-[color:var(--color-accent)] mb-2">
              {tool.name}
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{tool.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Shared core modules</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {sharedCoreModules.map((module) => (
          <div key={module.name} className="border border-[color:var(--color-rule)] bg-[color:var(--color-paper)] p-5">
            <h4 className="display text-3xl mb-2">{module.name}</h4>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{module.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>MCP server shape</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The first MCP should be local over stdio because coding agents are usually working with
          files on the user machine. The server can package a local folder, read generated HTML, and
          use a stored deploy token. A remote HTTP MCP is still valuable later, but it should treat
          file transfer as an explicit upload session rather than assuming it can see the user's
          filesystem.
        </p>
      </div>
      <CodeBlock language="MCP server sketch" code={mcpServerSketch} />

      <SubLabel>MCP deployment modes</SubLabel>
      <div className="grid gap-4 lg:grid-cols-3">
        {mcpDeploymentModes.map((mode) => (
          <div key={mode.mode} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-2">
              {mode.bestFor}
            </div>
            <h4 className="display text-3xl mb-3">{mode.mode}</h4>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{mode.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Client publish flow</SubLabel>
      <FlowDiagram title="CLI / MCP path" steps={clientFlow} />

      <SubLabel>Authentication model</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          Authentication can start simple if the product draws a clean line between humans, local
          tools, and remote agents. Humans use normal web sessions. The CLI and local MCP use scoped
          deploy tokens. Remote MCP uses OAuth later. The Worker is the one place that verifies every
          credential before touching D1 or R2.
        </p>
        <p>
          The practical rule: no agent ever receives the user's dashboard cookie. Agents get tokens
          with explicit scopes, names, expiration, and revocation.
        </p>
        <p>
          I made this concrete as a small companion artifact:{' '}
          <a
            href="/explainers/artifact-auth/index.html"
            className="link-underline text-[color:var(--color-accent)]"
          >
            an interactive auth walkthrough for this product
          </a>
          .
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {authSurfaces.map((surface) => (
          <div key={surface.name} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-2">
              {surface.credential}
            </div>
            <h4 className="display text-3xl mb-2">{surface.name}</h4>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{surface.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Login to deploy flow</SubLabel>
      <div className="grid gap-4 lg:grid-cols-2">
        <FlowDiagram title="Auth path" steps={authFlows} />
        <div className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
          <h4 className="display text-3xl mb-5">Visibility states</h4>
          <div className="grid gap-3">
            {visibilityModes.map((mode) => (
              <div key={mode.name} className="border border-[color:var(--color-rule)] bg-[color:var(--color-paper)] p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)] mb-1">
                  {mode.name}
                </div>
                <p className="text-[14px] leading-[1.55] text-[color:var(--color-ink-soft)]">{mode.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SubLabel>Auth tables and token check</SubLabel>
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock language="D1 auth tables" code={authDataModel} />
        <CodeBlock language="Worker token check" code={authCheckSketch} />
      </div>

      <SubLabel>How complicated is it?</SubLabel>
      <div className="grid gap-4 lg:grid-cols-3">
        {authComplexity.map((item) => (
          <div key={item.title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <h4 className="display text-3xl mb-3">{item.title}</h4>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{item.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Cloudflare architecture</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The day-one stack can be a normal SaaS built on Cloudflare, not a pile of Pages projects.
          A Worker becomes the gateway for both humans and agents. D1 stores the catalog. R2 stores
          the artifact bundles. Queues handle slow background tasks. Durable Objects and Workers for
          Platforms stay optional until the product needs live coordination or customer-supplied
          server-side code.
        </p>
      </div>
      <CloudflareArchitectureDiagram />

      <SubLabel>Cloudflare pieces</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {cloudflareStack.map((item) => (
          <StackCard key={item.layer} item={item} />
        ))}
      </div>

      <SubLabel>Deploy and read flows</SubLabel>
      <div className="grid gap-4 lg:grid-cols-2">
        <FlowDiagram title="Deploy path" steps={deployFlow} />
        <FlowDiagram title="Read path" steps={readFlow} />
      </div>

      <SubLabel>Worker shape</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The Worker does not need to understand React, Svelte, Tailwind, or any agent-specific
          build chain. It only needs to understand namespace routing, artifact metadata, object
          keys, visibility, and response policy. The artifact remains plain web software.
        </p>
      </div>
      <CodeBlock language="worker sketch" code={workerSketch} />

      <SubLabel>Platform layers</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {platformLayers.map((layer) => (
          <div key={layer.title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-2">
              {layer.title}
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{layer.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Early artifact types</SubLabel>
      <ul className="grid gap-3 sm:grid-cols-2 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
        {firstArtifacts.map((artifact) => (
          <li key={artifact} className="border border-[color:var(--color-rule)] bg-[color:var(--color-paper)] px-4 py-3">
            {artifact}
          </li>
        ))}
      </ul>

      <SubLabel>Risks</SubLabel>
      <ul className="space-y-3 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)] list-disc pl-5 marker:text-[color:var(--color-ink-mute)]">
        <li>
          <strong className="text-[color:var(--color-ink)]">Security.</strong> Random HTML needs a
          serious sandbox, conservative defaults, abuse reporting, and clear permission prompts.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Over-specification.</strong> Too much SDK
          turns the platform into another framework. The center should remain plain web files.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Cold-start culture.</strong> The profile
          feed only matters if publishing private and semi-private artifacts is already useful.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Platform policy.</strong> If built on a
          cloud provider, this should be a real SaaS with storage, moderation, and metering, not a
          backdoor resale of a personal hosting account.
        </li>
      </ul>
    </section>
  );
}
