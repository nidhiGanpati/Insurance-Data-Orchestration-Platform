const config = require("../../config/local.json");

  function renderLogin(errorMessage = "") {
    return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Insurance Orchestration Demo - Login</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0b1220;color:#e8eefc;margin:0}
      .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
      .card{width:100%;max-width:420px;background:#121a2b;border:1px solid #24304a;border-radius:14px;padding:22px;box-shadow:0 10px 40px rgba(0,0,0,.35)}
      h1{font-size:18px;margin:0 0 6px}
      p{margin:0 0 16px;color:#b9c6e6;font-size:13px;line-height:1.35}
      label{display:block;font-size:12px;margin:12px 0 6px;color:#cfe0ff}
      input{width:100%;padding:10px 12px;border-radius:10px;border:1px solid #2a3756;background:#0b1220;color:#e8eefc;outline:none}
      input:focus{border-color:#6da7ff}
      button{width:100%;margin-top:14px;background:#6da7ff;border:none;color:#071024;font-weight:700;padding:11px 12px;border-radius:10px;cursor:pointer}
      .err{margin:10px 0 0;color:#ffb0b0;font-size:12px}
      .hint{margin-top:12px;color:#9fb3dd;font-size:12px}
      code{background:#0b1220;border:1px solid #24304a;padding:2px 6px;border-radius:8px}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>Insurance Data Orchestration Platform (Demo)</h1>
        <p>Login to access the demo dashboard. (This is a local demo app — no external API keys needed.)</p>
        <form method="POST" action="/login">
          <label for="username">Username</label>
          <input id="username" name="username" autocomplete="username" required />
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required />
          <button type="submit">Sign in</button>
          ${errorMessage ? `<div class="err">${errorMessage}</div>` : ""}
        </form>
        <div class="hint">
          Default demo login:<br/>
          <code>${config.DEMO_USERNAME}</code> / <code>${config.DEMO_PASSWORD}</code>
        </div>
      </div>
    </div>
  </body>
  </html>`;
  }

  function requireAuth(req, res, next) {
    if (req.session && req.session.user) return next();
    return res.redirect("/login");
  }

  function getLogin(req, res) {
    res.status(200).send(renderLogin());
  }

  function postLogin(req, res) {
    const { username, password } = req.body || {};
    const ok = username === config.DEMO_USERNAME && password === config.DEMO_PASSWORD;
    if (!ok) return res.status(401).send(renderLogin("Invalid username or password."));
    req.session.user = username;
    return res.redirect("/dashboard");
  }

  function getDashboard(req, res) {
    res.status(200).send(`<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Demo Dashboard</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0b1220;color:#e8eefc;margin:0}
      .top{padding:18px 22px;border-bottom:1px solid #24304a;background:#0e1630;display:flex;align-items:center;justify-content:space-between}
      .wrap{padding:22px;max-width:980px;margin:0 auto}
      .card{background:#121a2b;border:1px solid #24304a;border-radius:14px;padding:18px;margin:14px 0}
      h1{font-size:18px;margin:0}
      h2{font-size:15px;margin:0 0 8px}
      p{margin:0 0 10px;color:#b9c6e6}
      a{color:#6da7ff;text-decoration:none}
      code,pre{background:#0b1220;border:1px solid #24304a;border-radius:12px}
      pre{padding:12px;overflow:auto}
      .pill{display:inline-block;background:#0b1220;border:1px solid #24304a;padding:4px 10px;border-radius:999px;font-size:12px;color:#cfe0ff}
      .row{display:flex;gap:10px;flex-wrap:wrap}
    </style>
  </head>
  <body>
    <div class="top">
      <div>
        <h1>✅ Demo is running</h1>
        <div class="pill">Logged in as: ${req.session.user}</div>
      </div>
      <div>
        <a href="/logout">Logout</a>
      </div>
    </div>

    <div class="wrap">
      <div class="card">
        <h2>Health checks</h2>
        <div class="row">
          <div class="pill"><a href="/health">App Health</a></div>
          <div class="pill"><a href="http://localhost:5601" target="_blank" rel="noreferrer">Kibana</a></div>
          <div class="pill"><a href="http://localhost:15672" target="_blank" rel="noreferrer">RabbitMQ UI</a></div>
          <div class="pill"><a href="http://localhost:9200/_cluster/health" target="_blank" rel="noreferrer">Elasticsearch Health</a></div>
        </div>
        <p style="margin-top:10px">If these open, your Docker services are good.</p>
      </div>

      <div class="card">
        <h2>Optional API (for demo/testing)</h2>
        <p>This project also exposes a small REST API (protected by this login session).</p>
        <pre><code>GET  /api/health
POST /api/plan
GET  /api/plan/:id</code></pre>
        <p>Example PowerShell (after you are logged in in the browser):</p>
        <pre><code>Invoke-RestMethod http://127.0.0.1:3000/api/health</code></pre>
      </div>

      <div class="card">
        <h2>Demo login details (fixed)</h2>
        <pre><code>Username: ${config.DEMO_USERNAME}
Password: ${config.DEMO_PASSWORD}</code></pre>
        <p>You can change them in <code>config/local.json</code> anytime.</p>
      </div>
    </div>
  </body>
  </html>`);
  }

  function logout(req, res) {
    if (!req.session) return res.redirect("/login");
    req.session.destroy(() => res.redirect("/login"));
  }

  module.exports = {
    requireAuth,
    getLogin,
    postLogin,
    getDashboard,
    logout
  };
