/* ==========================================================================
   BEN 10 â€” OMNIVERSE PROTOCOL
   Page renderers: Omnitrix lab, universe, search, 404
   ========================================================================== */
(function () {
  'use strict';
  var UI = window.UI;
  var B10 = window.B10;
  if (!UI || !B10) return;
  var esc = UI.escapeHtml;
  var glyph = UI.glyph;
  var arrow = UI.arrow;

  function observeNew(scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.is-in), .stat-bars:not(.is-in), .radar:not(.is-in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ================= OMNITRIX LAB ================= */
  function initOmnitrix() {
    var list = document.getElementById('lab-list');
    var stage = document.getElementById('lab-stage');
    var panel = document.getElementById('lab-panel');
    var tabs = document.getElementById('mode-tabs');
    var labModes = document.getElementById('lab-modes');
    if (!list || !stage || !panel) return;

    var current = B10.featured[0];
    var mode = B10.modes[0];
    var exploded = false;

    function dialMarkup(a) {
      return '<div class="dial" id="lab-dial" style="--accent:' + mode.accent + '">' +
        '<div class="dial__aura"></div>' +
        '<div class="dial__ticks"></div>' +
        '<div class="dial__bezel"></div>' +
        '<div class="dial__ring dial__ring--a"></div>' +
        '<div class="dial__ring dial__ring--b"></div>' +
        '<div class="dial__core" id="lab-core" style="color:' + a.accent + '">' +
          '<img class="dial__face" src="' + UI.portrait(a.slug) + '" alt="">' +
          '<span class="dial__core-glyph">' + glyph(a.glyph) + '</span>' +
        '</div>' +
        '<div class="dial__glass"></div>' +
        '<div class="dial__pulse"></div>' +
        '<div class="dial__label"><i></i>DNA sample // ' + esc(a.name) + '</div>' +
      '</div>';
    }

    function panelMarkup(a) {
      return '<div class="lab__panel-top"><div>' +
          '<div class="lab__panel-kicker">Sample ' + a.entry + ' // locked</div>' +
          '<h3>' + esc(a.name) + '</h3>' +
          '<div class="lab__panel-species">' + esc(a.species) + ' Â· ' + esc(a.planet) + '</div>' +
        '</div><span class="lab__panel-glyph lab__panel-glyph--art" style="color:' + a.accent + '"><img src="' + UI.portrait(a.slug) + '" alt=""></span></div>' +
        '<p>' + esc(a.summary) + '</p>' +
        '<div class="lab__specs">' +
          '<div class="lab__spec"><span>Entry</span><b>' + a.entry + ' / 010</b></div>' +
          '<div class="lab__spec"><span>Class</span><b>' + esc(a.className) + '</b></div>' +
          '<div class="lab__spec"><span>Threat</span><b class="accent">' + esc(a.threat) + '</b></div>' +
          '<div class="lab__spec"><span>DNA</span><b>' + esc(a.dna) + '</b></div>' +
        '</div>' +
        '<div class="lab__actions">' +
          '<button class="btn btn--solid" type="button" id="lab-slam"><span>Slam the dial</span><span class="arr">' + arrow() + '</span></button>' +
          '<a class="btn btn--ghost" href="' + UI.url('aliens/' + a.slug + '.html') + '" data-warp="' + esc(a.name) + '"><span>Open dossier</span></a>' +
        '</div>' +
        '<button class="lab__explode" type="button" id="lab-explode"><i></i> Exploded view</button>';
    }

    function paint() {
      list.querySelectorAll('.lab__item').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-slug') === current.slug);
      });
      stage.innerHTML = dialMarkup(current);
      panel.innerHTML = panelMarkup(current);
      panel.style.setProperty('--accent', current.accent);
      var dial = document.getElementById('lab-dial');
      if (dial) {
        dial.classList.toggle('is-exploded', exploded);
        dial.style.setProperty('--accent', mode.accent);
      }
      var exp = document.getElementById('lab-explode');
      if (exp) {
        exp.classList.toggle('is-on', exploded);
        exp.addEventListener('click', function () {
          exploded = !exploded;
          var d = document.getElementById('lab-dial');
          if (d) d.classList.toggle('is-exploded', exploded);
          exp.classList.toggle('is-on', exploded);
          UI.sound.tick();
        });
      }
      var slam = document.getElementById('lab-slam');
      if (slam) slam.addEventListener('click', function () {
        UI.navigate(UI.url('aliens/' + current.slug + '.html'), current.name);
      });
      if (labModes) labModes.querySelectorAll('[data-mode-id]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-mode-id') === mode.id);
      });
    }

    list.innerHTML = B10.featured.map(function (a) {
      return '<button class="lab__item" type="button" data-slug="' + a.slug + '" style="--accent:' + a.accent + '">' +
        '<span class="lab__item-glyph lab__item-glyph--art"><img src="' + UI.portrait(a.slug) + '" alt=""></span>' +
        '<span><span class="lab__item-name">' + esc(a.name) + '</span><span class="lab__item-species">' + esc(a.species) + '</span></span>' +
        '<span class="lab__item-index">' + a.entry + '</span></button>';
    }).join('');

    list.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-slug]');
      if (!btn) return;
      var a = B10.bySlug(btn.getAttribute('data-slug'));
      if (!a) return;
      current = a;
      exploded = false;
      paint();
      UI.sound.tick();
    });

    if (tabs) {
      tabs.innerHTML = B10.modes.map(function (m) {
        return '<button class="mode-tab' + (m.id === mode.id ? ' is-active' : '') + '" type="button" data-mode="' + m.id + '" style="--tab-accent:' + m.accent + '"><i></i>' + esc(m.name) + '</button>';
      }).join('');
      tabs.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-mode]');
        if (!btn) return;
        var m = B10.modes.filter(function (x) { return x.id === btn.getAttribute('data-mode'); })[0];
        if (!m) return;
        mode = m;
        tabs.querySelectorAll('.mode-tab').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        paint();
        UI.sound.click();
      });
    }

    if (labModes) {
      labModes.innerHTML = B10.modes.map(function (m) {
        return '<button class="lab-mode" type="button" data-mode-id="' + m.id + '" style="--accent:' + m.accent + '">' +
          '<span class="lab-mode__label">' + esc(m.label) + '</span>' +
          '<h4>' + esc(m.name) + '</h4><p>' + esc(m.desc) + '</p></button>';
      }).join('');
      labModes.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-mode-id]');
        if (!btn) return;
        var m = B10.modes.filter(function (x) { return x.id === btn.getAttribute('data-mode-id'); })[0];
        if (!m) return;
        mode = m;
        if (tabs) tabs.querySelectorAll('.mode-tab').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-mode') === m.id); });
        paint();
        window.scrollTo({ top: document.getElementById('lab').offsetTop - 100, behavior: UI.reduceMotion ? 'auto' : 'smooth' });
      });
    }

    paint();
    observeNew(document);
  }

  /* ================= UNIVERSE ================= */
  function initUniverse() {
    var tl = document.getElementById('timeline');
    if (tl) {
      tl.innerHTML = B10.series.map(function (s) {
        return '<article class="timeline__row" id="era-' + s.year + '" style="--accent:' + s.accent + '">' +
          '<div class="timeline__year">' + s.year + '<small>' + esc(s.label) + '</small></div>' +
          '<div class="timeline__body">' +
            '<div class="timeline__head"><span class="timeline__label">' + esc(s.label) + '</span><span class="timeline__device">' + esc(s.device) + '</span></div>' +
            '<h2 class="timeline__title">' + esc(s.title) + '</h2>' +
            '<p class="timeline__blurb">' + esc(s.blurb) + '</p>' +
            '<div class="timeline__meta">' +
              '<div><span>Key forms</span><b>' + esc(s.key) + '</b></div>' +
              '<div><span>Primary threat</span><b><em>' + esc(s.villain) + '</em></b></div>' +
            '</div>' +
          '</div></article>';
      }).join('');
    }

    var factions = document.getElementById('faction-grid');
    if (factions) {
      factions.innerHTML = B10.factions.map(function (f) {
        return '<article class="faction-card" style="--accent:' + f.accent + '">' +
          '<div class="faction-card__top"><span class="faction-card__glyph">' + glyph(f.glyph) + '</span><span class="faction-card__tag">' + esc(f.tag) + '</span></div>' +
          '<h3>' + esc(f.name) + '</h3><p>' + esc(f.desc) + '</p></article>';
      }).join('');
    }

    var devices = document.getElementById('device-row');
    if (devices) {
      devices.innerHTML = B10.modes.map(function (m, i) {
        return '<article class="device-card" style="--accent:' + m.accent + '">' +
          '<span class="device-card__index">0' + (i + 1) + '</span>' +
          '<span class="device-card__mark">' + UI.logo + '</span>' +
          '<h3>' + esc(m.name) + '</h3><div class="device-card__sub">' + esc(m.label) + '</div>' +
          '<p>' + esc(m.desc) + '</p></article>';
      }).join('');
    }

    observeNew(document);
  }

  /* ================= SEARCH PAGE ================= */
  function initSearch() {
    var input = document.getElementById('search-input');
    var resultsEl = document.getElementById('search-results');
    var countEl = document.getElementById('search-count');
    var clearBtn = document.getElementById('search-clear');
    var recentEl = document.getElementById('search-recent');
    if (!input || !resultsEl) return;

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;
    var timer = null;

    function readRecent() {
      try { return JSON.parse(localStorage.getItem('b10-recent') || '[]'); } catch (e) { return []; }
    }
    function pushRecent(q) {
      if (!q) return;
      var list = readRecent().filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); });
      list.unshift(q);
      list = list.slice(0, 5);
      try { localStorage.setItem('b10-recent', JSON.stringify(list)); } catch (e) {}
      renderRecent();
    }
    function renderRecent() {
      if (!recentEl) return;
      var list = readRecent();
      recentEl.innerHTML = list.length
        ? list.map(function (q) { return '<li><button type="button" data-search-query="' + esc(q) + '"><span>' + esc(q) + '</span><small>â†—</small></button></li>'; }).join('')
        : '<li><span class="mono" style="display:block;padding:10px 0;color:var(--muted-2);font-size:8px">No recent signals yet</span></li>';
    }

    function row(a, q) {
      return '<button class="result-row" type="button" data-search-slug="' + a.slug + '" style="--accent:' + a.accent + '">' +
        '<span class="result-row__glyph' + (UI.hasPhoto(a.slug) ? ' result-row__glyph--art' : '') + '">' +
          (UI.hasPhoto(a.slug) ? '<img src="' + UI.portrait(a.slug) + '" alt="">' : glyph(a.glyph)) +
        '</span>' +
        '<span><span class="result-row__name">' + UI.highlight(a.name, q) + '</span>' +
        '<span class="result-row__meta">' + UI.highlight(a.species, q) + ' Â· ' + UI.highlight(a.planet, q) + ' Â· <b>' + esc(a.series) + '</b></span>' +
        '<span class="result-row__desc">' + UI.highlight(a.summary || '', q) + '</span></span>' +
        '<span class="result-row__tag">' + (a.featured ? 'Full dossier' : 'Archive') + '</span></button>';
    }

    function render(q) {
      q = (q || '').trim();
      if (clearBtn) clearBtn.classList.toggle('is-visible', !!q);
      if (!q) {
        if (countEl) countEl.innerHTML = 'Featured signals // <b>' + B10.all().length + '</b> forms indexed';
        resultsEl.innerHTML = B10.featured.slice(0, 6).map(function (a) { return row(a, ''); }).join('') +
          '<div class="search-hint mono" style="padding:22px 0;color:var(--muted-2);font-size:9px">Type a name, species, planet or series. Typos are handled by the DNA matcher.</div>';
        return;
      }
      var found = UI.search(q, 50);
      if (countEl) countEl.innerHTML = '<b>' + found.length + '</b> match' + (found.length === 1 ? '' : 'es') + ' // query â€œ' + esc(q) + 'â€';
      if (!found.length) {
        var suggestions = UI.didYouMean(q);
        resultsEl.innerHTML =
          '<div class="search-zero"><div class="search-zero__code">0 / 55</div>' +
          '<h3>No form matches that signal.</h3>' +
          '<p>The archive could not resolve â€œ' + esc(q) + 'â€. Check the spelling, try a species name, or open the 404 protocol for a full scan.</p>' +
          (suggestions.length ? '<div class="search-zero__suggest"><span class="mono" style="align-self:center;color:var(--muted-2)">Did you mean</span>' +
            suggestions.map(function (s) { return '<button class="sr-chip" type="button" data-search-query="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>' : '') +
          '<div class="search-zero__actions"><button class="btn btn--sm btn--danger" type="button" id="search-notfound"><span>Open 404 protocol</span></button>' +
          '<button class="btn btn--sm btn--ghost" type="button" data-search-query="">Reset search</button></div></div>';
        var nf = document.getElementById('search-notfound');
        if (nf) nf.addEventListener('click', function () {
          UI.navigate(UI.url('404.html?q=' + encodeURIComponent(q)), 'Signal lost');
        });
        return;
      }
      resultsEl.innerHTML = found.map(function (r) { return row(r.alien, q); }).join('');
    }

    function commit(q, immediate) {
      clearTimeout(timer);
      var go = function () {
        render(q);
        var target = q ? '?q=' + encodeURIComponent(q) : window.location.pathname;
        try { history.replaceState(null, '', target); } catch (e) {}
      };
      if (immediate) go(); else timer = setTimeout(go, 90);
    }

    input.addEventListener('input', function () { commit(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var q = input.value.trim();
        var first = resultsEl.querySelector('[data-search-slug]');
        if (first) { pushRecent(q); first.click(); }
        else if (q) { pushRecent(q); UI.navigate(UI.url('404.html?q=' + encodeURIComponent(q)), 'Signal lost'); }
      }
    });
    if (clearBtn) clearBtn.addEventListener('click', function () { input.value = ''; commit('', true); input.focus(); });

    resultsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-search-slug]');
      if (!btn) return;
      var a = B10.bySlug(btn.getAttribute('data-search-slug'));
      if (!a) return;
      pushRecent(input.value.trim());
      if (B10.featured.some(function (f) { return f.slug === a.slug; })) {
        UI.navigate(UI.url('aliens/' + a.slug + '.html'), a.name);
      } else {
        UI.openAlien(a.slug);
      }
    });

    document.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-search-query]');
      if (!chip) return;
      var q = chip.getAttribute('data-search-query') || '';
      input.value = q;
      commit(q, true);
      input.focus();
    });

    renderRecent();
    render(initial);
  }

  /* ================= 404 ================= */
  function initNotFound() {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim();
    var queryEl = document.getElementById('nf-query');
    var sugEl = document.getElementById('nf-suggest');
    if (q) {
      if (queryEl) queryEl.innerHTML = '<span>Scanned query</span> â€œ' + esc(q) + 'â€';
      var suggestions = UI.didYouMean(q);
      if (!suggestions.length) suggestions = ['Heatblast', 'Four Arms', 'XLR8', 'Alien X'];
      if (sugEl) sugEl.innerHTML = suggestions.map(function (s) {
        return '<button class="sr-chip" type="button" data-nf-suggest="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('');
    } else {
      if (queryEl) queryEl.style.display = 'none';
      if (sugEl) sugEl.innerHTML = ['Heatblast', 'Four Arms', 'Diamondhead', 'Alien X'].map(function (s) {
        return '<button class="sr-chip" type="button" data-nf-suggest="' + esc(s) + '">' + s + '</button>';
      }).join('');
    }
    document.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-nf-suggest]');
      if (!chip) return;
      var name = chip.getAttribute('data-nf-suggest');
      var alien = B10.all().filter(function (a) { return a.name.toLowerCase() === name.toLowerCase(); })[0];
      if (alien && B10.featured.some(function (f) { return f.slug === alien.slug; })) {
        UI.navigate(UI.url('aliens/' + alien.slug + '.html'), alien.name);
      } else {
        UI.navigate(UI.url('search.html?q=' + encodeURIComponent(name)), 'Search');
      }
    });
  }

  /* ================= ENCYCLOPEDIA ================= */
  function initEncyclopedia() {
    var grid = document.getElementById('enc-grid');
    var tabs = document.getElementById('enc-tabs');
    var input = document.getElementById('enc-input');
    var countEl = document.getElementById('enc-count');
    var heroCount = document.getElementById('enc-hero-count');
    if (!grid || !window.LORE) return;
    var LORE = window.LORE;
    var active = 'all';

    if (heroCount) heroCount.textContent = LORE.count;

    function card(entry, index) {
      var item = entry.item;
      var isGlossary = entry.section === 'glossary';
      var meta = isGlossary
        ? 'Glossary // ' + String(index + 1).padStart(2, '0')
        : [item.type, item.species, item.world, item.era].filter(Boolean).join(' · ');
      var tags = isGlossary
        ? ['Universe term']
        : (item.tags || []).slice(0, 3);
      var slug = item.name ? UI.slugify(item.name) : '';
      var photo = entry.section === 'characters' && slug ? UI.characterPhoto(slug) : '';
      var head =
        '<div class="enc-card__top">' +
          '<span class="enc-card__type">' + esc(entry.label) + ' // ' + String(index + 1).padStart(2, '0') + '</span>' +
          '<span class="enc-card__glyph">' + glyph(item.glyph || 'hex') + '</span>' +
        '</div>';
      var body =
        '<h3 class="enc-card__name">' + esc(item.name || item.term) + '</h3>' +
        '<div class="enc-card__meta">' + esc(meta) + '</div>' +
        '<p class="enc-card__desc">' + esc(item.desc || item.def) + '</p>' +
        '<div class="enc-card__tags">' + tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>';

      if (photo) {
        return '<article class="enc-card enc-card--' + entry.section + ' enc-card--photo" style="--accent:' + (item.accent || '#a3ff12') + '">' +
          '<div class="enc-card__media">' +
            '<img src="' + photo + '" alt="' + esc(item.name) + '" loading="lazy" decoding="async">' +
            '<span class="enc-card__origin">' + esc(item.world || 'Unknown') + '</span>' +
            '<span class="enc-card__glyph">' + glyph(item.glyph || 'hex') + '</span>' +
          '</div>' +
          '<div class="enc-card__body">' + '<div class="enc-card__top"><span class="enc-card__type">' + esc(entry.label) + ' // ' + String(index + 1).padStart(2, '0') + '</span></div>' + body + '</div>' +
        '</article>';
      }
      return '<article class="enc-card enc-card--' + entry.section + '" style="--accent:' + (item.accent || '#a3ff12') + '">' +
        head + body +
      '</article>';
    }

    function render() {
      var q = (input && input.value || '').trim().toLowerCase();
      var items = [];
      LORE.sections.forEach(function (s) {
        if (active !== 'all' && active !== s.id) return;
        s.items.forEach(function (item) {
          var hay = [item.name, item.term, item.desc, item.def, item.type, item.species, item.world, item.era, (item.tags || []).join(' ')].join(' ').toLowerCase();
          if (!q || hay.indexOf(q) > -1) items.push({ section: s.id, label: s.singular, item: item });
        });
      });
      grid.innerHTML = items.length
        ? items.map(card).join('')
        : '<div class="archive-empty"><h3>No codex match</h3><p>Try a broader term, or clear the filter to see all ' + LORE.count + ' entries.</p>' +
          '<div class="search-zero__actions" style="justify-content:center"><button class="btn btn--sm" type="button" id="enc-reset"><span>Reset codex</span></button></div></div>';
      if (countEl) countEl.innerHTML = '<b>' + String(items.length).padStart(2, '0') + '</b> entries';
      var reset = document.getElementById('enc-reset');
      if (reset) reset.addEventListener('click', function () {
        active = 'all';
        if (input) input.value = '';
        if (tabs) tabs.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-enc') === 'all'); });
        render();
      });
    }

    if (tabs) {
      var list = [{ id: 'all', label: 'Everything', n: LORE.count }].concat(LORE.sections.map(function (s) {
        return { id: s.id, label: s.label, n: s.items.length };
      }));
      tabs.innerHTML = list.map(function (f) {
        return '<button class="chip' + (f.id === 'all' ? ' is-active' : '') + '" type="button" data-enc="' + f.id + '">' +
          f.label + ' <span>' + String(f.n).padStart(2, '0') + '</span></button>';
      }).join('');
      tabs.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-enc]');
        if (!btn) return;
        active = btn.getAttribute('data-enc');
        tabs.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-active', c === btn); });
        render();
        UI.sound.tick();
      });
    }

    if (input) input.addEventListener('input', render);
    render();
  }

  if (UI.page === 'omnitrix') initOmnitrix();
  if (UI.page === 'universe') initUniverse();
  if (UI.page === 'search') initSearch();
  if (UI.page === 'encyclopedia') initEncyclopedia();
  if (UI.page === '404') initNotFound();
})();

