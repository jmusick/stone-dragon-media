import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { runtime, ids } from "./test-runtime.mjs";

// Copy the built Worker and replace only its email send call with a deterministic failure.
const dir = mkdtempSync(join(tmpdir(), "sdm-notify-"));
cpSync("dist/server", dir, { recursive: true });
const configPath = join(dir, "wrangler.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
config.assets.directory = resolve("dist/client");
writeFileSync(configPath, JSON.stringify(config));
const chunk = join(dir, "chunks", readdirSync(join(dir, "chunks")).find((name) => /^notify_.*\.mjs$/.test(name)));
const code = readFileSync(chunk, "utf8");
assert.ok(code.includes("config.EMAIL.send("), "built notification send call");
writeFileSync(chunk, code.replace("config.EMAIL.send(", "(() => { throw new Error('synthetic failure'); })("));
const app = await runtime({ configPath, vars: { NOTIFY_FROM: "sender@example.test", NOTIFY_TO: "owner@example.test" } });
try {
  const clientCookie = (await app.login("client@example.test")).headers.get("set-cookie").split(";")[0];
  const created = await app.post("/api/tickets/create", { subject: "Private subject", body: "Private message", priority: "high" }, clientCookie);
  assert.equal(created.status, 302);
  const ticketId = created.headers.get("location").split("/").pop();
  assert.equal(app.query(`SELECT count(*) AS n FROM tickets WHERE id='${ticketId}'`)[0].n, 1);
  const reply = await app.post("/api/tickets/reply", { ticketId, body: "Private reply" }, clientCookie);
  assert.equal(reply.status, 302);
  assert.equal(reply.headers.get("location"), `/dashboard/tickets/${ticketId}`);
  const deadline = Date.now() + 5000;
  while ((app.output().match(/notify_failed/g) ?? []).length < 2 && Date.now() < deadline) await new Promise((r) => setTimeout(r, 100));
  const logs = app.output();
  assert.equal((logs.match(/notify_failed/g) ?? []).length, 2, logs);
  assert.ok(!logs.includes("Private subject") && !logs.includes("Private message") && !logs.includes("Private reply"));
  const adminCookie = (await app.login("admin@example.test")).headers.get("set-cookie").split(";")[0];
  assert.equal((await app.post("/api/tickets/reply", { ticketId, body: "Admin reply" }, adminCookie)).status, 302);
  assert.equal((await app.post("/api/admin/impersonate/start", { clientId: ids.client }, adminCookie)).status, 302);
  assert.equal((await app.post("/api/tickets/reply", { ticketId, body: "Impersonated reply" }, adminCookie)).status, 403);
  await new Promise((r) => setTimeout(r, 300));
  assert.equal((app.output().match(/notify_failed/g) ?? []).length, 2);
  console.log("PASS: failed notifications preserve ticket redirects; admin and impersonated writes do not notify");
} finally { app.close(); }

const local = await runtime({ vars: { NOTIFY_FROM: "sender@example.test", NOTIFY_TO: "owner@example.test" } });
try {
  const cookie = (await local.login("client@example.test")).headers.get("set-cookie").split(";")[0];
  const created = await local.post("/api/tickets/create", { subject: "Site question", body: "Secret ticket message", priority: "high" }, cookie);
  const ticketId = created.headers.get("location").split("/").pop();
  assert.equal(created.status, 302);
  assert.equal((await local.post("/api/tickets/reply", { ticketId, body: "Secret reply" }, cookie)).status, 302);
  const deadline = Date.now() + 5000;
  while ((local.output().match(/send_email binding called/g) ?? []).length < 2 && Date.now() < deadline) await new Promise((r) => setTimeout(r, 100));
  const output = local.output();
  assert.equal((output.match(/send_email binding called/g) ?? []).length, 2);
  assert.ok(output.includes("Subject: New ticket from Synthetic client: Site question"));
  assert.ok(output.includes("Subject: Client reply: Site question"));
  const files = [...output.matchAll(/^Text: (.+\.txt)\r?$/gm)].map((match) => match[1]);
  assert.equal(files.length, 2);
  for (const file of files) {
    const body = readFileSync(file, "utf8");
    assert.ok(body.includes("Synthetic client") && body.includes("Site question") && body.includes("high") && body.includes(`/admin/tickets/${ticketId}`));
    assert.ok(!body.includes("Secret ticket message") && !body.includes("Secret reply"));
  }
  console.log("PASS: local client notifications contain ticket metadata and omit message bodies");
} finally { local.close(); }

const disabled = await runtime();
try {
  const cookie = (await disabled.login("client@example.test")).headers.get("set-cookie").split(";")[0];
  const response = await disabled.post("/api/tickets/create", { subject: "Disabled", body: "Message", priority: "normal" }, cookie);
  assert.equal(response.status, 302);
  await new Promise((r) => setTimeout(r, 300));
  assert.ok(!disabled.output().includes("send_email binding called") && !disabled.output().includes("notify_failed"));
  console.log("PASS: notifications are skipped when configuration is absent");
} finally { disabled.close(); }
