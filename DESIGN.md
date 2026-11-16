---
name: Stone Dragon Media
description: Faceted slate stone and Lake Erie blue for a Sandusky, Ohio web design agency.
colors:
  slate: "#1b2933"
  slate-2: "#22384a"
  stone: "#e5e9eb"
  stone-face: "#f7f8f9"
  seam: "#c3ccd3"
  lake: "#1d5a86"
  lake-deep: "#154566"
  mist: "#a9c1d4"
  ink-soft: "#465868"
  on-slate: "#dfe7ed"
  field-edge: "#7d8d9a"
  white: "#ffffff"
  portal-ink: "#10263b"
  portal-ink-soft: "#3e5b73"
  portal-brand: "#1f4f77"
  portal-brand-strong: "#143755"
  portal-success: "#0b5f33"
  portal-warning: "#7d5a12"
  portal-danger: "#7d2121"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Schibsted Grotesk, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  headline-band:
    fontFamily: "Schibsted Grotesk, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Schibsted Grotesk, Archivo, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
    lineHeight: 1.6
  button:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 600
    lineHeight: 1.2
  breadcrumb:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 500
    fontVariation: "\"wdth\" 87.5"
  portal-heading:
    fontFamily: "Sora, sans-serif"
    fontWeight: 700
  portal-body:
    fontFamily: "Outfit, sans-serif"
    fontWeight: 400
rounded:
  none: "0"
  control: "3px"
  pill: "999px"
  portal-sm: "0.55rem"
  portal-md: "0.65rem"
  portal-lg: "0.95rem"
spacing:
  gutter: "clamp(1.1rem, 2.5vw, 2.4rem)"
  cut: "1.1rem"
  cleave: "clamp(2rem, 5vw, 4.5rem)"
  page-top: "clamp(2rem, 4vw, 3rem)"
  section: "clamp(3rem, 6vw, 4.5rem)"
  band-top: "clamp(3.5rem, 7vw, 5.5rem)"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.lake}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.78rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.lake-deep}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.78rem 1.25rem"
  button-secondary-hover:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.white}"
  button-primary-on-slate:
    backgroundColor: "{colors.white}"
    textColor: "{colors.slate}"
  button-primary-on-slate-hover:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.slate}"
  button-secondary-on-slate:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
  button-secondary-on-slate-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.slate}"
  card:
    backgroundColor: "{colors.stone-face}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "1.35rem 1.5rem 1.5rem"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.slate}"
    rounded: "{rounded.control}"
    padding: "0.7rem 0.8rem"
  nav-link:
    textColor: "{colors.slate}"
    typography: "{typography.label}"
    padding: "0.5rem 0.6rem"
  nav-link-hover:
    textColor: "{colors.lake}"
  page-hero:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.white}"
    typography: "{typography.display}"
    height: "clamp(360px, 42vw, 470px)"
  band:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.on-slate}"
  portal-button-primary:
    backgroundColor: "{colors.portal-brand}"
    textColor: "{colors.white}"
    typography: "{typography.portal-heading}"
    rounded: "{rounded.portal-md}"
    padding: "0.6rem 1rem"
  portal-card:
    backgroundColor: "{colors.stone-face}"
    textColor: "{colors.portal-ink}"
    rounded: "{rounded.portal-lg}"
    padding: "1.1rem"
---

# Design System: Stone Dragon Media

## Overview

**Creative North Star: "The Cut Stone"**

The marketing site is one piece of dressed slate, split cleanly in a few deliberate places. The
palette comes from the logo's faceted slate stone and the Lake Erie hero photography: a solid light
stone page, slate for the heavy surfaces, and one lake blue for action and links. The only ornament
is the cut itself. Cards lose one corner to a chamfer, the hero's bottom edge is cleaved on the
diagonal, and the full-bleed slate band takes the matching cut along its top, so a page reads as a
single stone split in two places.

The mood is **sturdy, plain-spoken, and precise**. Surfaces are flat and change tone instead of
casting shadows. Corners are either square, cut, or barely softened (3px). Type is a compact,
heavy newspaper grotesque over a straightforward sans body. The craft is in exact joins (a 1px seam
drawn precisely along a chamfer) rather than in effects. The site explicitly rejects
**startup SaaS gloss**: gradients, glassmorphism, glowing blobs, and purple-blue hero washes.

The client portal (`/dashboard`, `/admin`) is currently a **legacy dialect** with its own fonts,
rounded corners, and a gradient button. It is documented below so it stays consistent, but it is
marked to **converge toward the Cut Stone system over time**. New portal work moves it closer;
nothing moves the marketing site toward it.

