from pathlib import Path
import re

count = 0
for p in Path(".").rglob("*.html"):
    if "node_modules" in str(p):
        continue
    t = p.read_text(encoding="utf-8")
    if "photos.js" in t:
        continue
    m = re.search(r'(\s*)<script src="((?:\.\./)?)assets/js/app\.js"></script>', t)
    if not m:
        continue
    indent, prefix = m.group(1), m.group(2)
    t = t.replace(m.group(0),
                  f'{indent}<script src="{prefix}assets/js/photos.js"></script>'
                  f'{indent}<script src="{prefix}assets/js/app.js"></script>', 1)
    p.write_text(t, encoding="utf-8")
    count += 1
print("updated", count, "pages")
