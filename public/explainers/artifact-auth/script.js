const flows = {
  session: {
    kind: 'Human login',
    title: 'Browser session',
    plainTitle: 'A cookie is the browser pass.',
    plainText:
      'After login, the server sets a random session cookie. The browser automatically sends it back to your site because cookies are origin-bound browser storage. The Worker hashes it, looks up the session in D1, and knows which user is using the dashboard. Because cookies are automatic, CSRF matters; because HttpOnly hides the cookie from JS, XSS has a harder time stealing it.',
    request: `GET /dashboard
Cookie: __Host-session=sess_9pL...

Worker:
1. hash cookie
2. find session in D1
3. load user_id
4. check session expiry
5. check CSRF token for writes
6. render dashboard`,
    steps: [
      ['User', 'Clicks magic link or OAuth login', 'Proves identity'],
      ['Worker', 'Creates session row', 'Stores only session hash'],
      ['Browser', 'Stores HttpOnly cookie', 'JS cannot read it'],
      ['Dashboard', 'Future requests include cookie', 'User is logged in'],
    ],
  },
  cli: {
    kind: 'Tool login',
    title: 'CLI deploy token',
    plainTitle: 'The CLI should not steal the browser cookie.',
    plainText:
      'The CLI opens a browser login once. After the user approves, the server mints a scoped deploy token. A deploy token is a bearer credential: possession is enough to use it. The CLI stores the raw token in the OS keychain; the server stores only a hash so a database leak does not reveal usable tokens.',
    request: `POST /api/deploy
Authorization: Bearer art_live_B7k...

Token row:
name = "Akshay MacBook"
scopes = ["artifact:read", "artifact:write"]
expires_at = 2026-12-31
revoked_at = null`,
    steps: [
      ['CLI', 'Runs artifact login', 'Opens browser'],
      ['User', 'Approves device', 'Normal web session'],
      ['Worker', 'Mints deploy token', 'Hash stored in D1'],
      ['CLI', 'Stores raw token in keychain', 'Uses bearer auth'],
    ],
  },
  mcp: {
    kind: 'Local agent tool',
    title: 'Local MCP',
    plainTitle: 'Local MCP can reuse CLI auth.',
    plainText:
      'A stdio MCP server runs as a local process on the user machine. Since it can see local files, it can package generated HTML and call the hosted API with the same deploy token as the CLI. This inherits local-machine trust: if the user installed the MCP server, they are letting that local process read selected project files and publish on their behalf.',
    request: `Codex -> local stdio MCP
tool: publish_artifact
files: ./dist

local MCP:
1. read files
2. validate manifest
3. load token from keychain
4. POST /api/deploy`,
    steps: [
      ['Agent', 'Calls publish_artifact', 'MCP tool invocation'],
      ['Local MCP', 'Reads generated files', 'Filesystem access'],
      ['Core package', 'Builds artifact bundle', 'Same code as CLI'],
      ['Worker API', 'Validates token and stores files', 'R2 + D1'],
    ],
  },
  share: {
    kind: 'Viewer access',
    title: 'Private link',
    plainTitle: 'A private link is a secret view token.',
    plainText:
      'Private-link artifacts are not protected by the viewer having an account. They are protected by an unguessable share token in the URL. Treat it as bearer access in a link: anyone who has it can view. That is convenient, but not as strong as requiring login. If the link leaks, revoke it and mint a new one.',
    request: `GET /share/sh_8Vq3...

Worker:
1. hash share token
2. find artifact_share row
3. check revoked_at and expires_at
4. stream artifact

No viewer account required.`,
    steps: [
      ['Owner', 'Creates private link', 'Secret token minted'],
      ['Friend', 'Opens share URL', 'No login required'],
      ['Worker', 'Checks share token hash', 'Revoked or expired?'],
      ['Artifact', 'Streams page/card/widget', 'Read only'],
    ],
  },
  remote: {
    kind: 'Hosted agent',
    title: 'Remote MCP later',
    plainTitle: 'Remote MCP needs OAuth because it is not on your machine.',
    plainText:
      'A hosted MCP server serving many users needs delegated authorization. The agent client redirects the user to your authorization server, the user approves scopes, and the client receives a short-lived access token. The artifact API validates issuer, audience, expiration, and scopes before letting the remote MCP publish.',
    request: `OAuth / OIDC shape:
1. client creates code_verifier
2. redirects user to authorize
3. receives authorization_code
4. exchanges code + verifier
5. gets access_token

Then:
Authorization: Bearer eyJ...`,
    steps: [
      ['MCP client', 'Starts OAuth + PKCE', 'No client secret needed'],
      ['User', 'Approves scopes', 'artifact:write'],
      ['Auth server', 'Issues access token', 'Short lived'],
      ['Remote MCP', 'Calls API with token', 'Audience + scopes checked'],
    ],
  },
};

const tabs = document.querySelectorAll('.flow-tab');
const diagram = document.getElementById('diagram');
const flowKind = document.getElementById('flowKind');
const flowTitle = document.getElementById('flowTitle');
const plainTitle = document.getElementById('plainTitle');
const plainText = document.getElementById('plainText');
const requestBox = document.getElementById('requestBox');

function setFlow(key) {
  const flow = flows[key];
  if (!flow) return;

  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.flow === key);
  });

  flowKind.textContent = flow.kind;
  flowTitle.textContent = flow.title;
  plainTitle.textContent = flow.plainTitle;
  plainText.textContent = flow.plainText;
  requestBox.textContent = flow.request;

  diagram.innerHTML = flow.steps
    .map(([label, title, note], index) => `
      <div class="flow-node ${index === 2 ? 'active' : ''}">
        <b>${label}</b>
        <strong>${title}</strong>
        <span>${note}</span>
      </div>
    `)
    .join('');
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setFlow(tab.dataset.flow));
});

setFlow('session');