**Key Characteristics:**
- Solid stone page, slate surfaces, one lake-blue accent.
- The facet (chamfered corner, cleaved edge) is the only decorative device.
- Flat at rest: depth comes from tone and seams, not shadows.
- Schibsted Grotesk bold headings over an Archivo body.
- One motion moment per page: the hero settling in on load.

## Colors

A cool, low-chroma slate-and-stone neutral family with a single saturated lake blue.

### Primary
- **Lake** (`lake`): the one action colour, used for primary button fills, body-copy links,
  card-link and nav hover, the active-nav underline, the dropdown's top rule, focus outlines, and
  the required-field mark. It clears 4.5:1 on both Stone and Stone Face.
- **Lake Deep** (`lake-deep`): hover and pressed state for Lake (primary button hover, link hover).
  It is never used as a resting colour.

### Neutral
- **Slate** (`slate`): heavy surfaces such as the hero base, the full-bleed band, and the utility
  bar, plus heading text and the secondary button outline and fill. The hero's image wash is Slate
  at 94%, falling to 5% across the image.
- **Slate 2** (`slate-2`): a slightly bluer slate used as `--brand-strong` on the marketing site,
  for footer links and the skip link.
- **Stone** (`stone`): the page background, always solid. It also shows through every cut.
- **Stone Face** (`stone-face`): the lighter raised face for cards, the header bar, and the nav
  dropdown.
- **Seam** (`seam`): every 1px joint, including card edges, the chamfer diagonal, header and
  footer rules, and dividers.
- **Ink Soft** (`ink-soft`): secondary text such as card body copy, captions, and footer details.
  It clears 4.5:1 on Stone and Stone Face.
- **Mist** (`mist`): the accent on slate, used for breadcrumb text, the outline of secondary
  buttons on slate, the hover of primary buttons on slate, and focus outlines inside the hero,
  band, and utility bar.
- **On Slate** (`on-slate`): body and description text on Slate surfaces.
- **Field Edge** (`field-edge`): form-field borders, chosen for 3:1 against a white field.

### Portal (legacy)
- **Portal Ink / Ink Soft / Brand / Brand Strong** (`portal-ink`, `portal-ink-soft`,
  `portal-brand`, `portal-brand-strong`): the portal's own blues. Brand Strong fills the sidebar
  and colours headings, labels, and table headers.
- **Success / Warning / Danger** (`portal-success`, `portal-warning`, `portal-danger`): status text
  on 12–14% tints of themselves, used for badges, notices, and Kanban priority.

### Named Rules
**The One Blue Rule.** Lake is the only saturated colour on a marketing page. It marks what can be
clicked or what has focus, never decoration.

**The Solid Ground Rule.** The marketing page background is solid Stone. No gradients,
textures, or tinted sections. Contrast is only promised against Stone and Stone Face.

## Typography

**Display Font:** Schibsted Grotesk 700 (with Archivo, system-ui)
**Body Font:** Archivo 400–700, width axis 87.5–100 (with system-ui)
**Portal (legacy):** Sora for headings and buttons, Outfit for body

**Character:** a compact, sturdy newspaper grotesque set bold and slightly tight, over a plain,
even sans that stays out of the way. The pairing reads as a local paper's masthead rather than a
tech brand.

### Hierarchy
- **Display** (`display`): the page's single `<h1>`, rendered only by the hero, capped at
  20ch and balanced. The compact hero drops it to `clamp(2rem, 3.4vw, 2.75rem)`.
- **Headline** (`headline`): section titles on the stone page, in Slate.
- **Headline Band** (`headline-band`): section titles on a slate band, in white, capped at 22ch on
  CTA bands.
- **Title** (`title`): card headings (`h3`), in Slate.
- **Lead** (`lead`): an opening paragraph, capped at 68ch.
- **Body** (`body`): all running copy. Paragraphs on a band are capped at 62ch.
- **Label** (`label`): primary navigation, at weight 500 (600 when active).
- **Button** (`button`): all marketing buttons.
- **Breadcrumb** (`breadcrumb`): the hero's trail, at Archivo's condensed width (87.5%), in Mist.

### Named Rules
**The One Face Per Role Rule.** Schibsted Grotesk is used only for `h1`–`h3`, at weight 700.
Everything else is Archivo. Fonts load only the axes in use, so no new weights or widths appear
without changing the font link.

**The Keyword Headline Rule.** Headings carry their topic ("Our Web Design & Digital Services"),
never a bare label. This is both an SEO requirement and the plain-spoken voice.

## Layout

- **Container:** every marketing column is at most `container` (1280px) wide, including its
  `gutter`. The page column, the header, the hero content, the footer, and the band's inner content
  all line up on that edge.
