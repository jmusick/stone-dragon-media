// @ts-check
import { defineConfig } from 'astro/config';
import { sessionDrivers } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// Sitemap <lastmod> = the last git commit touching a page's source file (plus the
// services catalogue for /services/* and the portfolio data for /work/*), not the
// build time — a lastmod that changes on every deploy is one crawlers learn to ignore.
// If git history isn't available (no git, or a shallow clone where every file looks
// last-touched by one commit), lastmod is left out rather than guessed.
const gitHistory = (() => {
	try {
		return execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() === 'false';
	} catch {
		return false;
	}
})();

/** @param {string[]} files */
function lastCommitDate(files) {
	try {
		const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { encoding: 'utf8' }).trim();
		return out || undefined;
	} catch {
		return undefined;
	}
}

/** @param {string} pathname */
function sourceFilesFor(pathname) {
	const route = pathname.replace(/^\/|\/$/g, '');
	if (route === 'services') return ['src/pages/services/index.astro', 'src/lib/services.ts'];
	if (route === 'work') return ['src/pages/work/index.astro', 'src/lib/work.ts'];
	if (route.startsWith('services/')) return ['src/pages/services/[category].astro', 'src/lib/services.ts'];
	if (route.startsWith('work/')) return ['src/pages/work/[slug].astro', 'src/lib/work.ts'];
	const candidates = route === '' ? ['src/pages/index.astro'] : [`src/pages/${route}.astro`, `src/pages/${route}/index.astro`];
	return candidates.filter((file) => existsSync(file));
}

// Workers static assets answer a slashless prerendered URL (/about) with a 307 to its slash
// canonical (/about/). Once the build has finished, write a `_redirects` rule for every
// prerendered non-root page so that hop is a permanent 308 instead. The list comes from the
// pages Astro actually emitted, so a new marketing page is covered with no manual step. 308
// (not 301) keeps the request method, and a query string rides along (/about?a=b ->
// /about/?a=b). Unknown paths have no rule, so they stay real 404s. `_redirects` is applied by
// the static-assets layer only, which is why `astro dev` does not show it; test the built Worker.
/** @returns {import('astro').AstroIntegration} */
function permanentSlashRedirects() {
	return {
		name: 'permanent-slash-redirects',
		hooks: {
			'astro:build:done': async ({ dir, pages, logger }) => {
				const rules = pages
					.map(({ pathname }) => '/' + pathname.replace(/^\/|\/$/g, ''))
					.filter((path) => path !== '/' && !/\.\w+$/.test(path) && path !== '/404')
					.sort()
					.map((path) => `${path} ${path}/ 308`);
				const target = new URL('_redirects', dir);
				const existing = existsSync(target) ? readFileSync(target, 'utf8').trimEnd() + '\n' : '';
				writeFileSync(target, existing + rules.join('\n') + '\n');
				logger.info(`Wrote ${rules.length} permanent slash redirects to _redirects`);
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://stonedragonmedia.com',
	output: 'server',
	// Astro 7 defaults to 'jsx', which strips whitespace between inline elements
	// ("<b>a</b> <i>b</i>" renders as "ab"). Keep the v6 behaviour rather than audit
	// every page for it.
	compressHTML: true,
	session: {
		// This app uses custom cookie-session auth, use lruCache to avoid an auto KV binding
		driver: sessionDrivers.lruCache(),
	},
	adapter: cloudflare({
		imageService: 'compile',
	}),
	server: {
		host: true,
		port: 4321,
	},
	vite: {
		server: {
			allowedHosts: [".ark-prime", "localhost"],
		},
	},
	integrations: [
		icon(),
		permanentSlashRedirects(),
		sitemap({
			filter: (page) =>
				!page.includes("/thank-you") &&
				!page.includes("/login") &&
				!page.includes("/dashboard") &&
				!page.includes("/admin") &&
				!page.includes("/api"),
			serialize(item) {
				if (!gitHistory) return item;
				const files = sourceFilesFor(new URL(item.url).pathname);
				const lastmod = files.length ? lastCommitDate(files) : undefined;
				return lastmod ? { ...item, lastmod } : item;
			},
		}),
	],
});
