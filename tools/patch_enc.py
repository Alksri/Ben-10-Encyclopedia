import io
from pathlib import Path

p = Path("assets/js/render-pages.js")
t = p.read_text(encoding="utf-8")

start_marker = "    function card(entry, index) {"
end_marker = "\n    function render() {"
i = t.index(start_marker)
j = t.index(end_marker, i)

new = '''    function card(entry, index) {
      var item = entry.item;
      var isGlossary = entry.section === 'glossary';
      var meta = isGlossary
        ? 'Glossary // ' + String(index + 1).padStart(2, '0')
        : [item.type, item.species, item.world, item.era].filter(Boolean).join(' · ');
      var tags = isGlossary
        ? ['Universe term']
        : (item.tags || []).slice(0, 3);
      var slug = item.name ? slugify(item.name) : '';
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
          '<div class="enc-card__body">' + head + body + '</div>' +
        '</article>';
      }
      return '<article class="enc-card enc-card--' + entry.section + '" style="--accent:' + (item.accent || '#a3ff12') + '">' +
        head + body +
      '</article>';
    }
'''

t = t[:i] + new + t[j:]
p.write_text(t, encoding="utf-8")
print("patched", p)
