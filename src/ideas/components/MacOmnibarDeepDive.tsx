type DiagramProps = {
  src: string;
  title: string;
  caption: string;
  alt: string;
};

function Diagram({ src, title, caption, alt }: DiagramProps) {
  return (
    <figure className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-3 sm:p-5">
      <a href={src} target="_blank" rel="noreferrer" className="block">
        <img src={src} alt={alt} className="w-full rounded-sm border border-[color:var(--color-rule)]" />
      </a>
      <figcaption className="pt-4 text-sm text-[color:var(--color-ink-mute)]">
        <strong className="text-[color:var(--color-ink)]">{title}</strong>
        <span className="mx-2 text-[color:var(--color-rule)]">/</span>
        {caption}
      </figcaption>
    </figure>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-3 mt-10">
      {children}
    </h3>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-4 border border-[color:var(--color-rule)] bg-[#1a1a1a] text-[#f6f2ea] rounded-sm overflow-hidden">
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

const swiftHotkeyAndPanel = `import SwiftUI
import AppKit
import KeyboardShortcuts

extension KeyboardShortcuts.Name {
  static let summonOmnibar = Self("summonOmnibar",
    default: .init(.space, modifiers: [.command, .shift]))
}

final class OmnibarPanel: NSPanel {
  override var canBecomeKey: Bool { true }
  override var canBecomeMain: Bool { false }

  init(rootView: some View) {
    super.init(
      contentRect: NSRect(x: 0, y: 0, width: 720, height: 84),
      styleMask: [.borderless, .nonactivatingPanel, .fullSizeContentView],
      backing: .buffered, defer: false
    )
    isFloatingPanel = true
    level = .statusBar
    isMovableByWindowBackground = true
    backgroundColor = .clear
    hasShadow = true
    hidesOnDeactivate = true
    collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .transient]
    contentView = NSHostingView(rootView: rootView)
  }
}

@MainActor
final class OmnibarController {
  private var panel: OmnibarPanel?

  func install() {
    KeyboardShortcuts.onKeyUp(for: .summonOmnibar) { [weak self] in
      self?.toggle()
    }
  }

  private func toggle() {
    if let panel, panel.isVisible { panel.orderOut(nil); return }
    let panel = panel ?? OmnibarPanel(rootView: OmnibarView())
    self.panel = panel
    centerNearTop(panel)
    panel.makeKeyAndOrderFront(nil)
    NSApp.activate(ignoringOtherApps: false)
  }

  private func centerNearTop(_ panel: NSPanel) {
    guard let screen = NSScreen.main else { return }
    let f = screen.visibleFrame
    let w = panel.frame.width
    panel.setFrameTopLeftPoint(
      NSPoint(x: f.midX - w / 2, y: f.maxY - 160)
    )
  }
}`;

const swiftScreenCapture = `import ScreenCaptureKit
import AppKit

@available(macOS 14.0, *)
enum ActiveWindowCapture {
  // One-shot capture of the frontmost window of the focused app.
  static func capture() async throws -> NSImage {
    let content = try await SCShareableContent.excludingDesktopWindows(
      false, onScreenWindowsOnly: true
    )

    let frontPID = NSWorkspace.shared.frontmostApplication?.processIdentifier
    guard let window = content.windows.first(where: { w in
      w.owningApplication?.processID == frontPID && w.isOnScreen
    }) else { throw CaptureError.noActiveWindow }

    let filter = SCContentFilter(desktopIndependentWindow: window)
    let config = SCStreamConfiguration()
    config.width = Int(window.frame.width * 2)
    config.height = Int(window.frame.height * 2)
    config.showsCursor = false

    let cg = try await SCScreenshotManager.captureImage(
      contentFilter: filter, configuration: config
    )
    return NSImage(cgImage: cg, size: window.frame.size)
  }

  enum CaptureError: Error { case noActiveWindow }
}

// Screen Recording permission is required. Prompt only when the user
// first attaches screen context, not at launch.`;

const tsAdapter = `// AgentAdapter: normalized session protocol the bar talks to.
// Adapter implementations live in the helper daemon (Node or Swift).

export type AgentEvent =
  | { kind: "token"; text: string }
  | { kind: "tool_call"; name: string; input: unknown }
  | { kind: "tool_result"; name: string; output: unknown }
  | { kind: "error"; message: string }
  | { kind: "done"; usage?: { input: number; output: number } };

export interface ContextBundle {
  screenshotPng?: Uint8Array;
  selectedText?: string;
  axTree?: unknown;       // structured UI metadata
  activeApp?: string;
}

export interface AgentSession {
  id: string;
  send(message: string, ctx?: ContextBundle): AsyncIterable<AgentEvent>;
  cancel(): Promise<void>;
  transcript(): Promise<AgentEvent[]>;
}

export interface AgentAdapter {
  name: string;                 // "openclaw" | "claude-code" | ...
  start(): Promise<AgentSession>;
}

// --- OpenClaw-style adapter (endpoints are placeholders) ---
export class OpenClawAdapter implements AgentAdapter {
  name = "openclaw";
  constructor(private base: URL, private token: string) {}

  async start(): Promise<AgentSession> {
    const ws = new WebSocket(\`\${this.base.toString()}/v1/session\`, {
      headers: { Authorization: \`Bearer \${this.token}\` },
    } as any);
    const id = crypto.randomUUID();

    return {
      id,
      async *send(message, ctx) {
        ws.send(JSON.stringify({
          type: "user.message",
          session: id,
          text: message,
          context: ctx ? encodeContext(ctx) : undefined,
        }));
        for await (const raw of iterateMessages(ws)) {
          const ev = JSON.parse(raw) as AgentEvent;
          yield ev;
          if (ev.kind === "done" || ev.kind === "error") return;
        }
      },
      async cancel() {
        ws.send(JSON.stringify({ type: "session.cancel", session: id }));
      },
      async transcript() { /* read from local SQLite */ return []; },
    };
  }
}`;

const mcpClient = `// Optional: connect the daemon to MCP servers for tools and sources.
// Exposes things like Linear, Drive, a screenshot OCR tool, etc.

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function connectStdio(command: string, args: string[] = []) {
  const transport = new StdioClientTransport({ command, args });
  const client = new Client(
    { name: "mac-omnibar", version: "0.1.0" },
    { capabilities: { tools: {}, resources: {} } }
  );
  await client.connect(transport);
  return client;
}

export async function connectHttp(url: URL, token?: string) {
  const transport = new StreamableHTTPClientTransport(url, {
    requestInit: token ? { headers: { Authorization: \`Bearer \${token}\` } } : {},
  });
  const client = new Client(
    { name: "mac-omnibar", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );
  await client.connect(transport);
  const tools = await client.listTools();
  return { client, tools };
}`;

const swiftAXContext = `import ApplicationServices
import AppKit

struct AXContext: Codable {
  var selectedText: String?
  var focusedRole: String?
  var focusedTitle: String?
  var activeApp: String?
}

enum AccessibilityContext {
  static func collect() -> AXContext {
    let app = NSWorkspace.shared.frontmostApplication?.localizedName
    let system = AXUIElementCreateSystemWide()
    var focused: CFTypeRef?

    guard AXUIElementCopyAttributeValue(
      system,
      kAXFocusedUIElementAttribute as CFString,
      &focused
    ) == .success else { return AXContext(activeApp: app) }

    let element = focused as! AXUIElement
    return AXContext(
      selectedText: stringAttr(element, kAXSelectedTextAttribute),
      focusedRole: stringAttr(element, kAXRoleAttribute),
      focusedTitle: stringAttr(element, kAXTitleAttribute),
      activeApp: app
    )
  }

  private static func stringAttr(_ element: AXUIElement, _ attr: String) -> String? {
    var value: CFTypeRef?
    let err = AXUIElementCopyAttributeValue(element, attr as CFString, &value)
    return err == .success ? value as? String : nil
  }
}

// Fallbacks worth testing per app:
// 1. kAXSelectedTextRangeAttribute + kAXStringForRangeParameterizedAttribute
// 2. temporary Cmd-C with pasteboard restore
// 3. local OCR over the ScreenCaptureKit image`;

const sqliteSchema = `-- Local-first transcript and consent log.
-- Keep payload blobs optional and aggressively expirable.

create table sessions (
  id text primary key,
  adapter text not null,
  title text,
  created_at text not null,
  last_event_at text not null
);

create table events (
  id integer primary key autoincrement,
  session_id text not null references sessions(id),
  kind text not null,           -- user | token | tool_call | tool_result | error | done
  body_json text not null,
  created_at text not null
);

create table context_bundles (
  id text primary key,
  session_id text not null references sessions(id),
  consented_at text not null,
  active_app text,
  selected_text text,
  ax_json text,
  screenshot_path text,         -- encrypted file on disk, not DB blob
  expires_at text
);

create index events_session_idx on events(session_id, id);
create index context_expiry_idx on context_bundles(expires_at);`;

export function MacOmnibarDeepDive() {
  return (
    <section className="mb-14">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] mb-4 editorial-rule pb-3">
        Deep dive — building the bar
      </h2>

      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          This deep dive sketches an implementation path for the omnibar. The choices below
          prioritise a native macOS feel over portability: the bar has to behave like Spotlight,
          which mostly rules out Electron-style shells. The intelligence stays in a swappable
          backend, so the surface can outlive any single harness.
        </p>
      </div>

      <SubLabel>Architecture at a glance</SubLabel>
      <div className="grid gap-6 mb-2">
        <Diagram
          src="/diagrams/mac-omnibar-architecture.svg"
          title="System architecture"
          caption="Native shell, helper daemon, adapter layer, and a normalized session protocol to pluggable harnesses."
          alt="Architecture diagram of the Mac omnibar: native shell on the left, helper daemon in the middle, and a stack of agent harnesses on the right connected through adapters."
        />
        <Diagram
          src="/diagrams/mac-omnibar-event-flow.svg"
          title="Request lifecycle"
          caption="From hotkey to streamed response to durable side panel. Context capture is opt-in per request."
          alt="Event flow diagram for the Mac omnibar showing hotkey, panel, optional context capture, dispatch, harness, stream, render, action, persist, and dismiss."
        />
        <Diagram
          src="/diagrams/mac-omnibar-context-pipeline.svg"
          title="Context pipeline"
          caption="A privacy-first capture path: permission gate, inspectable bundle, minimization, then adapter dispatch."
          alt="Context capture pipeline diagram showing permission gate, signal collection, preview, redaction, normalized context bundle, and adapter dispatch."
        />
      </div>

      <SubLabel>Why a native shell, not Electron</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          A Spotlight-style bar has to do things web shells cannot do cleanly: a borderless panel
          that becomes key without stealing app focus, instant cold-start, system-wide hotkey on a
          sandboxed app, and access to ScreenCaptureKit and Accessibility APIs without a wrapper
          layer in between. SwiftUI hosted inside an <code>NSPanel</code> gives all of that and
          composes well with AppKit for the parts SwiftUI still does not own.
        </p>
        <p>
          Raycast's later architecture is a useful reference: a native host with a web layer only
          where the extension ecosystem makes it worthwhile. For an MVP the right move is to skip
          the web layer entirely and revisit it only if cross-platform or a third-party extension
          surface becomes a goal.
        </p>
      </div>

      <SubLabel>Global hotkey + NSPanel skeleton (Swift)</SubLabel>
      <CodeBlock language="Swift" code={swiftHotkeyAndPanel} />

      <SubLabel>One-shot active-window capture (Swift)</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          On macOS 14+ a single window snapshot is one call to
          <code> SCScreenshotManager</code>. On 12.3 / 13 the same outcome takes a short-lived
          <code> SCStream</code> that grabs one frame and shuts down. Pair the bitmap with a
          structured AX dump (focused element, selected text, role tree) so the harness can reason
          about the window without OCR.
        </p>
      </div>
      <CodeBlock language="Swift" code={swiftScreenCapture} />

      <SubLabel>Structured UI context (Swift Accessibility)</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The screenshot is only half the context. Accessibility gives the bar a cheap structured
          read of the focused element, selected text, role, title, and active application. That is
          often more useful than pixels and much smaller to send. The implementation should treat
          AX as opportunistic: many apps expose good data, some expose nothing, and browsers may
          need a range-based or clipboard-preserving fallback.
        </p>
      </div>
      <CodeBlock language="Swift" code={swiftAXContext} />

      <SubLabel>Context minimization policy</SubLabel>
      <div className="grid gap-4 sm:grid-cols-2 mt-2 mb-2">
        {[
          {
            title: 'Default: no capture',
            body: 'The hotkey opens a blank prompt. Screen context is attached only when the user toggles it or uses a command that implies it, such as “explain this screen”.',
          },
          {
            title: 'Preview before send',
            body: 'Show a thumbnail, selected-text chip, and active-app label before dispatch. Let the user remove the screenshot while keeping selected text.',
          },
          {
            title: 'Minimize the payload',
            body: 'Downscale images, strip metadata, cap byte size, and prefer AX text over screenshot bytes whenever the text is enough.',
          },
          {
            title: 'Expire aggressively',
            body: 'Store transcript events locally, but make raw screenshot payloads opt-in, encrypted, and expirable. Durable memory should be a reviewed summary, not raw screen data.',
          },
        ].map((item) => (
          <div key={item.title} className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-2">
              {item.title}
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{item.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Adapter layer (TypeScript)</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          Adapters live in the local helper daemon and present one normalized session protocol to
          the bar. The OpenClaw endpoints below are placeholders — the real wire format will track
          whatever the harness exposes — but the shape of the contract is what matters: send a
          message with optional context, receive a stream of typed events, cancel cleanly.
        </p>
      </div>
      <CodeBlock language="TypeScript" code={tsAdapter} />

      <SubLabel>Optional MCP tool / source connectors</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          For this product MCP is most useful as a way to plug extra tools and sources into the
          daemon — calendars, docs, an OCR helper — rather than as the primary chat transport. If a
          harness later exposes chat itself over MCP, the same client can carry it.
        </p>
      </div>
      <CodeBlock language="TypeScript" code={mcpClient} />

      <SubLabel>Local storage schema</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The first durable store can be SQLite: sessions, event stream, and context bundle metadata.
          Keep large screenshots as encrypted files referenced by path, not as database blobs. This
          makes cleanup and retention rules simple, and keeps transcripts readable even after raw
          context expires.
        </p>
      </div>
      <CodeBlock language="SQL" code={sqliteSchema} />

      <SubLabel>Packaging and process model</SubLabel>
      <div className="space-y-5 text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
        <p>
          The cleanest product split is a small Swift app plus a warm helper daemon. The Swift app
          owns hotkey, panel, permissions, screen capture, and the side panel. The daemon owns
          adapters, MCP clients, stream normalization, transcript indexing, and optional background
          sync. Secrets live in Keychain; the daemon should expose a localhost-only authenticated
          channel to the app.
        </p>
        <p>
          Distribution probably starts as a signed and notarized direct download. App Store
          sandboxing can be revisited later, but Accessibility automation, local helper processes,
          stdio adapters, and developer-tool integrations are exactly where the Mac App Store path
          tends to get constraining.
        </p>
      </div>

      <SubLabel>Implementation plan</SubLabel>
      <div className="grid gap-4 sm:grid-cols-3 mt-2">
        {[
          {
            phase: 'Phase 1 — MVP',
            body:
              'Native SwiftUI bar, helper daemon, OpenClaw HTTP/WebSocket adapter, per-request screenshot, local SQLite transcript. Single hotkey, single backend, no settings UI beyond a recorder and a base URL.',
          },
          {
            phase: 'Phase 2 — Harness plurality',
            body:
              'Adapters for Claude Code and Codex over stdio, MCP source connectors, side panel as a tear-off NSWindow, basic action surface (copy, save, open in editor), Keychain-backed multi-account support.',
          },
          {
            phase: 'Phase 3 — Workspace surface',
            body:
              'Pinned workspaces, candidate-memory review, multi-harness routing rules, optional connector to a portable memory layer, lightweight extension hooks for third-party verbs.',
          },
        ].map((p) => (
          <div
            key={p.phase}
            className="border border-[color:var(--color-rule)] bg-[#fffaf0] p-5"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] mb-2">
              {p.phase}
            </div>
            <p className="text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]">{p.body}</p>
          </div>
        ))}
      </div>

      <SubLabel>Risks</SubLabel>
      <ul className="space-y-3 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)] list-disc pl-5 marker:text-[color:var(--color-ink-mute)]">
        <li>
          <strong className="text-[color:var(--color-ink)]">Permission fatigue.</strong> Screen
          Recording, Accessibility, and Input Monitoring are three separate prompts. Defer each
          until the feature that needs it is invoked.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Sandbox vs. capability.</strong> Mac
          App Store distribution restricts what the helper daemon can do. A notarized direct
          download may be the right path; revisit MAS only once the surface is stable.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Adapter churn.</strong> Harness wire
          formats will shift. Keep adapters small and versioned, and resist leaking
          adapter-specific concepts into the bar.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Latency budget.</strong> Cold-start
          must feel like Spotlight. Keep the daemon warm, render the panel before the first token,
          and treat capture as parallel work.
        </li>
        <li>
          <strong className="text-[color:var(--color-ink)]">Privacy surface.</strong> A bar that
          can see the screen is a high-trust object. Default to per-request capture, show what was
          captured before sending, and keep transcripts local by default.
        </li>
      </ul>

      <SubLabel>Open decisions</SubLabel>
      <ul className="space-y-3 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)] list-disc pl-5 marker:text-[color:var(--color-ink-mute)]">
        <li>Helper daemon language — Swift keeps one stack, Node simplifies the MCP and adapter ecosystem.</li>
        <li>Whether to ship a side panel in v1 or only the bar plus a transcript window.</li>
        <li>How to route between adapters — explicit verb (<code>/cc</code>, <code>/oc</code>) versus learned routing.</li>
        <li>Whether voice input belongs in v1 or as a Phase 2 affordance.</li>
        <li>Whether to expose a tiny extension API early, or hold until the core verbs stabilise.</li>
      </ul>
    </section>
  );
}
