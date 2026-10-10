// Deterministic credential-version races. Transpiles the real src/lib auth, users
// and clients modules and runs them against an in-memory SQLite D1-shaped adapter,
// so each interleaving (verify -> concurrent change -> stale write) is exact.
// No Worker build needed.
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import ts from "typescript";

const out = mkdtempSync(join(tmpdir(), "sdm-race-"));
for (const name of ["auth", "users", "clients"]) {
  const source = readFileSync(resolve("src/lib", `${name}.ts`), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText.replace(/from "\.\/(\w+)"/g, 'from "./$1.mjs"');
  writeFileSync(join(out, `${name}.mjs`), js);
}
writeFileSync(join(out, "db.mjs"), "export const ensureDB = () => globalThis.__testDb;\n");
const load = (name) => import(pathToFileURL(join(out, `${name}.mjs`)).href);
const auth = await load("auth");
const users = await load("users");
const clients = await load("clients");

function d1(db) {
  const wrap = (sql, params = []) => ({
    bind: (...args) => wrap(sql, args),
    run: async () => ({ meta: { changes: db.prepare(sql).run(...params).changes } }),
    first: async () => db.prepare(sql).get(...params) ?? null,
    all: async () => ({ results: db.prepare(sql).all(...params) }),
    _exec: () => ({ meta: { changes: db.prepare(sql).run(...params).changes } }),
  });
  return {
    prepare: (sql) => wrap(sql),
    batch: async (statements) => {
      db.exec("BEGIN");
      try {
        const results = statements.map((s) => s._exec());
        db.exec("COMMIT");
        return results;
      } catch (error) { db.exec("ROLLBACK"); throw error; }
    },
  };
}

function fresh() {
  const db = new DatabaseSync(":memory:");
  for (const file of readdirSync("migrations").sort()) {
    db.exec(readFileSync(join("migrations", file), "utf8"));
  }
  globalThis.__testDb = d1(db);
  return db;
}

const USER = "00000000-0000-4000-8000-0000000000aa";
const PASSWORD = "original-passphrase-for-races";

async function seed(db, extra = "") {
  const hash = await auth.hashPassword(PASSWORD);
  db.prepare("INSERT INTO users (id,email,password_hash,role,created_at) VALUES (?,?,?,'client',0)")
    .run(USER, "race@example.test", hash);
  if (extra) db.exec(`UPDATE users SET ${extra} WHERE id='${USER}'`);
  return hash;
}
const sessions = (db) => db.prepare("SELECT COUNT(*) AS n FROM sessions WHERE user_id=?").get(USER).n;
const hashOf = (db) => db.prepare("SELECT password_hash FROM users WHERE id=?").get(USER).password_hash;

// 1. Normal login: verified credential is still current.
{
  const db = fresh();
  const hash = await seed(db);
  assert.equal(await users.resetLoginLockout({}, USER, hash), true);
  assert.ok(await auth.createSession({}, USER, hash), "normal login issues a session");
  assert.equal(sessions(db), 1);
}

// 2. Self-service change completes between verification and session insertion.
{
  const db = fresh();
  const stale = await seed(db);
  assert.equal(await users.updateUserPassword({}, USER, "a-brand-new-passphrase-1", stale), true);
  assert.equal(await users.resetLoginLockout({}, USER, stale), false, "stale lockout reset is refused");
  assert.equal(await auth.createSession({}, USER, stale), null, "stale login must not mint a session");
  assert.equal(sessions(db), 0);
}

// 3. Admin reset completes between verification and session insertion.
{
  const db = fresh();
  const stale = await seed(db);
  await clients.resetClientPassword({}, USER);
  assert.equal(await auth.createSession({}, USER, stale), null, "stale login after admin reset");
  assert.equal(sessions(db), 0);
}

// 4. Temporary credential deadline passes between verification and insertion.
{
  const db = fresh();
  const hash = await seed(db, `must_change_password=1, temporary_password_expires_at=${Date.now() + 60_000}`);
  db.exec(`UPDATE users SET temporary_password_expires_at=1 WHERE id='${USER}'`);
  assert.equal(await auth.createSession({}, USER, hash), null, "expired temporary credential");
  db.exec(`UPDATE users SET temporary_password_expires_at=${Date.now() + 60_000} WHERE id='${USER}'`);
  assert.ok(await auth.createSession({}, USER, hash), "unexpired temporary credential still signs in");
}

// 5. Lock or deactivation lands between verification and insertion.
{
  const db = fresh();
  const hash = await seed(db);
  db.exec(`UPDATE users SET locked_until=${Date.now() + 60_000} WHERE id='${USER}'`);
  assert.equal(await auth.createSession({}, USER, hash), null, "concurrent lock");
  db.exec(`UPDATE users SET locked_until=NULL, is_active=0 WHERE id='${USER}'`);
  assert.equal(await auth.createSession({}, USER, hash), null, "concurrent archive");
}

// 6. Stale self-service change must not overwrite a concurrent admin reset.
{
  const db = fresh();
  const stale = await seed(db);
  const flashId = await clients.resetClientPassword({}, USER);
  const reset = hashOf(db);
  assert.equal(await users.updateUserPassword({}, USER, "overwriting-passphrase-123", stale), false);
  assert.equal(hashOf(db), reset, "reset hash survives the stale write");
  assert.ok(db.prepare("SELECT 1 FROM password_flash WHERE id=?").get(flashId), "reset reveal survives");
  assert.equal(db.prepare("SELECT must_change_password AS m FROM users WHERE id=?").get(USER).m, 1);
}

// 7. A successful change evicts other sessions and keeps the acting one.
{
  const db = fresh();
  const hash = await seed(db);
  const a = await auth.createSession({}, USER, hash);
  const b = await auth.createSession({}, USER, hash);
  const keep = await auth.hashSessionToken(a.token);
  assert.equal(await users.updateUserPassword({}, USER, "a-brand-new-passphrase-1", hash, keep), true);
  const left = db.prepare("SELECT id FROM sessions WHERE user_id=?").all(USER).map((r) => r.id);
  assert.deepEqual(left, [keep]);
  assert.notEqual(left[0], await auth.hashSessionToken(b.token));
  assert.equal(await auth.createSession({}, USER, hash), null, "old credential version is dead");
}

console.log("PASS: stale login, self-service change, admin reset, temp expiry, lock/archive and overwrite races");
