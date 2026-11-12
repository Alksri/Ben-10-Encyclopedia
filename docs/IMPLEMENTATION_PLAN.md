# BEN 10 // OMNIVERSE PROTOCOL
## Implementation Plan

**Version:** 1.0
**Companion to:** `docs/PRD.md`
**Build model:** Single-agent, zero-build static site
**Status:** Complete

---

## 1. Approach

The site is deliberately built without a framework, bundler, or package manager. That decision
drives everything else:

- **No build step** means the artefact is the source. Anyone can open `index.html` or run
  `node serve.js` and see exactly what ships.
- **No framework** means every kilobyte of motion, layout, and interaction is intentional.
- **Data-driven rendering** keeps 55 aliens and 86 encyclopedia entries maintainable in
  plain JS modules.

The build was executed in seven phases, each ending in a runnable artefact.

---

## 2. Phase plan

### Phase 0 — Foundation (complete)
**Goal:** a design system and shell that every page inherits.

| Task | Output |
|------|--------|
| Define tokens: colour, type, spacing, motion, radii | `assets/css/base.css` |
| Reset, typography scale, buttons, nav, footer, overlays | `assets/css/base.css` |
| Nav/footer injection, cursor, particles, reveal, sound | `assets/js/app.js` |
| Shared content model + glyph library | `assets/js/data.js` |
| Local static server | `serve.js` |

**Exit criteria:** every page can load chrome from JS with zero console errors.

---

### Phase 1 — Home experience (complete)
**Goal:** the first five seconds must sell the product.

| Task | Output |
|------|--------|
| Hero layout, display type stack, HUD corners | `index.html`, `assets/css/home.css` |
| 3D interactive Omnitrix dial with rings, ticks, tokens | `home.css` + `app.js` dial tilt |
| Featured alien grid (10 large art cards) | `render.js` |
| Era ticker + Omnitrix mode strip + stat strip | `render.js` |
| Canvas particle field | `app.js` |

**Exit criteria:** hero renders, dial tilts, cards route to dossiers.

---

### Phase 2 — Archive + dossiers (complete)
**Goal:** depth behind the home page.

| Task | Output |
|------|--------|
| Archive page: 10 featured + 45 forms, era filters, live search | `aliens.html`, `render.js` |
| Dossier template: holo, radar, stats, moves, related | `render.js` |
| Page generator for 10 alien routes | `tools/build-alien-pages.js` |
| Warp transition + arrival transformation | `app.js` |

**Exit criteria:** all 10 dossiers load with complete data and no missing fields.

---

### Phase 3 — Omnitrix + Universe (complete)
**Goal:** the "hardware" and "history" halves of the archive.

| Task | Output |
|------|--------|
| Lab: mode tabs, alien list, exploded dial, spec panel | `omnitrix.html`, `render-pages.js` |
| Universe: 5-era timeline, faction grid, device row | `universe.html`, `render-pages.js` |
| Shared page-hero component | `assets/css/pages.css` |

**Exit criteria:** mode switching updates dial accent + panel; timeline anchors work.

---

### Phase 4 — Search + 404 (complete)
**Goal:** never dead-end a visitor.

| Task | Output |
|------|--------|
| Normalisation + Levenshtein + alias scoring | `app.js` |
| Global search overlay (`/`, `Ctrl+K`, `Esc`) | `app.js` |
| Search page with result rows + portraits | `search.html`, `render-pages.js` |
| Themed 404 with `?q=` echo and suggestion chips | `404.html`, `render-pages.js` |

**Exit criteria:** `forearms` → Four Arms; `upgarde` → Upgrade; unknown → 404 with chips.

---

### Phase 5 — Encyclopedia (complete)
**Goal:** full-universe coverage.

| Task | Output |
|------|--------|
| 86-entry dataset across 6 categories | `assets/js/lore.js` |
| Category tabs, fuzzy filter, live count, empty state | `encyclopedia.html`, `render-pages.js` |
| Nav + footer + cross-links from Universe and About | `app.js`, `universe.html` |

**Exit criteria:** 86 cards render; filtering is instant; counts match.

---

### Phase 6 — Original artwork (complete)
**Goal:** replace glyph placeholders with real character art.

| Task | Output |
|------|--------|
| 10 species-accurate SVG portraits | `assets/img/aliens/*.svg` |
| Detailed Omnitrix SVG | `assets/img/omnitrix.svg` |
| Integrate art into cards, holo, dossier, related, search, drawer, lab | `render.js`, `render-pages.js`, `app.js`, CSS |
| Boot + 404 + lab watermark wiring | `app.js`, `404.html`, `extras.css` |

