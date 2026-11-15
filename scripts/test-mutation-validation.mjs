import assert from "node:assert/strict";
import { runtime, ids } from "./test-runtime.mjs";
const app = await runtime();
const id = (number) => `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`;
const p = id(5), other = id(6), task = id(7), otherTask = id(8), pn = id(9), tn = id(10), entry = id(11);
try {
  app.sql(`INSERT INTO projects(id,client_id,name,status,created_at,updated_at) VALUES
    ('${p}','${ids.client}','Synthetic project','planning',0,0), ('${other}',NULL,'Internal project','planning',0,0);
    INSERT INTO tasks(id,project_id,title,type,lane,priority,created_at,updated_at) VALUES
    ('${task}','${p}','Task','task','planning','normal',0,0), ('${otherTask}','${other}','Other task','task','planning','normal',0,0);
    INSERT INTO project_notes(id,project_id,author_user_id,body,created_at,updated_at) VALUES('${pn}','${other}','${ids.admin}','Keep project note',0,0);
    INSERT INTO task_notes(id,task_id,author_user_id,body,created_at,updated_at) VALUES('${tn}','${otherTask}','${ids.admin}','Keep task note',0,0);
    INSERT INTO time_entries(id,task_id,user_id,minutes,entry_date,created_at) VALUES('${entry}','${otherTask}','${ids.admin}',30,0,0);
    INSERT INTO users(id,email,password_hash,role,is_active,created_at) VALUES('${id(4)}','inactive@example.test','','admin',0,0);`);
  const cookie = (await app.login("admin@example.test")).headers.get("set-cookie").split(";")[0];
  const tables = ["projects", "tasks", "project_notes", "task_notes", "time_entries", "clients", "invoices", "tickets", "users"];
  const snapshot = () => tables.map((table) => app.query(`SELECT * FROM ${table} ORDER BY id`));
  const before = snapshot();
  const invalid = [
    ["projects/save", { name: "Invalid", status: "forged" }],
    ["projects/save", { name: "Invalid", clientId: id(999) }],
    ["projects/save", { name: "Invalid", startDate: "2026-02-30" }],
    ["clients/set-active", { clientId: ids.client, isActive: "true" }],
    ["clients/save", { companyName: "Invalid", email: "bad@@example.test" }],
    ["settings/profile", { email: "valid@example.test", userId: ids.user }],
    ["tasks/save", { projectId: p, title: "Invalid", type: "forged" }],
    ["tasks/save", { projectId: p, title: "Invalid", priority: "urgent" }],
    ["tasks/save", { projectId: "garbage", title: "Invalid" }],
    ["tasks/save", { projectId: p, taskId: otherTask, title: "Wrong parent" }],
    ["tasks/delete", { projectId: p, taskId: otherTask }],
    ["tasks/save", { projectId: p, title: "Client assignee", assignedToUserId: ids.user }],
    ["tasks/save", { projectId: p, title: "Inactive assignee", assignedToUserId: id(4) }],
    ["project-notes/save", { projectId: p, noteId: pn, body: "Wrong parent" }],
    ["project-notes/delete", { projectId: p, noteId: pn }],
    ["task-notes/save", { projectId: p, taskId: task, noteId: tn, body: "Wrong task" }],
    ["task-notes/delete", { projectId: p, taskId: task, noteId: tn }],
    ["time-entries/delete", { projectId: p, taskId: task, entryId: entry }],
    ["time-entries/save", { projectId: p, taskId: otherTask, date: "2026-10-04", amount: "1" }],
    ["time-entries/save", { projectId: p, taskId: task, date: "2026-10-04", amount: "1", unit: "days" }],
    ["time-entries/save", { projectId: p, taskId: task, date: "2026-10-04", amount: "9007199254740992" }],
    ...[undefined, "", "1.234", "1e3", "90071992547409.92", "-1"].map((amount) => ["invoices/save", {
      clientId: ids.client, description: "Invalid", ...(amount === undefined ? {} : { amount }),
    }]),
    ["invoices/save", { clientId: ids.client, description: "Overlong link", amount: "1",
      paymentUrl: `https://buy.stripe.com/${"a".repeat(480)}` }],
    ["tickets/create", { subject: "Invalid", body: "Message", priority: "urgent" }],
    ["tickets/update-status", { ticketId: id(99), status: "forged" }],
  ];
  for (const [route, form] of invalid) {
    const response = await app.post(`/api/${route}`, form, cookie);
    assert.equal(response.status, 400, `${route}: ${JSON.stringify(form)}: ${await response.text()}`);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.ok(response.headers.get("content-security-policy"));
  }
  assert.deepEqual(snapshot(), before, "every forged request leaves business records intact");
  const okay = async (route, form) => {
    const response = await app.post(`/api/${route}`, form, cookie);
    assert.equal(response.status, 302, `${route}: ${await response.text()}`);
    return response;
  };
  await okay("tasks/save", { projectId: p, taskId: task, title: "Updated", assignedToUserId: ids.admin });
  await okay("project-notes/save", { projectId: other, noteId: pn, body: "Updated project note" });
  await okay("task-notes/save", { projectId: other, taskId: otherTask, noteId: tn, body: "Updated task note" });
  await okay("time-entries/save", { projectId: p, taskId: task, date: "2026-10-04", amount: "1.5", unit: "hours" });
  assert.equal(app.query(`SELECT minutes FROM time_entries WHERE task_id='${task}'`)[0].minutes, 90);
  await okay("invoices/save", { clientId: ids.client, description: "Exact decimal", amount: "12.34", dueDate: "2026-10-31" });
  await okay("invoices/save", { clientId: ids.client, description: "Zero invoice", amount: "0" });
  assert.deepEqual(app.query("SELECT amount_cents FROM invoices ORDER BY amount_cents").map((r) => r.amount_cents), [0, 1234]);

  // Payment links: only https Stripe payment hosts, rejected through the form's normal error redirect.
  const badLinks = ["http://buy.stripe.com/x", "https://buy.stripe.com.evil.test/x", "https://stripe.com/x",
    "https://evil.test/?u=https://buy.stripe.com", "https://user@buy.stripe.com/x", "https://buy.stripe.com:8443/x",
    "javascript:alert(1)", "buy.stripe.com/x", "not a url"];
  const invoicesBefore = app.query("SELECT * FROM invoices ORDER BY id");
  for (const paymentUrl of badLinks) {
    const response = await okay("invoices/save", { clientId: ids.client, description: "Bad link", amount: "5", paymentUrl });
    assert.equal(response.headers.get("location"), "/admin/billing/new?error=invalid", paymentUrl);
  }
  assert.deepEqual(app.query("SELECT * FROM invoices ORDER BY id"), invoicesBefore, "rejected links write nothing");
  const linkUrl = "https://buy.stripe.com/test_abc123";
  const created = await okay("invoices/save", { clientId: ids.client, description: "Linked", amount: "50", status: "sent", paymentUrl: ` ${linkUrl} ` });
  const linked = created.headers.get("location").split("/").pop();
  const storedUrl = () => app.query(`SELECT payment_url FROM invoices WHERE id='${linked}'`)[0].payment_url;
  assert.equal(storedUrl(), linkUrl, "a valid link is stored trimmed");
  const edit = (fields) => okay("invoices/save", { invoiceId: linked, description: "Linked", amount: "50", ...fields });
  const badEdit = await edit({ status: "sent", paymentUrl: "https://checkout.stripe.evil.test/x" });
  assert.equal(badEdit.headers.get("location"), `/admin/billing/${linked}?error=invalid`);
  assert.equal(storedUrl(), linkUrl, "a rejected edit keeps the existing link");
  await edit({ status: "sent", paymentUrl: "https://invoice.stripe.com/i/acct_1/test_2" });
  assert.equal(storedUrl(), "https://invoice.stripe.com/i/acct_1/test_2", "the link can be changed");

  // The client sees Pay now only while the invoice is sent or overdue.
  const clientCookie = (await app.login("client@example.test")).headers.get("set-cookie").split(";")[0];
  const billing = async () => (await fetch(`${app.origin}/dashboard/billing`, { headers: { cookie: clientCookie } })).text();
  for (const [status, shown] of [["sent", true], ["overdue", true], ["draft", false], ["paid", false], ["void", false]]) {
    await edit({ status, paymentUrl: linkUrl });
    const html = await billing();
    assert.equal(html.includes(`href="${linkUrl}"`), shown, `Pay now for ${status}`);
    if (shown) assert.match(html, /target="_blank" rel="noopener noreferrer"[^>]*aria-label="Pay now: Linked, \$50\.00 \(opens in a new tab\)"/);
  }
  await edit({ status: "sent", paymentUrl: "" });
  assert.equal(storedUrl(), null, "clearing the field removes the link");
  assert.ok(!(await billing()).includes("Pay now"), "no link, no button");
  const internal = await okay("projects/save", { name: "New internal", clientId: "" });
  assert.ok(internal.headers.get("location").startsWith("/admin/projects/"));
  const lane = await fetch(`${app.origin}/api/tasks/update-lane`, { method: "POST",
    headers: { cookie, origin: app.origin, "content-type": "application/json" },
    body: JSON.stringify({ taskId: task, lane: "qa", projectId: other }),
  });
  assert.equal(lane.status, 400);
  console.log(`PASS: ${invalid.length} forged/invalid mutations, unchanged records, parent chains, active admin assignees, decimal/date bounds, Stripe payment links and valid writes`);
} finally { app.close(); }
