# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: owners of small local businesses** in Sandusky, Erie County, and the surrounding
Firelands / north-central Ohio area. They usually have no in-house technical staff, need a website
or a business application, and want a nearby partner they can meet in person and who will still be
there after launch. They arrive mostly through local search ("Sandusky Ohio web design") or a
referral. They are deciding whether to get in touch.

Secondary audiences (confirmed by the repo, not the primary target):

- Remote clients elsewhere in the US, served the same way but without on-site meetings.
- **Existing clients** who sign in to the portal (`/dashboard`) to check their projects' task
  boards, view and pay invoices, open and reply to support tickets, and manage their account.
- **The owner/admin**, who runs the business day to day in `/admin`: clients, projects (Kanban
  task board, notes, time tracking), billing, ticket replies, and "View as client".

## Product Purpose

Stone Dragon Media, LLC is a web design and digital strategy agency based in Sandusky, Ohio. One
Astro app does two jobs:

1. **Marketing site**: explains the services, shows real shipped work, and turns a visitor into
   a contact-form inquiry ("Discuss Your Project"; free consultation; reply within one business
   day). Local SEO is a core goal.
2. **Client portal + admin**: the working relationship after a client signs on, covering
   projects, tasks, invoices, and tickets.

Success: local business owners find the site, trust it enough to start a conversation, and stay
on as supported clients after launch.

## Positioning

What future work should lean on. All four come from the owner:

- **Local and in person.** Based in Sandusky; meets clients face to face within about an hour's
  drive (Toledo to Cleveland). Farther clients are served remotely.
- **Experience since 1998.** A long IT and development background that ties design decisions to
  how the website or application actually needs to work.
- **Runs its own products.** Builds and operates Firelands Current (its own digital newspaper)
  and Tagstash, so it knows publishing, customer accounts, payments, and maintaining software after
  launch first-hand.
- **Support after launch.** Hosting, security checks, maintenance, and ongoing improvements,
  delivered through a real client portal with tickets and billing.

## Operating Context

- Services are four categories with two services each (`src/lib/services.ts`): Design &
  Development, Marketing & Analytics, Hosting & Security, Branding & Consulting.
- Portfolio and case studies come from `src/lib/work.ts`; service coverage comes from
  `src/lib/service-area.ts`; social profiles come from `src/lib/social.ts`.
- Inquiries come in through the contact form (Web3Forms + hCaptcha), and a `?service=<slug>`
  preselect links the form from each service page. Phone: (567) 450-0960.
- Portal users work in ordinary desktop and phone browsers. The admin uses the portal as a daily
  operations tool, and clients use it occasionally.

## Capabilities and Constraints

- Astro 7 + TypeScript on a Cloudflare Worker with D1; no UI framework, `.astro` with inline
  styles/scripts. Marketing pages are prerendered static HTML; the portal is server-rendered.
- Workers Free plan limits (10 ms CPU, 50 D1 queries per invocation) constrain portal pages.
- SEO is first-class: keyworded titles and H1s, JSON-LD on every marketing page, one `<h1>` per
  page through `PageHero`.
- Invoices are manual D1 records with an optional Stripe **Pay now** link; nothing syncs from an
  accounting system.
- Impersonation ("View as client") is strictly read-only.
- Deliberately absent: no prices published anywhere on the site, no FAQ section, and no street
  address (home-based business; city and state only).

## Brand Commitments

- Name: **Stone Dragon Media** (legal: Stone Dragon Media, LLC). Logo: `public/logo.png`,
  `public/logo-cropped.png`, `public/dashboard-logo.png`, `public/favicon.png`.
- Voice: a solo owner-operator who writes as **"we"**. The copy is plain, direct, and
  customer-focused ("Make it easy for customers to understand what you offer and get in touch").
- Owned properties to describe accurately: Firelands Current (owned and operated, live), Tagstash
  (live), and Chomp Chomp Panic! (a kaiju game **in development**; never imply it has launched).

## Evidence on Hand

- Portfolio: Firelands Current, JD Musick, Simon Rook, Dorian Black, Pneumaris, and Tagstash, with
  screenshots in `public/work/` (1180×615 WebP) and case studies in `src/lib/work.ts`, written
  from each project's own repo.
- Game title art: `public/products/chomp-chomp-panic.png`. Page hero photos: `public/*-header.webp`,
  `header-bg.webp`, `contact-bg.webp`.
- **Absent; do not fabricate:** testimonials, client quotes, results or metrics, prices, and any
  claim about whether the JD Musick, Simon Rook, Dorian Black, or Pneumaris work was for outside
  clients. Describe only features that actually shipped.

## Product Principles

1. **Earn the first conversation.** Every marketing surface should make it easy to understand
   what's offered and to get in touch. The free consultation and one-business-day reply are the
   promise.
2. **Local and real over generic agency polish.** Lead with what's true and checkable: the place,
   the years, the products the business runs, and the work it shipped.
3. **Never overclaim.** No invented proof, prices, radius, or launch status. Accuracy is part of
   the brand.
4. **The relationship continues after launch.** The portal is the support promise made concrete,
   so it should feel dependable and calm to use.
5. **Fast, findable, maintainable.** Page speed, local SEO, and simple code that one person can
   maintain are product requirements, not polish.

## Accessibility & Inclusion

Both the marketing site and the portal target **WCAG 2.2 AA**. Established patterns to preserve:
skip link to `#main-content`, a keyboard-operable alternative to every drag interaction (the
Kanban lane `<select>`), polite live-region announcements for in-page changes (`announce()`),
4.5:1 text contrast on the marketing palette, minimum hit areas of 32px on desktop and 44px on
mobile, and correct landmarks (footer outside `<main>`).