**Exit criteria:** every alien surface shows its portrait; no broken images.

---

### Phase 7 — Polish, docs, QA (complete)
**Goal:** ship-ready.

| Task | Output |
|------|--------|
| Responsive pass (360 → 1440) | `assets/css/responsive.css` |
| Reduced-motion + focus states | `base.css` |
| Boot sequence + original WebAudio sting | `app.js`, `extras.css` |
| PRD + implementation plan | `docs/*.md` |
| PDF exports | `docs/*.pdf` |
| Pitch deck | `BEN10_Omniverse_Protocol_Deck.pptx` + PDF |
| Link/route/console QA | manual + browser automation |

---

## 3. File architecture

```
/
├─ index.html                     Home
├─ aliens.html                    Archive
├─ omnitrix.html                  Omnitrix lab
├─ encyclopedia.html              Encyclopedia
├─ universe.html                  Timeline / factions / devices
├─ search.html                    Universal search
├─ about.html                     Design system + credits
├─ 404.html                       Signal lost
├─ aliens/
│  ├─ heatblast.html              Dossier 001
│  ├─ four-arms.html              Dossier 002
│  ├─ xlr8.html                   Dossier 003
│  ├─ diamondhead.html            Dossier 004
│  ├─ upgrade.html                Dossier 005
│  ├─ ghostfreak.html             Dossier 006
│  ├─ ripjaws.html                Dossier 007
│  ├─ stinkfly.html               Dossier 008
│  ├─ wildmutt.html               Dossier 009
│  └─ cannonbolt.html             Dossier 010
├─ assets/
│  ├─ css/
│  │  ├─ base.css                 Tokens, reset, chrome, overlays
│  │  ├─ home.css                 Hero, dial, featured grid
│  │  ├─ pages.css                Page heroes, archive, search, dossiers
│  │  ├─ extras.css               Lab, universe, about, 404, art, boot, encyclopedia
│  │  └─ responsive.css           All breakpoints
│  ├─ js/
│  │  ├─ data.js                  Aliens, series, modes, factions, glyphs
│  │  ├─ lore.js                  Encyclopedia dataset (86)
│  │  ├─ app.js                   Chrome, warp, search, drawer, sound, boot, cursor
│  │  ├─ render.js                Home, archive, dossier renderers
│  │  └─ render-pages.js          Lab, universe, search, 404, encyclopedia
│  └─ img/
│     ├─ omnitrix.svg             Original device render
│     ├─ favicon.svg
│     └─ aliens/*.svg             10 original portraits
├─ tools/build-alien-pages.js     Dossier page generator
├─ serve.js                       Static server (port 4173)
└─ docs/                          PRD, plan, PDFs
```

### Script load order (strict)

```html
<script src="assets/js/data.js"></script>
<script src="assets/js/lore.js"></script>   <!-- encyclopedia only -->
<script src="assets/js/app.js"></script>
<script src="assets/js/render.js"></script>
<script src="assets/js/render-pages.js"></script>
```

`data.js` defines `window.B10` and `UI`; every later module depends on it. `app.js` must run
before renderers so chrome exists before content injection. `render-pages.js` guards each
initialiser by checking for its root element, so it is safe to load everywhere.

---

## 4. Data model

### 4.1 Alien record

```js
{
  id: 'heatblast',
  index: '001',
  name: 'Heatblast',
  species: 'Pyronite',
  home: 'Pyros',
  body: 'Plasma humanoid',
  voice: 'Crackling combustion',
  first: 'And Then There Were 10',
  accent: '#ff6a2c',
  glyph: 'flame',
  tagline: '…',
  summary: '…',
  radar: { power: 9, speed: 4, ... },
  stats: [{ label: 'Pyrokinesis', value: 96 }, ...],
  weaknesses: ['…', '…'],
  moves: [{ name: '…', desc: '…' }, ...],
  related: ['xlr8', 'stinkfly']
}
```

### 4.2 Encyclopedia record

```js
{ cat: 'characters', name: 'Ben Tennyson', sub: 'Wielder', desc: '…', href: '…' }
```

### 4.3 Rendering contract

- All renderers are idempotent: they overwrite `innerHTML` of a known root.
- All renderers are defensive: `if (!root) return;`
- All user-facing strings pass through `esc()` before interpolation.
- All internal URLs pass through `UI.url()` which prefixes `ROOT` (`''` or `'../'`).