- **Rhythm:** the page column opens with `page-top` padding, sections are separated by `section`,
  and a band starts `band-top` below the content before it. The page column carries no bottom
  padding; the footer wrapper does (3rem).
- **Page frame:** every marketing page is a full-bleed hero, then the page column, then optionally
  a full-bleed slate band, then the footer outside `<main>`.
- **Grids:** service cards and work tiles run four across, drop to two below 1100px, and to one
  below 640px. Gaps are 1rem for cards and 1.25rem for tiles.
- **Header:** a slim slate utility bar (phone, city, socials) sits above the logo and nav row. Below
  920px it becomes a hamburger with a compact **Start a Project** button beside it, and below 640px
  the utility bar's socials are hidden.
- **Portal (legacy):** a 220px Brand Strong sidebar beside the main column, which stacks below
  60rem. Forms run two columns and stack below 40rem. Tables scroll inside their own
  keyboard-focusable region. The Kanban board runs five columns, two below 1200px, and one
  below 640px.

## Elevation & Depth

The system is **flat by default**. Depth comes from tone (a Stone Face card on a Stone page, a
Slate band below the page) and from 1px Seam joints drawn as inset box-shadows, not from drop
shadows. The one true shadow is the services dropdown, because it really does float over the hero.

### Shadow Vocabulary
- **Seam edge** (`box-shadow: inset 0 0 0 1px #c3ccd3`): draws a card's edges inside its
  clip-path.
- **Active rule** (`box-shadow: inset 0 -2px 0 #1d5a86`): the current-page underline in the nav.
  It moves to the left edge (`inset 2px 0 0`) in the stacked mobile nav and in the dropdown.
- **Dropdown lift** (`box-shadow: 0 14px 28px rgba(27, 41, 51, 0.16)`): the services submenu only.

### Named Rules
**The No Drop Shadow Rule.** Cards, tiles, buttons, and bands never cast a shadow. A surface earns
separation from a tone change and a seam. Only a genuinely floating menu gets a lift.

## Shapes

The form language is **square, cut, or barely softened**:

- **The chamfer:** a card's top-right corner is cut away by `cut` (1.1rem) with a `clip-path`
  polygon. A 225° gradient paints a 1px Seam line exactly along the diagonal. Portfolio screenshots
  (`.shot img`) take the same chamfer.
- **The cleave:** the hero's bottom edge runs from 64% across down to the right edge, cut by
  `cleave`. The band's top edge mirrors it, rising from the left to 36% across. Stone shows
  through both cuts.
- **Controls:** buttons, inputs, and the hamburger use `control` (3px), just enough to avoid
  harshness without reading as rounded.
- **Pills:** used only for the circular social-icon hit areas (`pill`).
- **Portal (legacy):** rounded corners from `portal-sm` to `portal-lg`, plus pill badges. These are
  the shapes marked to converge.

### Named Rules
**The Two Cuts Rule.** The facet appears in exactly two forms: the corner chamfer on cards and
screenshots, and the cleaved edge on the hero bottom and the band top. Nothing else gets angles,
notches, or diagonal dividers.

## Components

### Buttons
Solid, confident blocks with crisp edges, always with a verb label.
- **Shape:** barely softened (3px), with a 1.5px border slot so outline and fill variants line up.
- **Primary:** a Lake fill with white text (`button-primary`), optionally with a 1rem leading Lucide
  icon.
- **Secondary:** a transparent fill with a Slate outline and text that fills solid Slate on hover
  (`button-secondary`).
- **On slate (hero, band):** the primary turns white with Slate text and hovers to Mist. The
  secondary takes a Mist outline with white text and hovers to a white fill.
- **States:** background, border, and colour change over 140ms ease, with no movement or scale.
  Focus is a 2px Lake outline at a 3px offset (Mist on slate).
- **Header size:** `0.62rem 1rem` padding, and `0.5rem 0.75rem` for the mobile bar CTA.

### Cards / Containers
- **Corner style:** square, with the top-right chamfer (see Shapes).
- **Background:** Stone Face on the Stone page.
- **Shadow strategy:** none; a seam edge only (see Elevation & Depth).
- **Border:** a 1px Seam inset on all edges, plus the painted diagonal.
- **Internal padding:** `1.35rem 1.5rem 1.5rem`.
- **Watermark icon:** the category's Lucide icon bleeds off the bottom-right corner at 82% of card
  height, in Slate at 6% opacity, behind the content. Body text over it stays above 4.5:1.
- **Card link:** Lake, weight 600, 0.95rem, underlined at 1px, thickening to 2px in Lake Deep on
  hover.

