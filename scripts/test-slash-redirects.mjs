import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { runtime } from "./test-runtime.mjs";

// Every prerendered non-root page in the build, found independently of the generated rules.
const root = "dist/client";
const marketing = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name === "index.html" && dir !== root) marketing.push("/" + relative(root, dir).split(sep).join("/"));
  }
};
walk(root);
assert.ok(marketing.length >= 12, `expected the prerendered marketing pages, found ${marketing.length}`);

// The generated rule file must cover exactly those pages, all permanent, and nothing else.
const rules = readFileSync(join(root, "_redirects"), "utf8").split("\n").filter(Boolean);
assert.deepEqual(rules.sort(), marketing.map((path) => `${path} ${path}/ 308`).sort());

const app = await runtime();
try {
  const get = (method, path) => fetch(`${app.origin}${path}`, { method, redirect: "manual" });
  const postStatus = async (path) => (await fetch(`${app.origin}${path}`, {
    method: "POST", redirect: "manual", headers: { origin: app.origin }, body: new URLSearchParams({ a: "b" }),
  })).status;

  for (const method of ["GET", "HEAD"]) {
    for (const path of marketing) {
      // One permanent hop straight to the canonical, query string intact.
      for (const query of ["", "?utm_source=x&b=1"]) {
        const hop = await get(method, path + query);
        assert.equal(hop.status, 308, `${method} ${path}${query}`);
        assert.equal(hop.headers.get("location"), `${path}/${query}`, `${method} ${path}${query}`);
        // The canonical is the end of the chain: 200, not another redirect.
        const canonical = await get(method, `${path}/${query}`);
        assert.equal(canonical.status, 200, `${method} ${path}/${query}`);
      }
    }
  }
  console.log(`PASS: ${marketing.length} slashless marketing URLs permanently redirect (GET/HEAD) with queries preserved; canonicals stay 200`);

  assert.equal((await get("GET", "/")).status, 200);
  assert.equal((await get("GET", "/404")).status, 200);
  for (const path of ["/no-such-page", "/no-such-page/", "/no-such-page?x=1", "/services/no-such-page", "/services/no-such-page/", "/about/no-such-page"]) {
    for (const method of ["GET", "HEAD"]) assert.equal((await get(method, path)).status, 404, `${method} ${path}`);
  }
  console.log("PASS: root and /404 untouched; unknown routes remain true 404s with and without a trailing slash");

  // Portal, auth and API routes are not part of the rule set.
  assert.equal((await get("GET", "/login")).status, 200);
  assert.equal((await get("GET", "/login/")).status, 200);
  for (const path of ["/dashboard", "/admin"]) {
    const response = await get("GET", path);
    assert.equal(response.status, 302, path);
    assert.equal(response.headers.get("location"), "/login", path);
  }
  assert.equal((await get("GET", "/api/auth/login")).status, 404);
  assert.equal(await postStatus("/api/auth/login"), 400);
  assert.equal(await postStatus("/login"), 400);
  assert.equal(await postStatus("/no-such-page"), 404);
  // Static-asset redirects are method-agnostic: a POST to a slashless page gets the same 308, which
  // (unlike 301) tells a client to repeat the POST at the canonical, where it gets the same 405
  // as before this change.
  assert.equal(await postStatus("/about"), 308);
  assert.equal(await postStatus("/about/"), 405);
  console.log("PASS: portal, auth and API behavior unchanged; POST to a slashless page gets the 308 and then the canonical keeps its 405");
} finally { app.close(); }
