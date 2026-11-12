# BEN 10 // OMNIVERSE PROTOCOL
## Product Requirements Document (PRD)

**Document version:** 1.0
**Status:** Shipped — v1.0 build complete
**Product type:** Fan-made, non-commercial interactive archive site
**Platform:** Static web (HTML / CSS / vanilla JavaScript), desktop + mobile
**Owner:** Design & build: single-agent product team
**Last updated:** 13 November 2026

---

## 1. Executive summary

**Ben 10 // Omniverse Protocol** is a cinematic, single-purpose fan archive for the Ben 10
universe. It treats the franchise like a declassified field database: an Omnitrix boot sequence,
a live dial, ten full alien dossiers, a searchable encyclopedia of the entire franchise, and a
fuzzy DNA matcher that finds a form even when the visitor misspells it.

The site is not a wiki clone. It is a *designed object*: a dark, high-contrast interface with
3D dial interaction, warp transitions between pages, original vector alien portraits, and an
original synthesised boot sting. Every route is a page; every alien is a dossier.

**The one-line pitch:**
> A hacker-terminal Omnitrix that turns the Ben 10 universe into a playable archive.

---

## 2. Problem statement

Ben 10 has one of the largest rosters in animation — five series eras, dozens of Omnitrix
variants, hundreds of transformations — and almost all of that information lives in ad-heavy
wikis with flat navigation and no sense of *place*. A fan who wants to know "what does Cannonbolt
actually do" has to read a table. Nothing in the ecosystem feels like the show.

**The opportunity:** the Omnitrix itself is the interface metaphor. A dial, a playlist, a DNA
sample, a transformation. If the product behaves like the device, the information becomes
memorable and the archive becomes an experience.

**The constraint:** this is a fan project. No official artwork, logos, or audio may be shipped.
Every asset must be original and defensible.

---

## 3. Goals and non-goals

### 3.1 Goals

| # | Goal | Success signal |
|---|------|----------------|
| G1 | Make the archive feel like the Omnitrix, not a wiki | Boot sequence, dial, warp transition on every route change |
| G2 | Cover ten featured aliens in genuine depth | Each dossier has 8+ data blocks, radar chart, related forms |
| G3 | Make the whole franchise searchable | 55+ aliens, 86 encyclopedia entries, 5 eras, 4 devices |
| G4 | Forgive bad spelling | Fuzzy matcher returns Four Arms for "forearms" |
| G5 | Never dead-end the visitor | Themed 404 with suggestions and recovery actions |
| G6 | Hold up on a phone | No horizontal overflow at 360px, mobile nav, stacked grids |
| G7 | Ship with zero build step | Open `index.html` or run one Node command |
| G8 | Be legally clean | 100% original vector art and synthesised audio |

### 3.2 Non-goals

- No accounts, comments, or user-generated content.
- No backend, database, or CMS. Content lives in JS data modules.
- No monetisation, ads, or tracking.
- No official media assets (art, logos, episode audio/video).
- No episode guide or episode-level synopses in v1.0.
- No i18n. English only.

---

## 4. Target users

### Persona A — "The Rewatcher" (primary)
- 18–30, grew up on the original series, returned via Omniverse or the reboot.
- Wants nostalgia delivered with modern craft.
- **Needs:** instant recognition, deep-cut references, a reason to click ten times.
- **Frustration:** wikis feel like homework; fan sites look like 2011.

### Persona B — "The Curious Newcomer"
- 13–18, found the franchise through the reboot or TikTok edits.
- Doesn't know the difference between the Ultimatrix and the Omniverse watch.
- **Needs:** orientation, plain-language summaries, a search that doesn't punish typos.
- **Frustration:** terminology walls, spoiler-heavy wikis.

### Persona C — "The Design Audience" (hackathon judges / portfolio viewers)
- Evaluates craft: motion, typography, consistency, responsiveness.
- **Needs:** a first 5 seconds that signals quality, and depth on scroll.
- **Frustration:** concept decks with no working artefact.

---

## 5. Product principles

1. **The device is the navigation.** Every transition is a transformation, not a page load.
2. **Dark, but legible.** Neon green on near-black, with AA-level body contrast.
3. **Density with hierarchy.** Dense data is fine; undifferentiated data is not.
4. **Motion earns its place.** Animation communicates state (warping, scanning, locking).
5. **Never punish the user.** Typos are matched, empty states suggest, 404s recover.
6. **Original or nothing.** No borrowed assets, ever.

---

## 6. Information architecture

```
/                          Home — hero, dial, featured ten, eras, modes
/aliens.html               Alien Archive — 10 featured + 45 archive forms, filters
/aliens/{slug}.html        Alien Dossier ×10 — full record + transformation replay
/omnitrix.html             Omnitrix Lab — device modes, exploded dial, specs
/encyclopedia.html         Encyclopedia — 86 entries across 6 categories
/universe.html             Universe — timeline of 5 eras, factions, devices
/search.html               Universal Search — fuzzy matcher, full result set
/about.html                About — design system, credits, rights notice
/404.html                  Signal Lost — themed error + recovery
```