### Screenshot Tile
A portfolio thumbnail (1180×615, cropped to the top) with the chamfer, a weight-600 name, and an
Ink Soft description underneath. On hover the image brightens to 106% and the name turns Lake and
underlined.

### Inputs / Fields
- **Style:** a white field with a 1px Field Edge border, 3px corners, `0.7rem 0.8rem` padding, and
  1rem text. Labels are 0.9rem, weight 600, in Slate. The required mark is Lake.
- **Focus:** the border turns Lake, alongside the global 2px Lake focus outline.

### Navigation
- **Desktop:** Archivo labels (0.95rem/500) in Slate that turn Lake on hover. The current page is
  weight 600 with a 2px Lake underline drawn as an inset shadow, not a filled pill. **Client Login**
  sits after a 1px Seam divider in Ink Soft, so it doesn't read as a content page.
- **Services dropdown:** a Stone Face panel with a Seam border, a 2px Lake top rule, and the
  dropdown lift. Items highlight to Stone on hover, and the current item gets a 2px Lake left rule.
  The chevron rotates 180° over 140ms (only when motion is allowed).
- **Mobile (below 920px):** a stacked panel opened by a 2.75rem hamburger. The active rule moves to
  the left edge, the login divider becomes a rule above it, the dropdown becomes an indented block
  with a 2px Seam left border, and every target is at least 44px.
- **Utility bar:** a Slate strip with 0.85rem text in `#c9d6e0`, the phone number in white at
  weight 600, and social icons in 1.85rem circular hit areas.

### Page Hero (signature)
A full-bleed photograph under a Slate wash that fades from 94% on the text side to 5% across the
image (an even 72–88% vertical wash on phones). It holds the breadcrumb, the page's single `h1`, a
description in On Slate, and the action row. The bottom edge is cleaved. It comes in three heights:
default `clamp(360px, 42vw, 470px)`, `tall` for the home page, and `compact` for pages that lead
with a form. On load the image settles from 104.5% scale over 1400ms, and the text rises 12px over
700ms, staggered by 80ms, using `cubic-bezier(0.2, 0.7, 0.2, 1)`. This happens only when motion is
allowed and is the site's only unprompted motion.

### Slate Band (signature)
A full-bleed Slate section with a cleaved top-left edge, white `headline-band` headings, On Slate
body text, white links, and on-slate buttons. The CTA band variant closes hub and service pages.

### Portal (legacy)
Rounded Stone Face cards (`portal-lg`) with a 1px line, and a Brand Strong sidebar whose nav links
have rounded `portal-sm` highlights at white 8% (hover) and 14% (active). The primary button is a
gradient from `#1f5a89` to `#2f709f` in Sora (`portal-button-primary` records the base colour).
Badges and notices are tinted pills and blocks in the status colours. Data tables have uppercase
Sora headers. The Kanban board uses rounded columns and cards. All of these are documented to keep
the portal consistent while it converges. New portal work prefers the marketing system's shapes and
flat fills where it can.

## Do's and Don'ts

### Do:
- **Do** keep the page background solid Stone and put content on Stone Face cards separated by 1px
  Seam joints.
- **Do** use Lake only for things that act or have focus: buttons, links, the active rule, and
  focus outlines.
- **Do** confine the facet to the card and screenshot chamfer (`cut`, 1.1rem) and the hero and band
  cleave (`cleave`).
- **Do** set every `h1`–`h3` in Schibsted Grotesk 700 at -0.015em (the hero uses -0.02em) and
  everything else in Archivo.
- **Do** keep button states to colour changes over 140ms ease, and gate every animation behind
  `prefers-reduced-motion: no-preference`.
- **Do** check 4.5:1 text contrast against Stone and Stone Face, and 3:1 for field edges
  (Field Edge on white).
- **Do** move the portal toward these shapes and flat fills when touching it, and put shared portal
  fixes in `public/universal.css` once.

### Don't:
- **Don't** use startup SaaS gloss: gradients, glassmorphism, glowing blobs, or purple-blue hero
  washes. The hero's only gradient is the Slate photo wash.
- **Don't** add drop shadows to cards, tiles, buttons, or bands. Only the floating dropdown is
  lifted.
- **Don't** add angles, notches, or diagonal dividers anywhere beyond the Two Cuts.
- **Don't** round marketing cards or use pill-shaped buttons. Corners are square, cut, or 3px.
- **Don't** introduce a second accent colour, or use Lake decoratively.
- **Don't** add motion beyond the hero's settle-in on load. Nothing else animates unprompted.
- **Don't** carry the portal's Sora/Outfit fonts, rounded corners, or gradient button onto
  marketing pages.
