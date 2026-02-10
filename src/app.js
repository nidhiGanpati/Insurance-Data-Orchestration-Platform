const express = require("express");
const path = require("path");

const app = express();

// ✅ parse JSON + form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ simple cookie parser (no extra dependency)
function getCookie(req, name) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";").map(s => s.trim());
  for (const p of parts) {
    const [k, ...rest] = p.split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function setCookie(res, name, value) {
  // httpOnly cookie (basic demo)
  res.setHeader("Set-Cookie", `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly`);
}

function clearCookie(res, name) {
  res.setHeader("Set-Cookie", `${name}=; Path=/; Max-Age=0; HttpOnly`);
}

// ✅ fixed credentials (you can change these)
const DEMO_USERNAME = "nidhi";
const DEMO_PASSWORD = "Stock1234";

// ✅ static folder
const STATIC_DIR = path.join(__dirname, "..", "static");

// ✅ auth middleware
function requireLogin(req, res, next) {
  const ok = getCookie(req, "demo_auth") === "1";
  if (!ok) return res.redirect("/login");
  next();
}

// ---- Pages ----
app.get("/login", (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    setCookie(res, "demo_auth", "1");
    return res.redirect("/");
  }
  // invalid -> show a simple error text
  return res.status(401).send("Invalid credentials. Go back and try again.");
});

app.post("/logout", (req, res) => {
  clearCookie(res, "demo_auth");
  res.redirect("/login");
});

app.get("/", requireLogin, (req, res) => {
  res.sendFile(path.join(STATIC_DIR, "dashboard.html"));
});

// ---- Existing API routes (keep them, but protect them) ----
// If you truly don’t want API at all, tell me and I’ll remove these mounts.
const v1Routes = require("./routes");
app.use("/v1", requireLogin, v1Routes);

// health works without login (optional)
app.get("/health", (req, res) => {
  res.json({ message: "OK", date: new Date().toISOString(), uptime: process.uptime() });
});

module.exports = app;
