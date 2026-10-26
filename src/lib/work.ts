// Single source of truth for the portfolio: the /work grid, each /work/<slug>/ case study, their
// JSON-LD, /sitemap entries, and featured tiles on / and /services render from this catalogue.
// Every claim here is about what actually shipped — check the project's own repo before changing one.

import { serviceCategories } from "./services";

export interface WorkShot {
  /** Path under public/ — 1180x615 WebP, like the grid thumbnails. */
  src: string;
  alt: string;
  caption: string;
}

export interface WorkSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

/** A service from src/lib/services.ts, by category slug and service anchor id. */
export interface WorkServiceRef {
  category: string;
  id: string;
}

export interface WorkProject {
  /** URL segment under /work/, and the card's anchor id on /work. Keep stable — it's linked from /, /services, and /products. */
  slug: string;
  name: string;
  url: string;
  /** Schema.org type for the project itself. */
  schemaType: "WebSite" | "WebApplication";
  /** Description used in the project's JSON-LD. */
  schemaDescription: string;
  /** True when Stone Dragon Media, LLC owns and operates the project, not just built it. */
  ownedBySdm: boolean;

  /** 1180x615 homepage screenshot — grid card, case-study lead image, and og:image. */
  thumb: string;
  thumbAlt: string;

  // The /work grid card.
  cardSummary: string;
  /** One-line description for featured portfolio tiles. */
  shotDesc: string;
  cardBullets: string[];

  // The case study page.
  /** Page <title> minus " | Stone Dragon Media" — keep the whole thing under ~65 chars. */
  title: string;
  description: string;
  h1: string;
  heroDesc: string;
  /** "At a glance" facts. */
  kind: string;
  role: string;
  platform: string[];
  /** Lead paragraph under the hero. */
  overview: string;
  sections: WorkSection[];
  gallery: WorkShot[];
  services: WorkServiceRef[];
}