**Navigation:** Home · Aliens · Omnitrix · Encyclopedia · Universe · Search · About
(7 items, collapsed to a full-screen mobile menu under 1024px.)

---

## 7. Functional requirements

### FR-1 Boot sequence
- On first visit per browser, a full-screen boot overlay appears with an Omnitrix render,
  a progress sequence, and an original synthesised sting.
- Audio only starts on user gesture (browser autoplay policy). A visible **Enter** control
  and a **Skip** control are always present.
- Boot is remembered in `localStorage['b10-booted']`; subsequent visits skip it.
- A nav control re-plays the boot on demand.

### FR-2 Warp transition
- Any internal link marked `data-warp="<label>"` triggers a full-screen warp overlay.
- The destination label is stored in `sessionStorage['b10-warp']` and read on the next page,
  which plays an *arrival* transformation: the dial spins, locks, and reveals the label.
- Falls back to a normal navigation if `sessionStorage` is unavailable.

### FR-3 Alien dossier
- Ten routes: heatblast, four-arms, xlr8, diamondhead, upgrade, ghostfreak, ripjaws,
  stinkfly, wildmutt, cannonbolt.
- Each dossier includes: hero portrait + holo ring, species/home/voice metadata, radar chart
  across six attributes, stat bars, weaknesses, signature moves, first appearance, related
  forms, and a **Replay transformation** control.
- Opening a dossier from a card sets the dial to that alien's accent colour and glyph.

### FR-4 Archive
- 10 featured aliens rendered as large art cards.
- 45 archive forms rendered as uniform cards with era tags.
- Filter by era (Original / Alien Force / Ultimate Alien / Omniverse / Reboot) and by
  attribute; live text filter; result count; empty state.

### FR-5 Universal search
- Searches aliens (featured + archive), encyclopedia entries, factions, worlds, devices.
- Tolerant of typos via normalisation + Levenshtein distance + alias table.
- Thresholds: score ≥ 40 to appear; ≥ 55 to be offered as "Did you mean".
- Every result row shows the alien portrait where one exists.
- Zero results routes to `/404.html?q=<query>` rather than an inline dead end.
- Keyboard: `/` or `Ctrl/Cmd+K` opens the search overlay from any page; `Esc` closes.

### FR-6 Encyclopedia
- 86 entries across Characters (16), Worlds (16), Factions (8), Devices (9), Series (5),
  Glossary (32).
- Category tabs, live fuzzy text filter, live count, empty state.
- Each card: category chip, name, one-line descriptor, 2–3 sentence body, cross-link.

### FR-7 Themed 404
- Reads `?q=` and displays the failed query.
- Offers 3–4 nearest matches as chips, plus actions: open archive, run search, go home.
- Uses the Omnitrix render as a rotating watermark and a red "signal lost" status.

### FR-8 Audio
- Original WebAudio sting composed in code (oscillators + filtered noise + envelope).
- Global sound toggle persisted in `localStorage`.
- Respects `prefers-reduced-motion`; audio is opt-in via gesture.

### FR-9 Motion & accessibility
- Canvas particle field on the home hero, paused when off-screen.
- Scroll reveal via `IntersectionObserver`.
- Custom cursor on pointer-fine devices only.
- `prefers-reduced-motion: reduce` disables transforms, parallax, and long animations.
- Semantic landmarks, visible focus rings, `aria-label` on icon-only controls,
  `aria-current` on the active nav item.

### FR-10 Content data model
- `assets/js/data.js` — aliens, series, modes, factions, glyphs, helpers.
- `assets/js/lore.js` — encyclopedia dataset.
- Load order is fixed: `data.js` → `lore.js` (encyclopedia only) → `app.js` → `render.js`
  → `render-pages.js`.

---

## 8. Content requirements

### 8.1 The featured ten

| # | Alien | Species | Home world | Core hook |
|---|-------|---------|-----------|-----------|
| 001 | Heatblast | Pyronite | Pyros | Living starfire; absorbs flame |
| 002 | Four Arms | Tetramand | Khoros | Four arms, seismic slam |
| 003 | XLR8 | Kineceleran | Kinet | Velocity in a visor |
| 004 | Diamondhead | Petrosapien | Petropia | Crystal armour, shard volleys |
| 005 | Upgrade | Galvanic Mechamorph | Galvan Prime | Merges with technology |
| 006 | Ghostfreak | Ectonurite | Anur Phaetos | Intangibility, possession |
| 007 | Ripjaws | Piscciss Volann | Piscciss | Deep-water apex predator |
| 008 | Stinkfly | Lepidopterran | Lepidopterra | Flight + corrosive goo |
| 009 | Wildmutt | Vulpimancer | Vulpin | Blind, scent-driven tracker |
| 010 | Cannonbolt | Arburian Pelarota | Arburia | Armoured rolling impact |

