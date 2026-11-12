from pathlib import Path
p = Path("assets/js/render-pages.js")
t = p.read_text(encoding="utf-8")
old = "'<div class=\"enc-card__body\">' + head + body + '</div>' +"
new = ("'<div class=\"enc-card__body\">' + "
       "'<div class=\"enc-card__top\"><span class=\"enc-card__type\">' + esc(entry.label) + ' // ' + "
       "String(index + 1).padStart(2, '0') + '</span></div>' + body + '</div>' +")
assert old in t, "marker missing"
t = t.replace(old, new)
p.write_text(t, encoding="utf-8")
print("ok")
