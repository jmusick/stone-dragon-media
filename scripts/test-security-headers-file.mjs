// Regression: the built dist/client/_headers `/*` block must equal SECURITY_HEADERS exactly
// (names, values, order), and the /_astro/* cache rule must survive. Starts no server;
// run `npm run build` first. Node 24 imports the .ts module directly.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SECURITY_HEADERS } from '../src/lib/security-headers.ts';

const text = readFileSync(new URL('../dist/client/_headers', import.meta.url), 'utf8');
const rules = new Map();
let current;
for (const raw of text.split(/\r?\n/)) {
	if (!raw.trim()) continue;
	if (!/^\s/.test(raw)) {
		current = raw.trim();
		assert.ok(!rules.has(current), `duplicate rule ${current}`);
		rules.set(current, []);
	} else {
		const line = raw.trim();
		const i = line.indexOf(':');
		rules.get(current).push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
	}
}

assert.deepEqual(rules.get('/*'), Object.entries(SECURITY_HEADERS), '/* block differs from SECURITY_HEADERS');
assert.deepEqual(rules.get('/_astro/*'), [['Cache-Control', 'public, max-age=31536000, immutable']], '/_astro/* cache rule missing or changed');
assert.deepEqual([...rules.keys()], ['/*', '/_astro/*'], 'unexpected rule set or order');
console.log('ok: dist/client/_headers /* block matches SECURITY_HEADERS; /_astro/* cache rule present');
