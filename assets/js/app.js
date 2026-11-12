/* ==========================================================================
   BEN 10 â€” OMNIVERSE PROTOCOL
   Core UI runtime: chrome, warp transition, search, drawer, motion
   ========================================================================== */
(function () {
  'use strict';

  var B10 = window.B10;
  var ROOT = document.body.getAttribute('data-root') || '';
  var PAGE = document.body.getAttribute('data-page') || 'home';
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(pointer: fine)').matches;
  var WARP_KEY = 'b10-warp';
  var RECENT_KEY = 'b10-recent';
  var SOUND_KEY = 'b10-sound';

  /* ---------- Inline SVG helpers ---------- */
  var LOGO =
    '<svg viewBox="0 0 100 100" role="img" aria-label="Omnitrix mark" fill="none">' +
    '<circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="2.5" opacity=".9"/>' +
    '<circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="1" opacity=".35"/>' +
    '<circle cx="50" cy="50" r="41.5" stroke="currentColor" stroke-width="5" stroke-dasharray="2 10" opacity=".45"/>' +
    '<path d="M33 28h34L56 50l11 22H33l11-22Z" fill="currentColor"/>' +
    '<circle cx="50" cy="50" r="5" fill="#050806"/>' +
    '<circle cx="50" cy="50" r="2" fill="currentColor"/>' +
    '</svg>';

  function glyph(name) {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + B10.glyph(name) + '</svg>';
  }
  function arrow() {
    return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<path d="M3 13 13 3M5 3h8v8"/></svg>';
  }
  function isFeatured(a) {
    return B10.featured.some(function (f) { return f.slug === a.slug; });
  }
  function hasPhoto(slug) {
    var P = window.B10_PHOTOS;
    return !!(P && P.aliens && P.aliens[slug]);
  }
  function art(a) {
    if (hasPhoto(a.slug)) {
      return '<img src="' + portrait(a.slug) + '" alt="" loading="lazy" decoding="async">';
    }
    return glyph(a.glyph);
  }
  function searchIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
      '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>';
  }
  function closeIcon() {
    return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
      '<path d="m3 3 10 10M13 3 3 13"/></svg>';
  }
  function slugify(str) {
    return String(str == null ? '' : str).toLowerCase()
      .replace(/['\u2019]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  function escapeHtml(str) {    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Navigation model ---------- */
  var NAV = [
    { id: 'home', label: 'Home', href: 'index.html', code: '01' },
    { id: 'aliens', label: 'Aliens', href: 'aliens.html', code: '02' },
    { id: 'omnitrix', label: 'Omnitrix', href: 'omnitrix.html', code: '03' },
    { id: 'encyclopedia', label: 'Encyclopedia', href: 'encyclopedia.html', code: '04' },
    { id: 'universe', label: 'Universe', href: 'universe.html', code: '05' },
    { id: 'search', label: 'Search', href: 'search.html', code: '06' },
    { id: 'about', label: 'About', href: 'about.html', code: '07' }
  ];
  function url(path) { return ROOT + path; }
  function portrait(slug) {
    if (hasPhoto(slug)) return url('assets/img/aliens/' + slug + '.webp');
    return url('assets/img/aliens/' + slug + '.svg');
  }
  function characterPhoto(slug) {
    var P = window.B10_PHOTOS;
    if (P && P.characters && P.characters[slug]) {
      return url('assets/img/characters/' + slug + '.webp');
    }
    return '';
  }

  function navLinks() {
    return NAV.map(function (n) {
      return '<a class="nav-link' + (n.id === PAGE ? ' is-active' : '') + '" href="' + url(n.href) + '"' +
        (n.id === PAGE ? ' aria-current="page"' : '') + ' data-warp="' + n.label + '">' + n.label + '</a>';
    }).join('');
  }

  /* ---------- Chrome ---------- */
  function injectChrome() {
    var head = document.createElement('div');
    head.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<div class="scroll-progress" id="scroll-progress"></div>' +
      '<header class="site-head" id="site-head">' +
        '<div class="nav-inner">' +
          '<a class="brand" href="' + url('index.html') + '" data-warp="Home" aria-label="Ben 10 Omniverse Protocol home">' +
            '<span class="brand__mark" style="color:var(--green)">' + LOGO + '</span>' +
            '<span class="brand__text"><span class="brand__name">Ben 10</span><span class="brand__sub">Omniverse Protocol</span></span>' +
          '</a>' +
          '<nav class="nav-links" aria-label="Primary">' + navLinks() + '</nav>' +
          '<div class="nav-actions">' +
            '<button class="search-trigger" id="search-open" type="button" aria-label="Search the database" aria-haspopup="dialog">' +
              searchIcon() + '<span>Search</span><kbd>âŒ˜K</kbd>' +
            '</button>' +
            '<button class="icon-btn" id="audio-toggle" type="button" aria-label="Toggle interface audio" aria-pressed="false" title="Interface audio">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8.5a5 5 0 0 1 0 7"/><path id="audio-slash" d="m17 3-14 18" opacity="0"/></svg>' +
            '</button>' +
            '<button class="icon-btn" id="boot-open" type="button" aria-label="Play the Omnitrix boot sequence" title="Play boot sequence">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5Z" fill="currentColor" stroke="none"/></svg>' +
            '</button>' +
            '<a class="btn btn--solid nav-cta" href="' + url('aliens.html') + '" data-warp="Alien Archive"><span>Open archive</span><span class="arr">' + arrow() + '</span></a>' +
            '<button class="menu-btn" id="menu-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="mobile-menu" id="mobile-menu" aria-hidden="true">' +
        '<nav class="mobile-menu__links" aria-label="Mobile primary">' +
          NAV.map(function (n) {
            return '<a class="mobile-menu__link' + (n.id === PAGE ? ' is-active' : '') + '" href="' + url(n.href) + '" data-warp="' + n.label + '"><small>' + n.code + '</small>' + n.label + '</a>';
          }).join('') +
        '</nav>' +
        '<div class="mobile-menu__foot"><span>Plumber DB // Omniverse</span><span>v4.1</span></div>' +
      '</div>' +
      '<div class="warp" id="warp" aria-hidden="true">' +
        '<div class="warp__rings"><span></span><span></span><span></span><span></span></div>' +
        '<div class="warp__core">' +
          '<div class="warp__dial" style="color:var(--green)">' + LOGO + '</div>' +
          '<div class="warp__label" id="warp-label">Omnitrix // DNA lock</div>' +
          '<div class="warp__name" id="warp-name">Selecting form</div>' +
          '<div class="warp__bar"><i></i></div>' +
        '</div>' +
      '</div>' +
      '<div class="overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search the Omnitrix database">' +
        '<div class="overlay__panel">' +
          '<div class="overlay__head">' + searchIcon() +
            '<input id="overlay-input" type="text" placeholder="Search any alien, species or planetâ€¦" autocomplete="off" spellcheck="false" aria-label="Search query">' +
            '<button class="overlay__esc" id="overlay-close" type="button" aria-label="Close search">ESC</button>' +
          '</div>' +
          '<div class="overlay__body" id="overlay-results"></div>' +
          '<div class="overlay__foot"><span><kbd>â†‘</kbd><kbd>â†“</kbd> navigate</span><span><kbd>â†µ</kbd> open</span><span>' + B10.all().length + ' forms indexed</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="drawer-backdrop" id="drawer-backdrop"></div>' +
      '<aside class="drawer" id="alien-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-name" aria-hidden="true"></aside>' +
      '<div class="boot" id="boot" role="dialog" aria-modal="true" aria-label="Omnitrix boot sequence" aria-hidden="true">' +
        '<div class="boot__grid" aria-hidden="true"></div>' +
        '<div class="boot__scan" aria-hidden="true"></div>' +
        '<div class="boot__stage">' +
          '<div class="boot__rings" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
          '<div class="boot__dial" aria-hidden="true"><img src="' + url('assets/img/omnitrix.svg') + '" alt=""></div>' +
          '<div class="boot__status"><i></i>Omnitrix link // initialising</div>' +
          '<h2 class="boot__title">Ben <span>10</span></h2>' +
          '<div class="boot__sub">Omniverse Protocol</div>' +
          '<div class="boot__bar" aria-hidden="true"><i></i></div>' +
          '<div class="boot__steps" aria-hidden="true"><span>DNA archive</span><span>55+ samples</span><span>Core stable</span></div>' +
          '<button class="btn btn--solid boot__enter" id="boot-enter" type="button"><span>Enter the Omniverse</span><span class="arr">' + arrow() + '</span></button>' +
          '<button class="boot__skip" id="boot-skip" type="button">Skip sequence</button>' +
          '<div class="boot__foot">Original interface audio // fan-made boot sting</div>' +
        '</div>' +
      '</div>' +
      '<footer class="site-foot">' +
        '<div class="shell">' +
          '<div class="foot-grid">' +
            '<div class="foot-brand">' +
              '<a class="brand" href="' + url('index.html') + '" data-warp="Home">' +
                '<span class="brand__mark" style="color:var(--green)">' + LOGO + '</span>' +
                '<span class="brand__text"><span class="brand__name">Ben 10</span><span class="brand__sub">Omniverse Protocol</span></span>' +
              '</a>' +
              '<p>A fan-made interface concept for the Ben 10 universe. Ten full dossiers, the complete watch lineage, and a database built for every form in the Omniverse.</p>' +
              '<div class="foot-status"><i></i> Omnitrix link stable</div>' +
            '</div>' +
            '<div class="foot-col"><h5>Database</h5><ul>' +
              '<li><a href="' + url('aliens.html') + '" data-warp="Alien Archive">Alien archive</a></li>' +
              '<li><a href="' + url('encyclopedia.html') + '" data-warp="Encyclopedia">Encyclopedia</a></li>' +
              '<li><a href="' + url('omnitrix.html') + '" data-warp="Omnitrix">The Omnitrix</a></li>' +
              '<li><a href="' + url('universe.html') + '" data-warp="Universe">Timeline</a></li>' +
              '<li><a href="' + url('search.html') + '" data-warp="Search">Universal search</a></li>' +
            '</ul></div>' +
            '<div class="foot-col"><h5>Featured forms</h5><ul>' +
              B10.featured.slice(0, 4).map(function (a) {
                return '<li><a href="' + url('aliens/' + a.slug + '.html') + '" data-warp="' + a.name + '">' + a.name + '</a></li>';
              }).join('') +
            '</ul></div>' +
            '<div class="foot-col"><h5>Protocol</h5><ul>' +
              '<li><a href="' + url('about.html') + '" data-warp="About">About the build</a></li>' +
              '<li><a href="' + url('about.html#design') + '">Design system</a></li>' +
              '<li><a href="' + url('404.html') + '" data-warp="Signal lost">404 protocol</a></li>' +
              '<li><a href="' + url('index.html') + '">Return home</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="foot-bottom">' +
            '<span>Â© 2026 // Fan project. Not affiliated with Cartoon Network, Warner Bros. or the Ben 10 rights holders.</span>' +
            '<span class="foot-bottom__right"><span>Built with HTML, CSS &amp; vanilla JS</span><span>Omniverse Protocol v4.1</span></span>' +
          '</div>' +
        '</div>' +
      '</footer>';
    while (head.firstChild) document.body.appendChild(head.firstChild);
  }

  /* ---------- Sound ---------- */
  var Sound = {
    on: false,
    ctx: null,
    init: function () {
      if (!this.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    tone: function (freq, dur, type, gain, slide) {
      if (!this.on) return;
      var ctx = this.init();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (slide) osc.frequency.exponentialRampToValueAtTime(slide, ctx.currentTime + dur);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(gain || 0.03, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur + 0.02);
    },
    tick: function () { this.tone(880, 0.04, 'square', 0.008); },
    click: function () { this.tone(320, 0.08, 'triangle', 0.025, 180); },
    warp: function () {
      this.tone(120, 0.55, 'sawtooth', 0.03, 900);
      this.tone(440, 0.4, 'sine', 0.02, 1200);
    },
    boot: function (force) {
      var ctx = this.init();
      if (!ctx) return;
      if (!this.on && !force) return;
      var t0 = ctx.currentTime + 0.05;
      function voice(freq, dur, type, gain, at, slideTo) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t0 + at);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + at + dur);
        g.gain.setValueAtTime(0.0001, t0 + at);
        g.gain.exponentialRampToValueAtTime(gain || 0.02, t0 + at + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
        o.connect(g).connect(ctx.destination);
        o.start(t0 + at);
        o.stop(t0 + at + dur + 0.06);
      }
      // original boot sting: sub riser, impact, ascending motif, shimmer
      voice(64, 1.5, 'sawtooth', 0.035, 0, 260);
      voice(128, 1.6, 'triangle', 0.02, 0.06, 540);
      voice(46, 1.1, 'sine', 0.1, 1.32, 28);
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        voice(f, 0.4, 'square', 0.013, 1.44 + i * 0.15);
      });
      [261.63, 329.63, 392.0].forEach(function (f, i) {
        voice(f, 1.4, 'sine', 0.022, 1.5 + i * 0.02);
      });
      [1567.98, 2093.0].forEach(function (f, i) {
        voice(f, 0.6, 'sine', 0.007, 2.15 + i * 0.1);
      });
    }
  };
  try { Sound.on = localStorage.getItem(SOUND_KEY) === '1'; } catch (e) { Sound.on = false; }

  /* ---------- Warp transition ---------- */
  var warpEl, warpName, warpLabel, warpTimer;
  function initWarp() {
    warpEl = document.getElementById('warp');
    warpName = document.getElementById('warp-name');
    warpLabel = document.getElementById('warp-label');
    var pending = null;
    try { pending = sessionStorage.getItem(WARP_KEY); } catch (e) { pending = null; }

    if (pending && !REDUCE) {
      try { sessionStorage.removeItem(WARP_KEY); } catch (e) {}
      warpName.textContent = pending;
      warpLabel.textContent = 'Transformation complete';
      warpEl.classList.add('is-active');
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('warping');
      });
      setTimeout(function () {
        warpEl.classList.remove('is-active');
      }, 980);
    } else {
      try { sessionStorage.removeItem(WARP_KEY); } catch (e) {}
      document.documentElement.classList.remove('warping');
    }
  }

  function navigate(target, label) {
    if (!target) return;
    if (REDUCE) { window.location.href = target; return; }
    try { sessionStorage.setItem(WARP_KEY, label || 'Next form'); } catch (e) {}
    if (!warpEl) { window.location.href = target; return; }
    warpName.textContent = label || 'Next form';
    warpLabel.textContent = 'Omnitrix // DNA lock';
    warpEl.classList.add('is-active');
    Sound.warp();
    clearTimeout(warpTimer);
    warpTimer = setTimeout(function () { window.location.href = target; }, 620);
  }

  function initLinkWarp() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download') || a.dataset.noWarp !== undefined) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (/^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;
      if (!/\.html(?:$|[?#])/i.test(href)) return;
      e.preventDefault();
      var label = a.dataset.warp || a.dataset.label || (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34) || 'Next form';
      navigate(a.href, label);
    });
  }

  /* ---------- Search engine ---------- */
  var INDEX = B10.all().map(function (a) {
    return {
      slug: a.slug, name: a.name, species: a.species, planet: a.planet, series: a.series,
      accent: a.accent, glyph: a.glyph, summary: a.summary, powers: a.powers || [],
      aliases: a.aliases || [], featured: B10.featured.some(function (f) { return f.slug === a.slug; })
    };
  });

  function normalize(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  function levenshtein(a, b) {
    if (a === b) return 0;
    var al = a.length, bl = b.length;
    if (!al) return bl;
    if (!bl) return al;
    var prev = new Array(bl + 1), curr = new Array(bl + 1), i, j;
    for (j = 0; j <= bl; j++) prev[j] = j;
    for (i = 1; i <= al; i++) {
      curr[0] = i;
      for (j = 1; j <= bl; j++) {
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      }
      var tmp = prev; prev = curr; curr = tmp;
    }
    return prev[bl];
  }

  function scoreAlien(a, raw) {
    var q = normalize(raw);
    if (!q) return 0;
    if (q.length < 2) {
      return normalize(a.name).charAt(0) === q ? 40 : 0;
    }
    var fields = [a.name, a.species, a.planet, a.series].concat(a.aliases);
    var best = 0;
    for (var i = 0; i < fields.length; i++) {
      var n = normalize(fields[i]);
      if (!n) continue;
      if (n === q) best = Math.max(best, 140);
      else if (n.indexOf(q) === 0) best = Math.max(best, 118 - Math.min(24, n.length - q.length));
      else if (n.indexOf(q) > -1) best = Math.max(best, 96 - Math.min(18, n.length - q.length));
      else {
        var d = levenshtein(q, n);
        var sim = 1 - d / Math.max(q.length, n.length);
        if (sim >= 0.58) best = Math.max(best, Math.round(88 * sim));
        if (n.length > q.length + 2) {
          for (var k = 0; k <= n.length - q.length; k++) {
            var sub = n.substr(k, q.length);
            var sd = levenshtein(q, sub);
            var ss = 1 - sd / q.length;
            if (ss >= 0.82) best = Math.max(best, Math.round(76 * ss));
          }
        }
      }
    }
    return best;
  }

  function searchAliens(raw, limit) {
    var q = String(raw || '').trim();
    if (!q) return [];
    var results = [];
    for (var i = 0; i < INDEX.length; i++) {
      var s = scoreAlien(INDEX[i], q);
      if (s >= 40) results.push({ alien: INDEX[i], score: s });
    }
    results.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.alien.name.localeCompare(b.alien.name);
    });
    return results.slice(0, limit || 50);
  }

  function didYouMean(raw) {
    var res = searchAliens(raw, 6);
    var out = [];
    for (var i = 0; i < res.length; i++) {
      if (res[i].score >= 55 && normalize(res[i].alien.name) !== normalize(raw)) out.push(res[i].alien.name);
      if (out.length === 3) break;
    }
    return out;
  }

  function highlight(text, raw) {
    var safe = escapeHtml(text);
    var q = String(raw || '').trim();
    if (!q) return safe;
    var tokens = q.split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!tokens.length) return safe;
    var pattern = tokens.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|');
    try {
      return safe.replace(new RegExp('(' + pattern + ')', 'ig'), '<mark>$1</mark>');
    } catch (e) { return safe; }
  }

  /* ---------- Drawer ---------- */
  var drawer, drawerBackdrop, lastFocus;
  function initDrawer() {
    drawer = document.getElementById('alien-drawer');
    drawerBackdrop = document.getElementById('drawer-backdrop');
    drawerBackdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  function openAlien(slug) {
    var a = B10.bySlug(slug);
    if (!a) return;
    var isFeatured = B10.featured.some(function (f) { return f.slug === slug; });
    var withArt = hasPhoto(slug);
    var powers = (a.powers || []).map(function (p) {
      return '<span>' + escapeHtml(typeof p === 'string' ? p : p.name) + '</span>';
    }).join('');
    drawer.style.setProperty('--accent', a.accent || '#a3ff12');
    drawer.innerHTML =
      (withArt ? '<div class="drawer__portrait" aria-hidden="true"><img src="' + portrait(a.slug) + '" alt=""></div>' : '') +
      '<div class="drawer__head">' +
        '<span class="drawer__glyph' + (withArt ? ' drawer__glyph--art' : '') + '">' + (withArt ? '<img src="' + portrait(a.slug) + '" alt="">' : glyph(a.glyph)) + '</span>' +
        '<div><div class="drawer__name" id="drawer-name">' + escapeHtml(a.name) + '</div>' +
        '<div class="drawer__species">' + escapeHtml(a.species) + ' // ' + escapeHtml(a.planet) + '</div></div>' +
        '<button class="drawer__close" id="drawer-close" type="button" aria-label="Close dossier">' + closeIcon() + '</button>' +
      '</div>' +
      '<div class="drawer__body">' +
        '<h4>Archive summary</h4><p>' + escapeHtml(a.summary) + '</p>' +
        '<div class="drawer__stats">' +
          '<div class="drawer__stat"><span>Series</span><b>' + escapeHtml(a.series) + '</b></div>' +
          '<div class="drawer__stat"><span>Home world</span><b>' + escapeHtml(a.planet) + '</b></div>' +
          '<div class="drawer__stat"><span>Species</span><b>' + escapeHtml(a.species) + '</b></div>' +
          '<div class="drawer__stat"><span>Record</span><b>' + (isFeatured ? 'Full dossier' : 'Condensed') + '</b></div>' +
        '</div>' +
        '<h4>Power set</h4><div class="drawer__powers">' + (powers || '<span>Not catalogued</span>') + '</div>' +
        '<div class="drawer__foot">' +
          (isFeatured
            ? '<a class="btn btn--sm btn--solid" href="' + url('aliens/' + a.slug + '.html') + '" data-warp="' + escapeHtml(a.name) + '"><span>Open full dossier</span><span class="arr">' + arrow() + '</span></a>'
            : '<a class="btn btn--sm" href="' + url('search.html?q=' + encodeURIComponent(a.name)) + '" data-warp="Search"><span>Search the database</span><span class="arr">' + arrow() + '</span></a>') +
          '<button class="btn btn--sm btn--ghost" type="button" data-close-drawer><span>Close record</span></button>' +
        '</div>' +
        '<p class="drawer__note">' + (isFeatured ? 'Full entry // cross-referenced with the Plumber archive.' : 'Condensed entry // this form does not have a dedicated page in this build.') + '</p>' +
      '</div>';
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.classList.add('is-open');
    document.body.classList.add('is-locked');
    var closeBtn = document.getElementById('drawer-close');
    if (closeBtn) closeBtn.focus();
    Sound.click();
  }

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
  });

  /* ---------- Overlay search ---------- */
  var overlay, overlayInput, overlayResults, overlayIndex = -1;
  function initSearchOverlay() {
    overlay = document.getElementById('search-overlay');
    overlayInput = document.getElementById('overlay-input');
    overlayResults = document.getElementById('overlay-results');
    document.getElementById('search-open').addEventListener('click', function () { openSearch(); });
    document.getElementById('overlay-close').addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });

    overlayInput.addEventListener('input', function () { renderOverlay(overlayInput.value); });
    overlayInput.addEventListener('keydown', function (e) {
      var items = overlayResults.querySelectorAll('.sr-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        overlayIndex = Math.min(items.length - 1, overlayIndex + 1);
        paintActive(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        overlayIndex = Math.max(0, overlayIndex - 1);
        paintActive(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (overlayIndex > -1 && items[overlayIndex]) items[overlayIndex].click();
        else if (items.length) items[0].click();
        else goNotFound(overlayInput.value);
      }
    });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('is-open')) closeSearch(); else openSearch();
      }
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeSearch();
    });
  }

  function openSearch() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    document.body.classList.add('is-locked');
    renderOverlay(overlayInput.value);
    setTimeout(function () { overlayInput.focus(); }, 80);
  }
  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    if (!drawer.classList.contains('is-open')) document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function renderOverlay(raw) {
    var q = String(raw || '').trim();
    overlayIndex = -1;
    if (!q) {
      var featured = INDEX.filter(function (a) { return a.featured; }).slice(0, 5);
      overlayResults.innerHTML =
        '<div class="overlay__hint">Featured dossiers // type to search all ' + INDEX.length + ' indexed forms</div>' +
        featured.map(function (a) { return overlayItem(a, ''); }).join('') +
        '<div class="sr-suggest"><div class="sr-suggest__label">Try a query</div><div class="sr-suggest__list">' +
          ['Heatblast', 'Four Arms', 'Alien X', 'Ultimate', 'Omnitrix', 'forearms'].map(function (t) {
            return '<button class="sr-chip" type="button" data-query="' + t + '">' + t + '</button>';
          }).join('') + '</div></div>';
      return;
    }
    var results = searchAliens(q, 8);
    if (!results.length) {
      var suggestions = didYouMean(q);
      overlayResults.innerHTML =
        '<div class="sr-empty"><div class="sr-empty__title">No DNA match</div>' +
        '<div class="sr-empty__text">The archive has no form matching â€œ' + escapeHtml(q) + 'â€.</div>' +
        (suggestions.length ? '<div class="sr-suggest"><div class="sr-suggest__label">Closest signals</div><div class="sr-suggest__list">' +
          suggestions.map(function (s) { return '<button class="sr-chip" type="button" data-query="' + escapeHtml(s) + '">' + escapeHtml(s) + '</button>'; }).join('') + '</div></div>' : '') +
        '<div class="sr-empty__actions"><button class="btn btn--sm btn--danger" type="button" data-notfound="' + escapeHtml(q) + '"><span>Open 404 protocol</span></button></div></div>';
      return;
    }
    overlayResults.innerHTML = results.map(function (r) { return overlayItem(r.alien, q); }).join('');
  }

  function overlayItem(a, q) {
    return '<button class="sr-item" type="button" data-slug="' + a.slug + '" style="--accent:' + a.accent + '">' +
      '<span class="sr-item__glyph' + (hasPhoto(a.slug) ? ' sr-item__glyph--art' : '') + '">' + art(a) + '</span>' +
      '<span><span class="sr-item__name">' + highlight(a.name, q) + '</span>' +
      '<span class="sr-item__meta">' + highlight(a.species, q) + ' Â· ' + highlight(a.planet, q) + ' Â· ' + highlight(a.series, q) + '</span></span>' +
      '<span class="sr-item__tag">' + (a.featured ? 'Dossier' : 'Archive') + '</span></button>';
  }

  function paintActive(items) {
    for (var i = 0; i < items.length; i++) items[i].classList.toggle('is-active', i === overlayIndex);
    if (items[overlayIndex]) items[overlayIndex].scrollIntoView({ block: 'nearest' });
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-query]');
    if (chip) {
      var q = chip.getAttribute('data-query');
      if (overlay && overlay.classList.contains('is-open')) {
        overlayInput.value = q;
        renderOverlay(q);
        overlayInput.focus();
      }
      return;
    }
    var item = e.target.closest('.sr-item');
    if (item) {
      var slug = item.getAttribute('data-slug');
      var a = B10.bySlug(slug);
      closeSearch();
      if (a && B10.featured.some(function (f) { return f.slug === slug; })) {
        navigate(url('aliens/' + slug + '.html'), a.name);
      } else {
        openAlien(slug);
      }
      return;
    }
    var nf = e.target.closest('[data-notfound]');
    if (nf) {
      var query = nf.getAttribute('data-notfound');
      closeSearch();
      navigate(url('404.html?q=' + encodeURIComponent(query)), 'Signal lost');
    }
  });

  function goNotFound(q) {
    navigate(url('404.html?q=' + encodeURIComponent(q || '')), 'Signal lost');
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var menu = document.getElementById('mobile-menu');
    var btn = document.getElementById('menu-open');
    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
      var links = menu.querySelectorAll('.mobile-menu__link');
      for (var i = 0; i < links.length; i++) links[i].style.transitionDelay = (open ? 0.12 + i * 0.045 : 0) + 's';
      if (open) { btn.innerHTML = '<span></span><span></span>'; btn.setAttribute('aria-label', 'Close menu'); }
      else { btn.innerHTML = '<span></span><span></span>'; btn.setAttribute('aria-label', 'Open menu'); }
    }
    btn.addEventListener('click', function () { setOpen(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ---------- Audio toggle ---------- */
  function initAudioToggle() {
    var btn = document.getElementById('audio-toggle');
    var slash = document.getElementById('audio-slash');
    function paint() {
      btn.setAttribute('aria-pressed', String(Sound.on));
      if (slash) slash.setAttribute('opacity', Sound.on ? '0' : '1');
      btn.style.color = Sound.on ? 'var(--green)' : '';
    }
    paint();
    btn.addEventListener('click', function () {
      Sound.on = !Sound.on;
      try { localStorage.setItem(SOUND_KEY, Sound.on ? '1' : '0'); } catch (e) {}
      if (Sound.on) { Sound.init(); Sound.click(); }
      paint();
    });
    document.addEventListener('click', function (e) {
      if (!Sound.on) return;
      if (e.target.closest('#audio-toggle')) return;
      if (e.target.closest('a,button,.sr-item')) Sound.tick();
    });
  }

  /* ---------- Boot sequence ---------- */
  function initBoot() {
    var bootEl = document.getElementById('boot');
    if (!bootEl) return;
    var enter = document.getElementById('boot-enter');
    var skip = document.getElementById('boot-skip');
    var openBtn = document.getElementById('boot-open');
    var autoTimer = null;

    function syncAudio() {
      var btn = document.getElementById('audio-toggle');
      var slash = document.getElementById('audio-slash');
      if (btn) {
        btn.setAttribute('aria-pressed', 'true');
        btn.style.color = 'var(--green)';
      }
      if (slash) slash.setAttribute('opacity', '0');
      try { localStorage.setItem(SOUND_KEY, '1'); } catch (e) {}
    }

    function play(withSound) {
      if (withSound) { Sound.on = true; syncAudio(); }
      clearTimeout(autoTimer);
      bootEl.classList.remove('is-done');
      bootEl.classList.add('is-open');
      bootEl.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      Sound.boot(!!withSound);
      autoTimer = setTimeout(function () {
        if (withSound) close();
      }, 4200);
    }

    function close() {
      clearTimeout(autoTimer);
      bootEl.classList.add('is-done');
      bootEl.classList.remove('is-open');
      bootEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      try { localStorage.setItem('b10-booted', '1'); } catch (e) {}
      Sound.click();
    }

    if (enter) enter.addEventListener('click', function () { play(true); });
    if (skip) skip.addEventListener('click', close);
    if (openBtn) openBtn.addEventListener('click', function () { play(true); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bootEl.classList.contains('is-open')) close();
    });

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-boot]');
      if (trigger) { e.preventDefault(); play(true); }
    });

    var seen = false;
    try { seen = localStorage.getItem('b10-booted') === '1'; } catch (e) {}
    if (!seen && !REDUCE) setTimeout(function () { play(false); }, 450);
  }

  /* ---------- Scroll / header ---------- */
  function initScroll() {
    var header = document.getElementById('site-head');
    var progress = document.getElementById('scroll-progress');
    var ticking = false;
    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle('is-scrolled', y > 24);
      if (progress) progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Reveal ---------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal,.reveal-x,.stat-bars,.radar').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          var fills = en.target.querySelectorAll('.stat-bar__fill');
          for (var i = 0; i < fills.length; i++) fills[i].classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal,.reveal-x,.stat-bars,.radar').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Cursor ---------- */
  function initCursor() {
    if (!FINE || REDUCE) return;
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('has-cursor');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a,button,input,select,textarea,.dial,.alien-card')) document.body.classList.add('cursor-hot');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a,button,input,select,textarea,.dial,.alien-card')) document.body.classList.remove('cursor-hot');
    });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); });
    document.addEventListener('mouseenter', function () { document.body.classList.add('has-cursor'); });
  }

  /* ---------- Dial tilt ---------- */
  function initDialTilt() {
    if (!FINE || REDUCE) return;
    document.addEventListener('mousemove', function (e) {
      var dial = e.target.closest('.dial');
      if (!dial) return;
      var r = dial.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      dial.style.setProperty('--ry', (px * 16).toFixed(2) + 'deg');
      dial.style.setProperty('--rx', (-py * 12).toFixed(2) + 'deg');
    }, { passive: true });
    document.addEventListener('mouseout', function (e) {
      var dial = e.target.closest('.dial');
      if (!dial) return;
      if (dial.contains(e.relatedTarget)) return;
      dial.style.setProperty('--ry', '0deg');
      dial.style.setProperty('--rx', '0deg');
    });
  }

  /* ---------- Hero particle canvas ---------- */
  function initCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || REDUCE) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, particles = [], raf = null;
    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(90, Math.round(w / 14));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.6 + 0.3,
          vy: -(Math.random() * 0.25 + 0.05),
          vx: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.5 + 0.1,
          p: Math.random() * Math.PI * 2
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy; p.p += 0.01;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        var alpha = p.a * (0.6 + Math.sin(p.p) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(163,255,18,' + alpha.toFixed(3) + ')';
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) draw();
    });
  }

  /* ---------- Expose ---------- */
  window.UI = {
    root: ROOT,
    page: PAGE,
    glyph: glyph,
    portrait: portrait,
    hasPhoto: hasPhoto,
    characterPhoto: characterPhoto,
    slugify: slugify,
    logo: LOGO,
    arrow: arrow,
    searchIcon: searchIcon,
    escapeHtml: escapeHtml,
    url: url,
    navigate: navigate,
    search: searchAliens,
    didYouMean: didYouMean,
    highlight: highlight,
    openAlien: openAlien,
    closeDrawer: closeDrawer,
    sound: Sound,
    reduceMotion: REDUCE,
    featured: B10.featured,
    index: INDEX,
    renderSearchResults: renderOverlay
  };

  /* ---------- Boot ---------- */
  injectChrome();
  initWarp();
  initLinkWarp();
  initMenu();
  initAudioToggle();
  initBoot();
  initSearchOverlay();
  initDrawer();
  initScroll();
  initReveal();
  initCursor();
  initDialTilt();
  initCanvas();
})();

