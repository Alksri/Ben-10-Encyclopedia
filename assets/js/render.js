/* ==========================================================================
   BEN 10 â€” OMNIVERSE PROTOCOL
   Page renderers: home, archive, alien dossier
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
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        var fills = en.target.querySelectorAll('.stat-bar__fill');
        for (var i = 0; i < fills.length; i++) fills[i].classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function featuredCard(a, i) {
    return '<a class="alien-card" href="' + UI.url('aliens/' + a.slug + '.html') + '" data-warp="' + esc(a.name) + '" ' +
      'style="--accent:' + a.accent + ';--accent-2:' + a.accent2 + '" aria-label="Open ' + esc(a.name) + ' dossier">' +
      '<span class="alien-card__bar" aria-hidden="true"></span>' +
      '<span class="alien-card__portrait" aria-hidden="true"><img src="' + UI.portrait(a.slug) + '" alt=""></span>' +
      '<span class="alien-card__top">' +
        '<span class="alien-card__entry">Entry <b>' + a.entry + '</b> / 010</span>' +
        '<span class="alien-card__glyph">' + glyph(a.glyph) + '</span>' +
      '</span>' +
      '<span class="alien-card__num" aria-hidden="true">' + a.entry + '</span>' +
      '<span class="alien-card__body">' +
        '<span class="alien-card__name">' + esc(a.name) + '</span>' +
        '<span class="alien-card__tagline">' + esc(a.tagline) + '</span>' +
        '<span class="alien-card__meta"><span><span class="sp">' + esc(a.species) + '</span> Â· ' + esc(a.planet) + '</span>' +
        '<span class="alien-card__arrow">Dossier ' + arrow() + '</span></span>' +
      '</span></a>';
  }

  function tickerMarkup() {
    var names = B10.featured.concat(B10.archive.slice(0, 14));
    var items = names.map(function (a) {
      return '<span class="ticker__item"><b>' + esc(a.name) + '</b> ' + esc(a.species) + '</span>';
    }).join('');
    return '<div class="ticker__group">' + items + '</div><div class="ticker__group" aria-hidden="true">' + items + '</div>';
  }

  /* ================= HOME ================= */
  function initHome() {
    var grid = document.getElementById('archive-grid');
    if (grid) grid.innerHTML = B10.featured.map(featuredCard).join('');

    var track = document.getElementById('ticker-track');
    if (track) track.innerHTML = tickerMarkup();

    var eraGrid = document.getElementById('era-grid');
    if (eraGrid) {
      eraGrid.innerHTML = B10.series.map(function (s) {
        return '<a class="era-card" href="' + UI.url('universe.html') + '#era-' + s.year + '" data-warp="Universe" style="--accent:' + s.accent + '">' +
          '<span class="era-card__year">' + s.year + '</span>' +
          '<span class="era-card__label">' + esc(s.label) + '</span>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p>' + esc(s.blurb.split('. ')[0]) + '.</p>' +
          '<span class="era-card__device">' + esc(s.device) + '</span></a>';
      }).join('');
    }

    var modeGrid = document.getElementById('mode-grid');
    if (modeGrid) {
      modeGrid.innerHTML = B10.modes.map(function (m, i) {
        return '<a class="mode-card" href="' + UI.url('omnitrix.html') + '" data-warp="Omnitrix" style="--accent:' + m.accent + '">' +
          '<span class="mode-card__top"><span class="mode-card__index">0' + (i + 1) + ' / DEVICE</span>' +
          '<span class="mode-card__state"><i></i>Online</span></span>' +
          '<h3>' + esc(m.name) + '</h3>' +
          '<span class="mode-card__label">' + esc(m.label) + '</span>' +
          '<p>' + esc(m.desc) + '</p>' +
          '<span class="mode-card__specs">' + m.specs.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</span></a>';
      }).join('');
    }

    var randomBtns = document.querySelectorAll('[data-random-alien]');
    randomBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var a = B10.featured[Math.floor(Math.random() * B10.featured.length)];
        UI.navigate(UI.url('aliens/' + a.slug + '.html'), a.name);
      });
    });

    observeNew(document);
  }

  /* ================= ARCHIVE ================= */
  var TAGS = {
    heatblast: 'power', 'four-arms': 'power', xlr8: 'speed', diamondhead: 'defense',
    upgrade: 'tech', ghostfreak: 'stealth', ripjaws: 'aquatic', stinkfly: 'flight',
    wildmutt: 'tracking', cannonbolt: 'defense'
  };
  var FILTERS = [
    { id: 'all', label: 'All forms' }, { id: 'power', label: 'Power' }, { id: 'speed', label: 'Speed' },
    { id: 'defense', label: 'Defense' }, { id: 'tech', label: 'Tech' }, { id: 'stealth', label: 'Stealth' },
    { id: 'flight', label: 'Flight' }, { id: 'aquatic', label: 'Aquatic' }, { id: 'tracking', label: 'Tracking' }
  ];

  function initArchive() {
    var grid = document.getElementById('alien-grid');
    var filterWrap = document.getElementById('archive-filters');
    var input = document.getElementById('archive-input');
    var count = document.getElementById('archive-count');
    if (!grid) return;
    var activeFilter = 'all';

    if (filterWrap) {
      filterWrap.innerHTML = FILTERS.map(function (f) {
        var n = f.id === 'all' ? B10.featured.length : B10.featured.filter(function (a) { return TAGS[a.slug] === f.id; }).length;
        return '<button class="chip' + (f.id === 'all' ? ' is-active' : '') + '" type="button" data-filter="' + f.id + '">' +
          f.label + ' <span>' + String(n).padStart(2, '0') + '</span></button>';
      }).join('');
      filterWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-filter]');
        if (!btn) return;
        activeFilter = btn.getAttribute('data-filter');
        filterWrap.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-active', c === btn); });
        render();
      });
    }

    function render() {
      var q = (input && input.value || '').trim().toLowerCase();
      var list = B10.featured.filter(function (a) {
        var tagOk = activeFilter === 'all' || TAGS[a.slug] === activeFilter;
        var textOk = !q || (a.name + ' ' + a.species + ' ' + a.planet + ' ' + a.tagline).toLowerCase().indexOf(q) > -1;
        return tagOk && textOk;
      });
      grid.innerHTML = list.length
        ? list.map(featuredCard).join('')
        : '<div class="archive-empty"><h3>No forms in this filter</h3><p>Reset the filter or search the full ' + B10.all().length + '-form database.</p><div class="search-zero__actions" style="justify-content:center"><button class="btn btn--sm" type="button" id="reset-filters"><span>Reset filters</span></button></div></div>';
      if (count) count.innerHTML = '<b>' + String(list.length).padStart(2, '0') + '</b> / 10 forms';
      var reset = document.getElementById('reset-filters');
      if (reset) reset.addEventListener('click', function () {
        activeFilter = 'all';
        if (input) input.value = '';
        if (filterWrap) filterWrap.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-filter') === 'all'); });
        render();
      });
    }

    if (input) input.addEventListener('input', render);
    render();
    observeNew(document);
  }

  /* ================= ALIEN DOSSIER ================= */
  function radarSvg(stats) {
    var keys = [['strength', 'STR'], ['speed', 'SPD'], ['durability', 'DUR'], ['energy', 'NRG'], ['intellect', 'INT'], ['agility', 'AGI']];
    var cx = 120, cy = 120, R = 78;
    var grid = '';
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      var pts = keys.map(function (k, i) {
        var a = -Math.PI / 2 + i * Math.PI / 3;
        return (cx + Math.cos(a) * R * f).toFixed(1) + ',' + (cy + Math.sin(a) * R * f).toFixed(1);
      }).join(' ');
      grid += '<polygon class="radar__grid" points="' + pts + '"/>';
    });
    var axes = '', labels = '', dots = '';
    var shapePts = keys.map(function (k, i) {
      var a = -Math.PI / 2 + i * Math.PI / 3;
      axes += '<line class="radar__axis" x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(a) * R).toFixed(1) + '" y2="' + (cy + Math.sin(a) * R).toFixed(1) + '"/>';
      var lx = cx + Math.cos(a) * (R + 26);
      var ly = cy + Math.sin(a) * (R + 26);
      labels += '<text class="radar__label" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" dominant-baseline="middle">' + k[1] + '</text>';
      var v = Math.max(1, Math.min(10, stats[k[0]] || 0));
      var px = cx + Math.cos(a) * R * (v / 10);
      var py = cy + Math.sin(a) * R * (v / 10);
      dots += '<circle class="radar__dot" cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="2"/>';
      return px.toFixed(1) + ',' + py.toFixed(1);
    }).join(' ');
    return '<svg viewBox="0 0 240 240" role="img" aria-label="Combat stat radar">' + grid + axes +
      '<polygon class="radar__shape" points="' + shapePts + '"/>' + dots + labels + '</svg>';
  }

  function statBars(stats) {
    var keys = [['strength', 'Strength'], ['speed', 'Speed'], ['durability', 'Durability'], ['energy', 'Energy'], ['intellect', 'Intellect'], ['agility', 'Agility']];
    return '<div class="stat-bars reveal">' + keys.map(function (k, i) {
      return '<div class="stat-bar"><span class="stat-bar__label">' + k[1] + '</span>' +
        '<span class="stat-bar__track"><span class="stat-bar__fill" style="--v:' + stats[k[0]] + ';--delay:' + (i * 0.07) + 's"></span></span>' +
        '<span class="stat-bar__val">' + stats[k[0]] + '</span></div>';
    }).join('') + '</div>';
  }

  function relatedCard(a) {
    var isFeatured = B10.featured.some(function (f) { return f.slug === a.slug; });
    var tag = isFeatured ? 'a' : 'button';
    var attrs = isFeatured
      ? ' href="' + UI.url('aliens/' + a.slug + '.html') + '" data-warp="' + esc(a.name) + '"'
      : ' type="button" data-open-alien="' + a.slug + '"';
    return '<' + tag + ' class="related-card" style="--accent:' + a.accent + '"' + attrs + '>' +
      (isFeatured ? '<span class="related-card__art" aria-hidden="true"><img src="' + UI.portrait(a.slug) + '" alt=""></span>' : '') +
      '<span class="related-card__glyph">' + glyph(a.glyph) + '</span>' +
      '<span class="related-card__arrow">' + arrow() + '</span>' +
      '<span class="related-card__name">' + esc(a.name) + '</span>' +
      '<span class="related-card__meta">' + esc(a.species) + ' Â· ' + esc(a.series) + '</span>' +
      '</' + tag + '>';
  }

  function initAlien() {
    var slug = document.body.getAttribute('data-alien');
    var a = B10.featured.filter(function (f) { return f.slug === slug; })[0];
    var mount = document.getElementById('alien-content');
    if (!a) {
      if (mount) mount.innerHTML = '<div class="shell" style="padding:180px 0"><h1 class="page-title">Form not found</h1><p class="lead">This dossier is not in the archive.</p></div>';
      return;
    }
    document.title = a.name + ' // Ben 10 Omniverse Protocol';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', a.summary);
    document.body.style.setProperty('--accent', a.accent);
    document.body.style.setProperty('--accent-2', a.accent2);
    document.documentElement.style.setProperty('--accent', a.accent);

    var nameParts = a.name.split(' ');
    var nameHtml = nameParts.length > 1
      ? esc(nameParts.slice(0, -1).join(' ')) + ' <span class="accent">' + esc(nameParts[nameParts.length - 1]) + '</span>'
      : '<span class="accent">' + esc(a.name) + '</span>';

    var next = B10.featured[(B10.featured.indexOf(a) + 1) % B10.featured.length];
    var related = (a.related || []).map(function (s) { return B10.bySlug(s); }).filter(Boolean);

    mount.innerHTML =
      '<section class="alien-hero">' +
        '<div class="shell alien-hero__grid">' +
          '<div class="alien-hero__copy">' +
            '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="' + UI.url('index.html') + '" data-warp="Home">Home</a><i></i>' +
              '<a href="' + UI.url('aliens.html') + '" data-warp="Alien Archive">Archive</a><i></i><b>' + esc(a.name) + '</b></nav>' +
            '<div class="alien-kicker"><span class="entry"><i></i>Entry ' + a.entry + ' / 010</span>' +
              '<span class="series">' + esc(a.series) + ' Â· ' + esc(a.year) + '</span></div>' +
            '<h1 class="alien-title">' + nameHtml + '</h1>' +
            '<div class="alien-species"><span>' + esc(a.species) + '</span><i></i><span>' + esc(a.planet) + '</span><i></i><span>' + esc(a.className) + '</span></div>' +
            '<p class="alien-tagline">' + esc(a.tagline) + '</p>' +
            '<div class="alien-badges">' +
              '<span class="alien-badge alien-badge--threat"><i></i>Threat <b>' + esc(a.threat) + '</b></span>' +
              '<span class="alien-badge">DNA <b>' + esc(a.dna) + '</b></span>' +
              '<span class="alien-badge">Code <b>' + esc(a.code) + '</b></span>' +
              '<span class="alien-badge">Debut <b>' + esc(a.debut) + '</b></span>' +
            '</div>' +
            '<div class="alien-actions">' +
              '<button class="btn btn--solid" type="button" id="replay-warp"><span>Replay transformation</span><span class="arr">' + arrow() + '</span></button>' +
              '<a class="btn btn--ghost" href="' + UI.url('aliens.html') + '" data-warp="Alien Archive"><span>All forms</span></a>' +
            '</div>' +
          '</div>' +
          '<div class="alien-hero__visual">' +
            '<div class="holo" style="--accent:' + a.accent + '">' +
              '<span class="holo__grid"></span>' +
              '<span class="holo__ring"></span><span class="holo__ring holo__ring--2"></span><span class="holo__ring holo__ring--3"></span>' +
              '<span class="holo__portrait"><img src="' + UI.portrait(a.slug) + '" alt="Stylized portrait of ' + esc(a.name) + '"></span>' +
              '<span class="holo__glyph">' + glyph(a.glyph) + '</span>' +
              '<span class="holo__scan"></span>' +
              '<span class="holo__tag holo__tag--tl">Omnitrix sample<b>' + esc(a.code) + '</b></span>' +
              '<span class="holo__tag holo__tag--tr">DNA lock<b>Stable</b></span>' +
              '<span class="holo__tag holo__tag--bl">Home world<b>' + esc(a.planet) + '</b></span>' +
              '<span class="holo__tag holo__tag--br">Class<b>' + esc(a.className.split(' / ')[0]) + '</b></span>' +
              '<span class="holo__base"><i></i>Holographic dossier // live feed</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<div class="shell dossier">' +
        '<aside class="dossier__side">' +
          '<div class="dossier__side-title">Dossier index</div>' +
          '<nav class="dossier__nav" aria-label="Dossier sections">' +
            '<a href="#overview" class="is-active">Overview <span>01</span></a>' +
            '<a href="#powers">Powers <span>02</span></a>' +
            '<a href="#weaknesses">Weaknesses <span>03</span></a>' +
            '<a href="#stats">Combat stats <span>04</span></a>' +
            '<a href="#moves">Signature moves <span>05</span></a>' +
            '<a href="#related">Related forms <span>06</span></a>' +
          '</nav>' +
          '<div class="dossier__side-meta">' +
            '<div><span>Entry</span><b>' + a.entry + ' / 010</b></div>' +
            '<div><span>Species</span><b>' + esc(a.species) + '</b></div>' +
            '<div><span>Planet</span><b>' + esc(a.planet) + '</b></div>' +
            '<div><span>Series</span><b>' + esc(a.series) + '</b></div>' +
            '<div><span>Threat</span><b style="color:' + a.accent + '">' + esc(a.threat) + '</b></div>' +
          '</div>' +
        '</aside>' +
        '<div class="dossier__main">' +
          '<section class="dossier-section reveal" id="overview">' +
            '<div class="section-index"><b>01</b> Overview // origin record</div>' +
            '<h2>' + esc(a.tagline) + '</h2>' +
            '<div class="prose">' + a.lore.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
            '<blockquote class="pull-quote">â€œ' + esc(a.summary) + 'â€<cite>Plumber archive // ' + esc(a.name) + '</cite></blockquote>' +
          '</section>' +
          '<section class="dossier-section reveal" id="powers">' +
            '<div class="section-index"><b>02</b> Power set // ' + a.powers.length + ' abilities</div>' +
            '<h2>What the watch gives you.</h2>' +
            '<div class="power-grid">' + a.powers.map(function (p, i) {
              return '<article class="power-card"><div class="power-card__num">' + String(i + 1).padStart(2, '0') + ' / ABILITY</div>' +
                '<h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p></article>';
            }).join('') + '</div>' +
          '</section>' +
          '<section class="dossier-section reveal" id="weaknesses">' +
            '<div class="section-index"><b>03</b> Failure modes // known limits</div>' +
            '<h2>Where the form breaks.</h2>' +
            '<div class="weakness-list">' + a.weaknesses.map(function (w) {
              return '<div class="weakness-item"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 1.5 15 14H1L8 1.5Z"/><path d="M8 6v4M8 12v.5"/></svg><span>' + esc(w) + '</span></div>';
            }).join('') + '</div>' +
          '</section>' +
          '<section class="dossier-section reveal" id="stats">' +
            '<div class="section-index"><b>04</b> Combat profile // 1â€“10 scale</div>' +
            '<h2>Read the telemetry.</h2>' +
            '<div class="stats-layout">' + statBars(a.stats) +
              '<div class="radar">' + radarSvg(a.stats) + '</div>' +
            '</div>' +
          '</section>' +
          '<section class="dossier-section reveal" id="moves">' +
            '<div class="section-index"><b>05</b> Signature moves // combat log</div>' +
            '<h2>Three ways to end a fight.</h2>' +
            '<div class="moves">' + a.moves.map(function (m, i) {
              return '<div class="move"><span class="move__num">' + String(i + 1).padStart(2, '0') + '</span>' +
                '<div><div class="move__name">' + esc(m.name) + '</div><p>' + esc(m.desc) + '</p></div>' +
                '<span class="move__tag">Signature</span></div>';
            }).join('') + '</div>' +
          '</section>' +
          '<section class="dossier-section reveal" id="related">' +
            '<div class="section-index"><b>06</b> Cross-reference // related DNA</div>' +
            '<h2>Adjacent forms.</h2>' +
            '<div class="related-grid">' + related.map(relatedCard).join('') + '</div>' +
          '</section>' +
          '<div class="next-form">' +
            '<div><div class="next-form__label">Next entry // ' + next.entry + ' of 010</div>' +
              '<a class="next-form__name" href="' + UI.url('aliens/' + next.slug + '.html') + '" data-warp="' + esc(next.name) + '">' + esc(next.name) + ' â†’</a></div>' +
            '<a class="btn btn--ghost btn--sm" href="' + UI.url('aliens.html') + '" data-warp="Alien Archive"><span>Back to archive</span></a>' +
          '</div>' +
        '</div>' +
      '</div>';

    var replay = document.getElementById('replay-warp');
    if (replay) replay.addEventListener('click', function () {
      var warp = document.getElementById('warp');
      if (!warp || UI.reduceMotion) return;
      document.getElementById('warp-name').textContent = a.name;
      document.getElementById('warp-label').textContent = 'Omnitrix // re-sampling DNA';
      warp.classList.add('is-active');
      UI.sound.warp();
      setTimeout(function () { warp.classList.remove('is-active'); }, 1100);
    });

    // Active section tracking
    var links = document.querySelectorAll('.dossier__nav a');
    var sections = document.querySelectorAll('.dossier-section');
    if ('IntersectionObserver' in window && sections.length) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
        });
      }, { rootMargin: '-20% 0px -65% 0px' });
      sections.forEach(function (s) { so.observe(s); });
    }

    observeNew(document);
  }

  /* ---------- Global related-card handler ---------- */
  document.addEventListener('click', function (e) {
    var rel = e.target.closest('[data-open-alien]');
    if (rel) UI.openAlien(rel.getAttribute('data-open-alien'));
  });

  /* ---------- Boot ---------- */
  if (UI.page === 'home') initHome();
  if (UI.page === 'aliens') initArchive();
  if (UI.page === 'alien') initAlien();
})();

