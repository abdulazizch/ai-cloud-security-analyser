import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { exec } from "child_process";

const app = express();

// Wide-open CORS (bad)
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Hardcoded secret
const JWT_SECRET = "super-insecure-hardcoded-secret";

// Plaintext in-memory users (bad)
const users = [
  { id: 1, email: "admin@example.com", password: "admin123" },
  { id: 2, email: "user@example.com", password: "password" }
];

// Reflected XSS: echoes unescaped input
app.get("/search", (req, res) => {
  const q = req.query.q ?? "";
  res.send(`<h1>Results</h1><div>${q}</div>`); // XSS sink
});

// Command Injection: unsanitized input to shell
app.get("/ping", (req, res) => {
  const host = req.query.host || "127.0.0.1";
  exec(`ping -c 1 ${host}`, (err, stdout, stderr) => { // vulnerable
    if (err) return res.status(500).send(String(err));
    res.type("text/plain").send(stdout || stderr);
  });
});

// Fake SQL query via string interpolation (pattern for scanners)
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  // Vulnerable query pattern
  const sql = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
  // Simulated auth
  const u = users.find(u => u.email === email && u.password === password);
  if (u) return res.json({ ok: true, token: `fake.${Buffer.from(email).toString('base64')}.${JWT_SECRET}` });
  return res.status(401).json({ ok: false, error: "Invalid credentials", debugSql: sql });
});

app.listen(4000, () => {
  console.log("Vulnerable server listening on http://localhost:4000");
});