export const workProjects: WorkProject[] = [
  {
    slug: "firelands-current",
    name: "Firelands Current",
    url: "https://firelandscurrent.com/",
    schemaType: "WebSite",
    schemaDescription:
      "Independent digital newspaper for Sandusky, Ohio, and the Firelands region, owned and operated by Stone Dragon Media, LLC. Local news, an events calendar, and reader discussions.",
    ownedBySdm: true,
    thumb: "/work/firelands-current.webp",
    thumbAlt: "Firelands Current homepage with its teal masthead and local news headlines",
    shotDesc: "Our local newspaper with events, reader discussions, and newsroom tools.",
    cardSummary:
      "An independent digital newspaper for Sandusky, Ohio, and the Firelands region. We designed and built the site, and Stone Dragon Media, LLC owns and operates the publication, from its local coverage to its publishing platform.",
    cardBullets: [
      "Lake Erie-inspired teal palette, condensed headlines, and serif reading text give the publication its own identity",
      "Readers can find local news by community and section, follow writers, and subscribe through RSS",
      "Find events in a specific community and add them to a personal calendar",
      "Discuss each story and event with neighbors through Talk of the Town",
      "Editors manage stories, events, credited photos, reader tips, and advertising through custom newsroom tools",
    ],
    title: "Firelands Current News Website Case Study",
    description:
      "How Stone Dragon Media designed and built Firelands Current, a digital newspaper for Sandusky, Ohio, with local news, an events calendar, reader discussions, and newsroom tools.",
    h1: "Firelands Current: A Digital Newspaper for Sandusky and the Firelands",
    heroDesc: "Local news, an events calendar, reader discussions, and the newsroom tools behind them.",
    kind: "Digital newspaper",
    role: "Design, development, hosting, and publishing. We own and operate the publication.",
    platform: ["Astro", "Cloudflare Workers", "Cloudflare D1", "Cloudflare R2"],
    overview:
      "Firelands Current is an independent digital newspaper covering Sandusky, Ohio, and the surrounding Firelands region. Stone Dragon Media, LLC owns and operates it. We designed the publication, built its website and publishing platform, and run both every day.",
    sections: [
      {
        heading: "The goal",
        paragraphs: [
          "A local paper has to work for two audiences. Readers need to find the stories, events, and conversations that matter to their town. Editors need to publish quickly, credit sources and photographers, and keep comment sections civil.",
          "The paper also sells display advertising to local businesses, so ad placement, labeling, and inquiries had to be part of the platform from the start.",
        ],
      },
      {
        heading: "Design",
        paragraphs: [
          "The visual identity draws on Lake Erie: a deep teal masthead, condensed headlines, and serif text for long reading. Pages are organized by section and by community, so a reader in Huron or Norwalk can go straight to their own coverage. On phones, the main navigation folds into a menu button in the masthead.",
        ],
      },
      {
        heading: "What we built",
        paragraphs: ["The public site and the newsroom behind it are one custom application."],
        bullets: [
          "News sections and story pages with lead images, captioned photos, share links, and related coverage ranked by section and community",
          "A local events calendar with list and month views, community filters, and add-to-calendar files",
          "Talk of the Town, where every story and event gets its own discussion, plus threads that readers start themselves, with voting, nested replies, and member reports",
          "Reader accounts with email verification, public profiles, and author bylines that link to each writer's work",
          "Submit-news, contact, advertising, and report-an-inaccuracy forms, each protected by Cloudflare Turnstile",
          "Newsroom tools for stories, events, a credited media library, reader tips, corrections, moderation, businesses, and ads",
          "RSS and JSON feeds, an XML sitemap, and a Google News sitemap for stories from the last 48 hours",
        ],
      },
      {
        heading: "Behind the scenes",
        paragraphs: [
          "The site runs on Cloudflare Workers, with a D1 database for content and accounts and R2 storage for images. Staff roles control who can edit, publish, and moderate. Public posting is rate-limited.",
        ],
        bullets: [
          "Event and story structured data so search engines can understand each page",
          "Security response headers, bounded request handling, and automated tests for every staff role and endpoint",
          "Google Analytics on public pages only, with staff traffic filtered out and no names, emails, or message text sent",
          "Published accessibility statement, skip links, and accessible form error summaries",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/firelands-current-events.webp",
        alt: "Firelands Current local events page with category tabs, a community filter, and list and calendar views",
        caption: "The events calendar, filtered by category and community.",
      },
      {
        src: "/work/firelands-current-talk.webp",
        alt: "Firelands Current Talk of the Town discussion board listing story, event, and community discussions",
        caption: "Talk of the Town, the paper's reader discussion board.",
      },
    ],
    services: [
      { category: "design-development", id: "custom-web-solutions" },
      { category: "design-development", id: "application-development" },
      { category: "marketing-analytics", id: "analytics-reporting" },
      { category: "hosting-security", id: "security-maintenance" },
    ],
  },
  {
    slug: "jd-musick",
    name: "JD Musick",
    url: "https://jdmusick.band/",
    schemaType: "WebSite",
    schemaDescription:
      "Album-focused site for blues and soul artist JD Musick, with a full tracklist, streaming links, and booking contact.",
    ownedBySdm: false,
    thumb: "/work/jdmusick.webp",
    thumbAlt: "JD Musick website showing The Road Still Knows album launch",
    shotDesc: "Artist website with album details, streaming links, and booking contact.",
    cardSummary:
      "A website for blues and soul artist JD Musick and the debut record The Road Still Knows. Visitors can explore all eleven songs, find the album on streaming services, and get in touch about booking or licensing.",
    cardBullets: [
      "Immersive album artwork, artist branding, and listening links lead the home page",
      "Dedicated music page with the full eleven-song tracklist, runtimes, and song descriptions",
      "Spotify and Apple Music links make the record easy to find from across the site",
      "About page and contact form for booking, press, licensing, and collaborations",
      "Music artist and album markup gives search engines structured details about the release",
    ],
    title: "JD Musick Artist Website Case Study",
    description:
      "How Stone Dragon Media built an album website for blues and soul artist JD Musick, with a full tracklist, streaming links, and a protected booking contact form.",
    h1: "JD Musick: An Album Website for a Blues and Soul Artist",
    heroDesc: "A launch site for the debut record The Road Still Knows, styled from its cover art.",
    kind: "Musician website",
    role: "Design, development, and hosting setup",
    platform: ["Astro", "Cloudflare Pages", "Cloudflare Turnstile", "Cloudflare Email Sending"],
    overview:
      "JD Musick is an electric blues and soul artist whose debut album, The Road Still Knows, was released on September 4, 2026. We designed and built the site to launch the record and handle booking, press, and licensing inquiries.",
    sections: [
      {
        heading: "The goal",
        paragraphs: [
          "The site needed to send visitors to the record quickly, then give them a reason to stay: the story behind each song, who the artist is, and how to get in touch about shows or licensing.",
        ],
      },
      {
        heading: "Design",
        paragraphs: [
          "The palette and textures come from the album artwork: blackened wood, wet brick, ember orange, rust, and aged cream. A tall condensed typeface echoes the artist credit on the cover, condensed headlines carry the pages, and a plain sans-serif keeps longer copy easy to read.",
        ],
      },
      {
        heading: "What we built",
        paragraphs: [],
        bullets: [
          "A home page led by the album artwork, with listening links above the fold",
          "A music page with all eleven tracks, their runtimes, and a one-line description of each song",
          "Spotify and Apple Music links throughout the site, plus an embedded Spotify player",
          "An about page and a contact form for booking, press, licensing, and collaborations",
          "A custom 404 page and a share image built from the album cover",
        ],
      },
      {
        heading: "Behind the scenes",
        paragraphs: [
          "The pages are static and served from Cloudflare's network. The contact form is the site's only server code: a small function that verifies Cloudflare Turnstile, checks the input, and delivers each message by email.",
        ],
        bullets: [
          "Music group and album structured data connected across pages",
          "A content security policy and other security headers that allow only the services the site uses",
          "Underlined body links and a keyboard-friendly mobile menu",
          "A privacy policy that matches the fonts, embeds, and form handling the site actually uses",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/jdmusick-music.webp",
        alt: "JD Musick music page showing The Road Still Knows cover, album details, and Spotify and Apple Music buttons",
        caption: "The music page, with album details and streaming links.",
      },
    ],
    services: [
      { category: "design-development", id: "custom-web-solutions" },
      { category: "branding-consulting", id: "branding-design" },
      { category: "hosting-security", id: "hosting-infrastructure" },
    ],
  },
  {
    slug: "simon-rook",
    name: "Simon Rook",
    url: "https://simonrook.com/",
    schemaType: "WebSite",
    schemaDescription:
      "Author site for Simon Rook, built around the launch of the practical-philosophy book The Stoic Mind for Overthinkers.",
    ownedBySdm: false,
    thumb: "/work/simonrook.webp",
    thumbAlt: "Simon Rook author website",
    shotDesc: "Author website with book details and purchase links.",
    cardSummary:
      "An author website for the launch of The Stoic Mind for Overthinkers. Readers can explore the book’s chapters and takeaways before following a purchase link to Amazon Kindle.",
    cardBullets: [
      "The book cover's navy, bronze, and bone colors give every page a consistent identity",
      "Add a book in one catalogue file to publish its details, chapter breakdown, reader takeaways, and purchase links together",
      "Book and author structured data describes each title, its cover, and its format for search engines",
      "Buy links pointing readers to Amazon Kindle, with slots ready for more stores and author profiles as they open",
      "Static pages delivered through a global content delivery network, with an automatically generated sitemap",
    ],
    title: "Simon Rook Author Website Case Study",
    description:
      "How Stone Dragon Media built an author website for Simon Rook and the launch of The Stoic Mind for Overthinkers, with book pages, structured data, and consent-based analytics.",
    h1: "Simon Rook: An Author Website for a Book Launch",
    heroDesc: "A site built around The Stoic Mind for Overthinkers, ready for the next title.",
    kind: "Author website",
    role: "Design, development, and hosting setup",
    platform: ["Astro", "Cloudflare Pages", "Cloudflare Turnstile", "Cloudflare Email Sending"],
    overview:
      "Simon Rook writes practical philosophy for people who think too much. The first Simon Rook book, The Stoic Mind for Overthinkers, was published on Amazon Kindle on August 14, 2026. We built the author site around that launch, with room for the books that follow.",
    sections: [
      {
        heading: "The goal",
        paragraphs: [
          "Readers arriving from a search or a social post should understand what the book offers and be able to buy it within a click or two. The site also needed a way to reach the author for reader mail, press, and rights.",
        ],
      },
      {
        heading: "Design",
        paragraphs: [
          "The colors and type come straight from the book cover, so the site and the book feel like one object. Navy fields, bronze accents, and bone-white text match the cover art. A condensed display face echoes the cover title, and a serif carries the reading copy. All fonts are self-hosted.",
        ],
      },
      {
        heading: "What we built",
        paragraphs: [],
        bullets: [
          "A home page that introduces the author and features the current book",
          "A book page with the description, reader promises, the full chapter structure, a note to readers, and a Kindle buy link",
          "A catalogue where adding one entry publishes a new book's page, card, structured data, and sitemap entry",
          "An about page and a contact form protected by Cloudflare Turnstile",
          "A privacy policy that describes exactly what the site collects",
        ],
      },
      {
        heading: "Behind the scenes",
        paragraphs: [
          "Every page is static and served from Cloudflare's network. A single function handles the contact form and sends each message by email.",
        ],
        bullets: [
          "Book, author, and breadcrumb structured data, all checked against the Schema.org validator with no errors",
          "Book-specific share cards for social posts, and sitemap dates taken from each page's last change",
          "Google Analytics that loads only after a visitor opts in, alongside cookieless Cloudflare Web Analytics",
          "A content security policy and other security headers",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/simonrook-book.webp",
        alt: "Simon Rook book page for The Stoic Mind for Overthinkers with the cover and an Available Now label",
        caption: "The book page for The Stoic Mind for Overthinkers.",
      },
    ],
    services: [
      { category: "design-development", id: "custom-web-solutions" },
      { category: "marketing-analytics", id: "analytics-reporting" },
      { category: "hosting-security", id: "security-maintenance" },
    ],
  },
  {
    slug: "dorian-black",
    name: "Dorian Black",
    url: "https://dorianblack.com/",
    schemaType: "WebSite",
    schemaDescription: "Launch site for synth-pop artist Dorian Black, built around the debut album After Tonight.",
    ownedBySdm: false,
    thumb: "/work/dorianblack.webp",
    thumbAlt: "Dorian Black synth-pop artist website",
    shotDesc: "Artist website with album details and streaming links.",
    cardSummary:
      "A neon-lit website for synth-pop artist Dorian Black and the debut album After Tonight. Listeners can explore the full record and find links to Spotify and Apple Music in one place.",
    cardBullets: [
      "Custom neon-and-chrome design system built to match the album’s late-night mood",
      "Update album art, track listings, runtimes, and liner notes in one file to keep the music page current",
      "Streaming links to Spotify and Apple Music site-wide, with slots ready for YouTube, SoundCloud, and socials as they go live",
      "Album and artist structured data describes the release for search engines",
      "Static pages delivered through a global content delivery network",
    ],
    title: "Dorian Black Music Website Case Study",
    description:
      "How Stone Dragon Media designed and built a neon-styled website for synth-pop artist Dorian Black and the debut album After Tonight.",
    h1: "Dorian Black: A Neon Launch Site for a Synth-Pop Album",
    heroDesc: "A late-night design system and album site for the twelve-track debut After Tonight.",
    kind: "Musician website",
    role: "Design system, development, and hosting setup",
    platform: ["Astro", "Cloudflare Workers", "Cloudflare Turnstile", "Cloudflare Email Sending"],
    overview:
      "Dorian Black is a synth-pop recording artist. We created a design system for the project and built the website around the twelve-track debut album, After Tonight.",
    sections: [
      {
        heading: "The goal",
        paragraphs: [
          "The site had to feel like the record: city lights, late nights, and an after-party mood. It also had to make streaming the album the obvious next step on every page.",
        ],
      },
      {
        heading: "Design",
        paragraphs: [
          "Near-black backgrounds, magenta, violet, and blue neon glow, and chrome details set the tone. A retro display face handles headlines, a narrow sans-serif carries body text, and a script accent echoes the album's signature artwork. The colors, type, and components are defined once as reusable design tokens.",
        ],
      },
      {
        heading: "What we built",
        paragraphs: [],
        bullets: [
          "A home page that leads with the album and a direct link to hear it",
          "A music page driven by one album data file, with cover art, track listing, and runtimes",
          "Spotify, Apple Music, and social links that appear across the site once each profile is live",
          "A Spotify player that loads only when a visitor clicks to play",
          "A contact form and a privacy policy",
        ],
      },
      {
        heading: "Behind the scenes",
        paragraphs: [
          "The site runs on Cloudflare Workers. Pages are static, and a small Worker route handles the contact form. That route checks the request's origin, rate-limits each visitor, verifies Cloudflare Turnstile, and sends the message by email.",
        ],
        bullets: [
          "Album and artist structured data, page-specific titles and descriptions, and a custom 404 page",
          "Self-hosted fonts, so nothing loads from Google before a visitor agrees to analytics",
          "Opt-in Google Analytics with a cookie banner that never covers page content",
          "Accessibility fixes for text contrast, link underlines, form errors, track list markup, and mobile menu focus",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/dorianblack-music.webp",
        alt: "Dorian Black music page with the After Tonight cover art, album details, and streaming and social buttons",
        caption: "The After Tonight music page.",
      },
    ],
    services: [
      { category: "design-development", id: "custom-web-solutions" },
      { category: "branding-consulting", id: "branding-design" },
      { category: "hosting-security", id: "security-maintenance" },
    ],
  },
  {
    slug: "pneumaris",
    name: "Pneumaris",
    url: "https://pneumarisband.com/",
    schemaType: "WebSite",
    schemaDescription:
      "Atmospheric artist site for the metal project Pneumaris, with streaming links and a dedicated music page.",
    ownedBySdm: false,
    thumb: "/work/pneumaris.webp",
    thumbAlt: "Pneumaris website homepage with a hooded figure framed by a dark eclipse and the band name",
    shotDesc: "Band website with music players and a contact form.",
    cardSummary:
      "A dark, atmospheric website for the metal project Pneumaris. Fans can listen through embedded music players, explore releases, and find the band’s music and social profiles.",
    cardBullets: [
      "Layered homepage artwork with a figure that turns toward the cursor, and a still version for reduced motion",
      "Dedicated music page with album art, release details, and built-in streaming players",
      "Contact form with spam protection",
      "One-click links out to all their music and social platforms, with accounts managed by our team",
      "Built-in visitor analytics to track traffic and engagement",
    ],
    title: "Pneumaris Band Website Case Study",
    description:
      "How Stone Dragon Media designed and built an atmospheric website for the metal project Pneumaris, with a layered 3D homepage, a music catalog, and streaming players.",
    h1: "Pneumaris: An Atmospheric Website for a Metal Project",
    heroDesc: "A layered 3D homepage, a catalog of releases, and every platform one click away.",
    kind: "Band website",
    role: "Design, development, and social profile management",
    platform: ["Astro", "Cloudflare Pages", "WebGL", "Web3Forms", "hCaptcha"],
    overview:
      "Pneumaris is a metal project with five releases so far: three albums, an EP, and a single. We designed and built the website, and our team manages its music and social profiles. The site has been updated with each new release since its first version in May 2026.",
    sections: [
      {
        heading: "The goal",
        paragraphs: [
          "Fans should be able to hear the music without leaving the site, see every release in one place, and find the band on whichever platform they already use.",
        ],
      },
      {
        heading: "Design",
        paragraphs: [
          "The site is dark and cinematic. The homepage layers a fixed environment behind a curved character surface that turns toward the mouse, with optional tilt on phones. Visitors who prefer reduced motion, or whose browsers can't run WebGL, see a still version, and a pause control stops the motion at any time.",
        ],
      },
      {
        heading: "What we built",
        paragraphs: [],
        bullets: [
          "A homepage featuring the latest release, with a wallpaper preview",
          "A music page with every release's cover, type, release date, description, and track count",
          "Embedded Spotify players for each release, with a SoundCloud fallback, and a lightbox for cover art",
          "An extras page with a free desktop wallpaper download",
          "Links to Spotify, Apple Music, SoundCloud, YouTube, TikTok, X, Instagram, and Facebook in the header",
          "A contact form protected by hCaptcha and a hidden spam trap",
        ],
      },
      {
        heading: "Behind the scenes",
        paragraphs: [
          "Release details live in one shared data file, so adding an album updates the homepage, the music page, and the structured data together.",
        ],
        bullets: [
          "Music recording structured data for each track, plus sitemap and canonical URLs",
          "Optimized images and a responsive layout with a mobile menu",
          "Opt-in Google Analytics behind a cookie consent banner",
          "Security response headers, including a content security policy",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/pneumaris-music.webp",
        alt: "Pneumaris music page showing the Anathema album cover, release details, and description",
        caption: "The music page, newest release first.",
      },
      {
        src: "/work/pneumaris-extras.webp",
        alt: "Pneumaris extras page with a dark desktop wallpaper preview",
        caption: "The extras page and its free wallpaper.",
      },
    ],
    services: [
      { category: "design-development", id: "custom-web-solutions" },
      { category: "marketing-analytics", id: "marketing" },
      { category: "marketing-analytics", id: "analytics-reporting" },
    ],
  },
  {
    slug: "tagstash",
    name: "Tagstash",
    url: "https://tagsta.sh/",
    schemaType: "WebApplication",
    schemaDescription: "Tag-first bookmarking and resource-organization tool built in house by Stone Dragon Media.",
    ownedBySdm: true,
    thumb: "/work/tagstash.webp",
    thumbAlt: "Tagstash bookmarking tool",
    shotDesc: "Our bookmarking application with paid plans and a Firefox extension.",
    cardSummary:
      "Our own bookmarking application for saving links and finding them again by tag or search. We built and operate the web app and its companion Firefox extension.",
    cardBullets: [
      "Organize saved links with tags and search them when you need them",
      "Free and paid plans with secure online payments",
      "Secure account sign-up with email verification",
      "A custom-built Firefox extension for saving pages in a single click, with a sidebar for browsing and tagging",
      "Shareable public pages so users can showcase their saved links",
    ],
    title: "Tagstash Bookmarking App Case Study",
    description:
      "How Stone Dragon Media built and runs Tagstash, a tag-first bookmarking web app with paid plans, public profiles, and a companion Firefox extension.",
    h1: "Tagstash: A Tag-First Bookmarking App and Firefox Extension",
    heroDesc: "A subscription web app and browser extension we designed, built, and operate ourselves.",
    kind: "Web application and browser extension",
    role: "Product design, development, and operations. We own and run the service.",
    platform: ["React", "Vite", "Cloudflare Pages Functions", "Cloudflare D1", "Stripe"],
    overview:
      "Tagstash is a bookmark manager built around tags instead of folders. Stone Dragon Media designed and built it, and we run it as a hosted service with free and paid plans. A companion Firefox extension, published on Firefox Add-ons, saves pages without leaving the tab.",
    sections: [
      {
        heading: "The goal",
        paragraphs: [
          "Folders force every link into one place. Tagstash lets a link carry as many tags as it needs, then finds it again by combining tags or searching. It had to be quick to save into, easy to move existing bookmarks in and out of, and sustainable to run as a paid product.",
        ],
      },
      {
        heading: "Design",
        paragraphs: [
          "The interface puts the tag cloud and search first. Users choose from three themes, Slate, Midnight, and Light, and the choice follows their account into the browser extension. A public features page shows short recorded demonstrations of the real app, with pause controls and a text walkthrough for each.",
        ],
      },
      {
        heading: "What we built",
        paragraphs: [],
        bullets: [
          "Bookmark saving, editing, sorting, and search, with tag filtering that narrows as tags are combined",
          "A tag management page for merging two tags into one",
          "Import from other bookmark tools, and export to HTML, CSV, or JSON",
          "Free and Pro plans, with Stripe Checkout and a billing portal for managing subscriptions",
          "Opt-in public profiles that share a read-only, tag-filterable view of a user's bookmarks, plus a JSON API for embedding them on other sites",
          "A Firefox extension with a quick-save popup, a sidebar for browsing and editing, and a dashboard that can serve as the browser's start page",
        ],
      },
      {
        heading: "Behind the scenes",
        paragraphs: [
          "The React front end is built with Vite and served by Cloudflare Pages. Cloudflare Pages Functions handle the API, with accounts and bookmarks stored in Cloudflare D1. Verification and password reset emails go out through Cloudflare Email Sending.",
        ],
        bullets: [
          "Email verification, login lockout, and per-address and per-IP throttling",
          "New passwords checked against known breaches without sending the password anywhere",
          "Sign-up and reset flows that give the same answer whether or not an account exists",
          "Security headers, an automated accessibility audit, and a sitemap that lists only quality public profiles",
        ],
      },
    ],
    gallery: [
      {
        src: "/work/tagstash-features.webp",
        alt: "Tagstash features page headed A bookmark manager. Every tag that fits.",
        caption: "The public features page.",
      },
    ],
    services: [
      { category: "design-development", id: "application-development" },
      { category: "hosting-security", id: "hosting-infrastructure" },
      { category: "hosting-security", id: "security-maintenance" },
    ],
  },
];

/** Ordered projects shown in the Recent Work grids on / and /services. */
export const featuredWork: WorkProject[] = ["simon-rook", "firelands-current", "pneumaris", "tagstash"].map((slug) => {
  const project = workProjects.find((project) => project.slug === slug);
  if (!project) throw new Error(`work.ts: featuredWork references unknown project ${slug}`);
  return project;
});

export function workUrl(project: WorkProject): string {
  return `https://stonedragonmedia.com/work/${project.slug}/`;
}

/** Resolve a project's service refs to names and links. Throws at build time on a stale ref. */
export function workServices(project: WorkProject) {
  return project.services.map(({ category, id }) => {
    const cat = serviceCategories.find((c) => c.slug === category);
    const service = cat?.services.find((s) => s.id === id);
    if (!cat || !service) throw new Error(`work.ts: ${project.slug} references unknown service ${category}#${id}`);
    return { name: service.name, category: cat.name, href: `/services/${cat.slug}/#${service.id}` };
  });
}

/** The project's own JSON-LD node, shared by /work and its case study. */
export function workSchema(project: WorkProject) {
  const sdm = { "@type": "Organization", name: "Stone Dragon Media, LLC", url: "https://stonedragonmedia.com/" };
  return {
    "@type": project.schemaType,
    name: project.name,
    url: project.url,
    description: project.schemaDescription,
    image: `https://stonedragonmedia.com${project.thumb}`,
    creator: sdm,
    ...(project.ownedBySdm ? { publisher: sdm } : {}),
    ...(project.schemaType === "WebApplication" ? { applicationCategory: "ProductivityApplication", operatingSystem: "Web" } : {}),
  };
}