Each entry requires: name, slug, species, home world, body type, voice claim, first
appearance, six radar attributes, six stat bars, weakness list, three signature moves,
two related forms, accent colour, and glyph.

### 8.2 Archive + encyclopedia
- 45 additional forms spanning all five eras, each with era tag, species, and one-liner.
- 86 encyclopedia entries as specified in FR-6.

### 8.3 Tone of voice
- Field-report clipped. Short sentences. Technical nouns.
- No exclamation marks. No "awesome". No emoji in UI copy.
- Second person for instructions ("Slam the dial"), third person for lore.

---

## 9. Design requirements

### 9.1 Visual system
- **Palette:** near-black `#050705`, panel `#0b0f0a`, neon green `#a3ff12`,
  deep green `#57c400`, alert red `#e2493f`, off-white ink.
- **Type:** display — condensed uppercase grotesque; body — humanist sans;
  mono — uppercase micro-labels at 7–9px with 0.16–0.24em tracking.
- **Layout:** 12-column shell, max-width ~1320px, 24px gutters, 1px hairline borders.
- **Texture:** subtle grid overlays, radial glows, scanlines, corner brackets.

### 9.2 Motion
- Page warp: 480ms, scale + blur + label reveal.
- Dial: 3D tilt on pointer, continuous ring rotation, pulse ring.
- Cards: 3px lift on hover, accent border glow, portrait scale 1.04.
- Reveal: 18px rise + fade, staggered 60ms.

### 9.3 Artwork
- Ten original SVG portraits (600×600 viewBox) with species-specific silhouettes,
  rim lighting, accent gradients, and a consistent "holo specimen" framing.
- One detailed original Omnitrix SVG (800×800) used in boot, 404, and lab.

---

## 10. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Performance | First paint < 1.5s locally; no render-blocking JS beyond 5 files; SVG art < 7KB each |
| Compatibility | Evergreen Chrome, Edge, Firefox, Safari; no IE |
| Responsiveness | 360 / 480 / 768 / 1024 / 1440 breakpoints; zero horizontal scroll at 360 |
| Accessibility | Landmarks, focus-visible, aria labels, reduced-motion, contrast ≥ 4.5:1 for body text |
| SEO | Unique `<title>` and meta description per page; semantic headings |
| Privacy | No analytics, no cookies, no third-party requests |
| Licensing | All assets original; rights disclaimer on About and in footer |
| Maintainability | Data-driven rendering; one data module per content domain |

---

## 11. Success metrics

| Metric | Target |
|--------|--------|
| Pages reachable without a dead link | 100% |
| Console errors across all routes | 0 |
| Search recall on 10 seeded typos | ≥ 9/10 |
| Mobile horizontal overflow at 360px | 0px |
| Alien dossiers with complete data | 10/10 |
| Encyclopedia entries rendered | 86/86 |
| Lighthouse performance (local) | ≥ 90 |
| Time to first "wow" (boot → hero) | < 8s |

---

## 12. Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Copyright exposure from official art/audio | High | All art hand-authored SVG; audio synthesised in-browser |
| Autoplay policy blocks boot sound | Medium | Gesture-gated audio; silent boot still complete |
| Fuzzy search over-matches | Medium | Two thresholds; alias table; "Did you mean" separated from results |
| `sessionStorage` blocked (file:// quirks) | Low | Try/catch; graceful fallback to instant navigation |
| Dense UI unreadable on small screens | High | Dedicated breakpoint file; grids collapse to one column |
| Single-agent build drift | Medium | Shared data modules + fixed script order + CSS module boundaries |

---

## 13. Release criteria (v1.0)

- [x] 7 core pages + 10 alien dossiers + 404 implemented
- [x] Boot sequence with original sting and skip control
- [x] Warp transition on all internal navigation
- [x] Fuzzy search with typo tolerance and portrait results
- [x] 86-entry encyclopedia with category filtering
- [x] Themed 404 with query echo and suggestions
- [x] 10 original alien portraits + 1 original Omnitrix render
- [x] Responsive down to 360px
- [x] Reduced-motion support
- [x] Rights disclaimer
- [x] Local server + zero-build fallback
- [x] PRD, implementation plan, deck, PDF exports

---

## 14. Future roadmap (post-v1.0)

1. **Episode guide** — 200+ episodes with per-era filtering and alien debut mapping.
2. **Playlist builder** — pick 10 forms, persist locally, share via URL hash.
3. **Ultimate forms** — a second dossier tier with evolved artwork.
4. **Timeline scrubber** — drag across eras and watch the watch change.
5. **Audio suite** — per-alien transformation stings, muteable by category.
6. **CMS bridge** — optional JSON export so content can be edited without code.

---

## 15. Rights notice

Ben 10 and all related characters are the property of Cartoon Network / Warner Bros.
Discovery. This is a non-commercial fan project. No official artwork, logos, footage, or
audio are included. All illustrations, interface design, code, and sound are original work
created for this project.
