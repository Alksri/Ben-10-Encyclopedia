from pathlib import Path
p = Path("assets/js/render-pages.js")
t = p.read_text(encoding="utf-8")
t = t.replace("var slug = item.name ? slugify(item.name) : '';",
              "var slug = item.name ? UI.slugify(item.name) : '';")
p.write_text(t, encoding="utf-8")
print("ok")
