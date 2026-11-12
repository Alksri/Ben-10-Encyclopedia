"""Fetch character/alien reference images via SerpApi Google Images.

Downloads a clean, background-cut portrait and stores it as WebP.
Only images with a near-white studio background are accepted, so the
cutout stays clean on the dark UI; otherwise the original SVG art is kept.

Usage:
  python tools/fetch_images.py --kind aliens [--force] [--only slug]
"""
import argparse
import io
import json
import re
import subprocess
import time
from pathlib import Path

import numpy as np
import requests
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
KEY = "da8a9d327075ffeb75485c1c1475207cb2c19e04d78fe5920c859baef8b80330"
CACHE = ROOT / "tools" / "image_cache.json"
MANIFEST = ROOT / "docs" / "IMAGE_CREDITS.json"

BAD = re.compile(
    r"toy|figure|lego|costume|shirt|hoodie|cake|colou?ring|drawing|sketch|"
    r"amazon|ebay|aliexpress|pngwing|pngtree|seekpng|freepng|clipart|"
    r"meme|quiz|test|wallpaper cave|deviantart|redbubble|teepublic|"
    r"transparent png|png images",
    re.I,
)
GOOD = re.compile(r"ben ?10|omniverse|alien force|ultimate alien", re.I)
WIKI = re.compile(r"fandom|wikia|wikipedia|ben10", re.I)

HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/124.0 Safari/537.36"),
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}


def load_cache():
    return json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}


def save_cache(c):
    CACHE.write_text(json.dumps(c, indent=1), encoding="utf-8")


def slugify(name):
    s = name.lower().replace("'", "").replace("’", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def search(query):
    r = requests.get("https://serpapi.com/search.json", params={
        "engine": "google_images", "q": query, "hl": "en", "gl": "us",
        "api_key": KEY,
    }, timeout=45)
    r.raise_for_status()
    data = r.json()
    if "error" in data:
        raise RuntimeError(data["error"])
    return data.get("images_results", [])


def score(item, name):
    t = (item.get("title") or "") + " " + (item.get("source") or "")
    s = 0
    if name.lower() in t.lower():
        s += 2
    if GOOD.search(t):
        s += 3
    if WIKI.search(item.get("link") or ""):
        s += 2
    if BAD.search(t) or BAD.search(item.get("link") or ""):
        s -= 8
    w, h = item.get("original_width") or 0, item.get("original_height") or 0
    if w and h:
        ar = w / h
        if 0.55 <= ar <= 1.9:
            s += 1
        if min(w, h) < 220:
            s -= 2
        if min(w, h) > 500:
            s += 1
    return s


def download(url):
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    if len(r.content) < 4000:
        raise ValueError("too small")
    img = Image.open(io.BytesIO(r.content))
    img.load()
    if img.width < 160 or img.height < 160:
        raise ValueError("low res")
    return img.convert("RGBA")


def border_white_ratio(img):
    a = np.array(img.convert("RGB"))
    border = np.concatenate([a[0, :], a[-1, :], a[:, 0], a[:, -1]])
    return float((border.min(axis=1) >= 222).mean())


def cutout(img):
    """Remove a flat light background connected to the frame edge."""
    arr = np.array(img)
    rgb = arr[:, :, :3].astype(np.int16)
    lo = rgb.min(axis=2)
    spread = rgb.max(axis=2) - lo
    flat_light = (lo >= 224) | ((lo >= 205) & (spread < 16))
    lbl, n = ndimage.label(flat_light)
    if n == 0:
        return None
    edge = np.unique(np.concatenate([lbl[0, :], lbl[-1, :], lbl[:, 0], lbl[:, -1]]))
    edge = edge[edge != 0]
    if not edge.size:
        return None
    bg = np.isin(lbl, edge)
    if not (0.08 <= bg.mean() <= 0.94):
        return None
    bg = ndimage.binary_dilation(bg, iterations=2)
    arr[:, :, 3] = np.where(bg, 0, arr[:, :, 3])
    out = Image.fromarray(arr, "RGBA")
    alpha = np.array(out)[:, :, 3]
    ys, xs = np.where(alpha > 14)
    if not len(xs):
        return None
    pad = 10
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad),
           min(out.width, xs.max() + pad), min(out.height, ys.max() + pad))
    return out.crop(box)