---

## 5. Search implementation

```
query
  → normalise (lowercase, strip diacritics/punctuation, collapse spaces)
  → for each corpus entry:
       exact name match        → 100
       startsWith              → 88
       includes                → 76
       alias hit               → 82
       token overlap           → 60 + 2×overlap
       Levenshtein ratio       → round(100 × (1 − dist/maxLen))
  → keep best score per entry
  → sort desc, tie-break by name
  → results: score ≥ 40
  → suggestions: score ≥ 55
```

**Corpus:** featured aliens, archive aliens, encyclopedia entries, factions, worlds, devices.
**Cost:** O(n·m) on ~150 entries — sub-millisecond, no debounce needed beyond 90ms input.

---

## 6. Motion implementation

| Effect | Technique | Cost |
|--------|-----------|------|
| Warp | Fixed overlay, CSS transform + blur, 480ms | GPU |
| Arrival | Overlay reads `sessionStorage`, spins dial, locks | GPU |
| Dial tilt | `pointermove` → CSS custom props `--rx/--ry` | rAF-throttled |
| Particles | Canvas 2D, ~60 nodes, link lines < 130px | rAF |
| Reveal | `IntersectionObserver`, `is-in` class | cheap |
| Cursor | Two fixed divs, transform only | GPU |
| Boot sting | WebAudio oscillators + noise buffer | one-shot |

All non-essential motion is disabled under `prefers-reduced-motion: reduce`.

---

## 7. Responsive strategy

| Breakpoint | Behaviour |
|-----------|-----------|
| ≥ 1280 | Full 12-col shell, 3-col lab, 4-col device row |
| 1024–1279 | Nav collapses to menu button; lab becomes 2-col |
| 768–1023 | Hero stacks; featured grid 2-col; search sidebar below |
| 480–767 | All grids 1-col; type scales down; boot simplified |
| ≤ 479 | Single column, 20px gutters, HUD corners hidden |

Verified: no horizontal overflow at 360px; body scroll uses the document element (no nested
scroll traps).

---

## 8. QA checklist

### Routes
- [x] `/` 200
- [x] `/aliens.html` 200
- [x] `/aliens/{10 slugs}.html` 200
- [x] `/omnitrix.html` 200
- [x] `/encyclopedia.html` 200
- [x] `/universe.html` 200
- [x] `/search.html` 200
- [x] `/about.html` 200
- [x] `/404.html` 200

### Behaviour
- [x] Boot appears on first visit, skips after, replays from nav
- [x] Warp overlay fires on `data-warp` links and arrival plays
- [x] Dial accent matches the opened alien
- [x] Search: `forearms` → Four Arms
- [x] Search: `upgarde` → Upgrade
- [x] Search: `humongousaur` → Humungousaur
- [x] Search: `zzzz` → 404 with query echo
- [x] 404 suggestion chips route correctly
- [x] Encyclopedia renders 86 cards, filters, and counts
- [x] Archive filters and empty state
- [x] Sound toggle persists
- [x] Mobile menu opens/closes, locks body

### Quality
- [x] `node --check` passes on all 5 JS modules
- [x] Zero console errors on all routes
- [x] All portraits load (naturalWidth > 0)
- [x] No horizontal overflow at 902px and 360px
- [x] Reduced-motion media query honoured

---

## 9. Known constraints

1. **Autoplay:** the boot sting requires a gesture; the sequence is fully usable silent.
2. **`file://`:** `fetch` is not used, so the site works offline, but `sessionStorage` behaviour
   varies by browser — warp falls back gracefully.
3. **Art scope:** ten portraits cover the featured roster; the 45 archive forms use glyphs by
   design to keep the page light and the visual hierarchy clear.
4. **Browser tooling:** headless screenshot capture was intermittent during QA; DOM-level
   assertions were used as the primary verification channel.

---

## 10. Delivery artefacts

| Artefact | Path |
|----------|------|
| Working site | project root + `node serve.js` |
| PRD | `docs/PRD.md` / `docs/PRD.pdf` |
| Implementation plan | `docs/IMPLEMENTATION_PLAN.md` / `.pdf` |
| Pitch deck | `BEN10_Omniverse_Protocol_Deck.pptx` / `.pdf` |
| Dossier generator | `tools/build-alien-pages.js` |
| Local server | `serve.js` |

**Run locally**

```bash
node serve.js
# → http://localhost:4173
```

No install step. No build step. No dependencies.