def finish(img, size=680):
    img.thumbnail((size, size), Image.LANCZOS)
    return img


def process(name, out_dir, cache, suffix="Ben 10"):
    slug = slugify(name)
    out = out_dir / (slug + ".webp")
    rec = cache.setdefault(slug, {})
    if out.exists() and rec.get("ok"):
        return "cached"
    if "results" not in rec:
        try:
            rec["results"] = search(name + " " + suffix)[:18]
            rec["query"] = name + " " + suffix
            save_cache(cache)
        except Exception as e:
            print(f"  ! search failed {name}: {e}")
            return "search-failed"
        time.sleep(0.4)

    ranked = sorted(rec["results"], key=lambda it: score(it, name), reverse=True)
    tries = 0
    for item in ranked:
        if score(item, name) < 0:
            continue
        for field in ("original", "thumbnail"):
            if tries >= 10:
                break
            url = item.get(field)
            if not url:
                continue
            tries += 1
            try:
                img = download(url)
            except Exception:
                continue
            if border_white_ratio(img) < 0.45:
                continue
            cut = cutout(img)
            if cut is None:
                continue
            img = finish(cut)
            out.parent.mkdir(parents=True, exist_ok=True)
            img.save(out, "WEBP", quality=82, method=6)
            rec.update({
                "ok": True, "w": img.width, "h": img.height,
                "used": {"url": url, "page": item.get("link"),
                         "title": item.get("title"), "source": item.get("source")},
            })
            save_cache(cache)
            return f"ok {img.width}x{img.height} {out.stat().st_size // 1024}KB"
        if tries >= 10:
            break
    rec["ok"] = False
    save_cache(cache)
    return "no-clean-image"


def collect():
    js = """
    global.window = {};
    require('./assets/js/data.js');
    require('./assets/js/lore.js');
    const chars = (window.LORE.sections.find(s => s.id === 'characters') || {}).items || [];
    console.log(JSON.stringify({
      aliens: window.B10.all().map(a => ({ name: a.name, slug: a.slug })),
      characters: chars.map(c => ({ name: c.name }))
    }));
    """
    res = subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True,
                         text=True, encoding="utf-8")
    if res.returncode != 0:
        raise SystemExit(res.stderr)
    return json.loads(res.stdout)


def write_manifest(cache):
    MANIFEST.parent.mkdir(exist_ok=True)
    MANIFEST.write_text(json.dumps({
        "note": ("Reference imagery gathered via Google Image Search. Characters and "
                 "artwork are the property of Cartoon Network / Warner Bros. Discovery. "
                 "Used here for a non-commercial fan project with attribution."),
        "images": {k: v.get("used") for k, v in cache.items() if v.get("ok")},
    }, indent=1), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--kind", choices=["aliens", "characters", "all"], default="all")
    ap.add_argument("--only", default=None)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    data = collect()
    cache = load_cache()
    jobs = []
    if args.kind in ("aliens", "all"):
        jobs += [(a["name"], ROOT / "assets" / "img" / "aliens") for a in data["aliens"]]
    if args.kind in ("characters", "all"):
        jobs += [(c["name"], ROOT / "assets" / "img" / "characters") for c in data["characters"]]
    if args.only:
        jobs = [j for j in jobs if args.only.lower() in j[0].lower()]

    if args.force:
        for name, _ in jobs:
            s = slugify(name)
            cache.get(s, {}).pop("ok", None)
            (ROOT / "assets" / "img" / ("characters" if "characters" in str(_) else "aliens") / (s + ".webp")).unlink(missing_ok=True)

    print(f"{len(jobs)} jobs")
    failed = []
    for i, (name, out_dir) in enumerate(jobs, 1):
        res = process(name, out_dir, cache)
        print(f"[{i:02d}/{len(jobs)}] {name}: {res}", flush=True)
        if res.startswith("no-") or res == "search-failed":
            failed.append((name, res))
    write_manifest(cache)
    if failed:
        print("\nFAILED:")
        for n, r in failed:
            print(" -", n, r)


if __name__ == "__main__":
    main()
