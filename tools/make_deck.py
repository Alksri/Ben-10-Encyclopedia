"""Build the Ben 10 // Omniverse Protocol pitch deck (16:9, dark)."""
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt, Emu
from lxml import etree

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "BEN10_Omniverse_Protocol_Deck.pptx"

W, H = 13.333, 7.5
BG = RGBColor(0x05, 0x07, 0x05)
PANEL = RGBColor(0x0B, 0x0F, 0x0A)
GREEN = RGBColor(0xA3, 0xFF, 0x12)
GREEN_DIM = RGBColor(0x57, 0xC4, 0x00)
INK = RGBColor(0xF2, 0xF6, 0xEE)
MUTED = RGBColor(0x8B, 0x96, 0x81)
MUTED2 = RGBColor(0x5A, 0x65, 0x53)
LINE = RGBColor(0x22, 0x2C, 0x1D)
RED = RGBColor(0xE2, 0x49, 0x3F)

DISPLAY = "Arial Black"
BODY = "Segoe UI"
MONO = "Consolas"

prs = Presentation()
prs.slide_width = Inches(W)
prs.slide_height = Inches(H)
BLANK = prs.slide_layouts[6]


def alpha(shape, pct):
    """Set fill transparency (pct = 0..100 opaque)."""
    fill = shape.fill
    srgb = fill.fore_color._xFill
    for solid in srgb.findall("{http://schemas.openxmlformats.org/drawingml/2006/main}srgbClr"):
        a = etree.SubElement(solid, "{http://schemas.openxmlformats.org/drawingml/2006/main}alpha")
        a.set("val", str(int(pct * 1000)))


def slide():
    s = prs.slides.add_slide(BLANK)
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(W), Inches(H))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG
    bg.line.fill.background()
    bg.shadow.inherit = False
    return s


def rect(s, x, y, w, h, fill=None, line=None, lw=0.75, shape=MSO_SHAPE.RECTANGLE):
    sh = s.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill is None:
        sh.fill.background()
    else:
        sh.fill.solid()
        sh.fill.fore_color.rgb = fill
    if line is None:
        sh.line.fill.background()
    else:
        sh.line.color.rgb = line
        sh.line.width = Pt(lw)
    sh.shadow.inherit = False
    return sh


def text(s, txt, x, y, w, h, size=14, color=INK, font=BODY, bold=False,
         align=PP_ALIGN.LEFT, spacing=1.0, anchor=MSO_ANCHOR.TOP, caps=False,
         char_space=None):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    lines = txt.split("\n")
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = spacing
        r = p.add_run()
        r.text = line.upper() if caps else line
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.name = font
        r.font.color.rgb = color
        if char_space is not None:
            r.font._rPr.set("spc", str(int(char_space * 100)))
    return tb


def line(s, x1, y1, x2, y2, color=LINE, lw=0.75):
    from pptx.enum.shapes import MSO_CONNECTOR
    c = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1),
                               Inches(x2), Inches(y2))
    c.line.color.rgb = color
    c.line.width = Pt(lw)
    return c


def chrome(s, eyebrow, num, total=16):
    text(s, eyebrow, 0.62, 0.42, 8.5, 0.24, size=8, color=GREEN, font=MONO,
         bold=True, char_space=2.6)
    text(s, f"{num:02d} / {total:02d}", W - 2.0, 0.42, 1.38, 0.24, size=8,
         color=MUTED2, font=MONO, align=PP_ALIGN.RIGHT, char_space=2.0)
    line(s, 0.62, 0.78, W - 0.62, 0.78, LINE, 0.6)
    line(s, 0.62, H - 0.52, W - 0.62, H - 0.52, LINE, 0.6)
    text(s, "BEN 10 // OMNIVERSE PROTOCOL", 0.62, H - 0.42, 5.0, 0.2, size=7,
         color=MUTED2, font=MONO, char_space=1.8)
    text(s, "FAN-MADE · ORIGINAL ART & AUDIO", W - 4.4, H - 0.42, 3.78, 0.2,
         size=7, color=MUTED2, font=MONO, align=PP_ALIGN.RIGHT, char_space=1.4)
    # corner brackets
    for cx, cy, dx, dy in ((0.3, 0.3, 1, 1), (W - 0.3, 0.3, -1, 1),
                           (0.3, H - 0.3, 1, -1), (W - 0.3, H - 0.3, -1, -1)):
        line(s, cx, cy, cx + 0.16 * dx, cy, GREEN_DIM, 1.0)
        line(s, cx, cy, cx, cy + 0.16 * dy, GREEN_DIM, 1.0)


def omnitrix(s, cx, cy, r, opacity=100):
    """Stylised device drawn from primitives."""
    for mult, a in ((1.55, 3), (1.32, 4), (1.12, 5)):
        halo = rect(s, cx - r * mult, cy - r * mult, r * mult * 2, r * mult * 2,
                    GREEN, shape=MSO_SHAPE.OVAL)
        alpha(halo, a)
    rect(s, cx - r * 1.06, cy - r * 1.06, r * 2.12, r * 2.12, PANEL, GREEN_DIM, 1.1,
         MSO_SHAPE.OVAL)
    rect(s, cx - r * 0.92, cy - r * 0.92, r * 1.84, r * 1.84, BG, LINE, 0.7,
         MSO_SHAPE.OVAL)
    # hourglass: two triangles
    top = s.shapes.add_shape(MSO_SHAPE.ISOSCELES_TRIANGLE,
                             Inches(cx - r * 0.52), Inches(cy - r * 0.62),
                             Inches(r * 1.04), Inches(r * 0.62))
    top.fill.solid()
    top.fill.fore_color.rgb = GREEN
    top.line.fill.background()
    top.rotation = 180
    bot = s.shapes.add_shape(MSO_SHAPE.ISOSCELES_TRIANGLE,
                             Inches(cx - r * 0.52), Inches(cy),
                             Inches(r * 1.04), Inches(r * 0.62))
    bot.fill.solid()
    bot.fill.fore_color.rgb = GREEN
    bot.line.fill.background()
    rect(s, cx - r * 0.16, cy - r * 0.16, r * 0.32, r * 0.32, BG, None,
         shape=MSO_SHAPE.OVAL)
    rect(s, cx - r * 0.06, cy - r * 0.06, r * 0.12, r * 0.12, GREEN, None,
         shape=MSO_SHAPE.OVAL)


# ---------------------------------------------------------------- 01 COVER
s = slide()
omnitrix(s, 10.55, 3.55, 2.05)
text(s, "O M N I V E R S E   P R O T O C O L", 0.9, 1.15, 8.0, 0.3, size=10,
     color=GREEN, font=MONO, bold=True, char_space=3.2)
text(s, "BEN 10", 0.86, 1.6, 8.6, 1.5, size=96, color=INK, font=DISPLAY,
     bold=True, spacing=0.9)
text(s, "OMNIVERSE\nPROTOCOL", 0.9, 3.02, 8.4, 2.0, size=54, color=INK,
     font=DISPLAY, bold=True, spacing=1.05)
rect(s, 0.95, 5.06, 1.9, 0.045, GREEN)
text(s, "A cinematic fan archive of the entire universe.\nTen dossiers. Five eras. One watch.",
     0.95, 5.28, 7.4, 0.9, size=15, color=MUTED, spacing=1.35)
line(s, 0.95, 6.34, 8.2, 6.34, LINE, 0.6)
for i, (k, v) in enumerate([("PAGES", "18"), ("ALIENS", "55"), ("ENTRIES", "86"),
                            ("DEPS", "0")]):
    x = 0.95 + i * 1.85
    text(s, v, x, 6.5, 1.2, 0.4, size=20, color=GREEN, font=DISPLAY, bold=True)
    text(s, k, x, 6.92, 1.4, 0.2, size=7, color=MUTED2, font=MONO, char_space=2.0)

# ---------------------------------------------------------------- 02 PROBLEM
s = slide()
chrome(s, "01 // THE PROBLEM", 2)
text(s, "THE ARCHIVE\nFEELS LIKE\nHOMEWORK.", 0.62, 1.25, 6.4, 2.6, size=46,
     font=DISPLAY, bold=True, spacing=1.0)
text(s, "Ben 10 has one of the largest rosters in animation — five eras, dozens of\ndevices, hundreds of transformations. Almost all of it lives in ad-heavy\nwikis with flat navigation and no sense of place.",
     0.68, 4.35, 6.3, 1.5, size=13, color=MUTED, spacing=1.5)
for i, (n, l, d) in enumerate([
        ("05", "SERIES ERAS", "Original → Omniverse → Reboot"),
        ("55+", "TRANSFORMATIONS", "Across every continuity"),
        ("0", "GOOD INTERFACES", "Nothing behaves like the device")]):
    x = 7.35 + i * 1.88
    line(s, x, 1.6, x, 5.6, LINE, 0.6)
    text(s, n, x + 0.18, 1.75, 1.6, 0.7, size=40, color=GREEN, font=DISPLAY, bold=True)
    text(s, l, x + 0.18, 2.62, 1.55, 0.24, size=7.5, color=INK, font=MONO,
         bold=True, char_space=1.6)
    text(s, d, x + 0.18, 2.96, 1.5, 1.4, size=10.5, color=MUTED2, spacing=1.4)
rect(s, 0.62, 6.05, 0.035, 0.5, GREEN)
text(s, "The roster is the product. The interface is the problem.",
     0.82, 6.12, 8.0, 0.3, size=11, color=MUTED, font=BODY)

# ---------------------------------------------------------------- 03 INSIGHT
s = slide()
chrome(s, "02 // THE INSIGHT", 3)
text(s, "THE DEVICE IS\nTHE INTERFACE.", 0.62, 1.2, 7.0, 1.9, size=44, font=DISPLAY,
     bold=True)
text(s, "Don't build a wiki about the Omnitrix. Build the Omnitrix.",
     0.68, 2.72, 7.2, 0.4, size=15, color=GREEN, font=BODY)
rect(s, 0.68, 3.3, 5.6, 1.5, PANEL, LINE, 0.7)
text(s, "“A hacker-terminal Omnitrix that turns the\nBen 10 universe into a playable archive.”",
     0.95, 3.56, 5.1, 1.0, size=15, color=INK, spacing=1.45)
pillars = [("01", "TRANSFORM, NOT NAVIGATE", "Every route change is a warp."),
           ("02", "TEN REAL DOSSIERS", "Depth behind the ten headline forms."),
           ("03", "FORGIVING SEARCH", "Typos still find the alien."),
           ("04", "ORIGINAL BY LAW", "No official art, logos or audio.")]
for i, (n, t, d) in enumerate(pillars):
    y = 1.35 + i * 1.36
    text(s, n, 7.2, y, 0.5, 0.3, size=9, color=GREEN, font=MONO, bold=True)
    text(s, t, 7.75, y - 0.06, 4.9, 0.3, size=13, color=INK, font=DISPLAY, bold=True)
    text(s, d, 7.75, y + 0.32, 4.9, 0.3, size=11, color=MUTED2)
    line(s, 7.2, y + 0.95, 12.7, y + 0.95, LINE, 0.5)
line(s, 0.68, 6.28, 6.28, 6.28, LINE, 0.5)
text(s, "SCOPE", 0.68, 6.44, 0.9, 0.2, size=7, color=GREEN, font=MONO, bold=True,
     char_space=2.0)
text(s, "18 PAGES   ·   55 ALIENS   ·   86 ENTRIES   ·   0 DEPENDENCIES",
     1.55, 6.44, 6.0, 0.2, size=7.5, color=MUTED2, font=MONO, char_space=1.2)

# ---------------------------------------------------------------- 04 EXPERIENCE MAP
s = slide()
chrome(s, "03 // EXPERIENCE MAP", 4)
text(s, "EIGHT ROUTES.\nONE CONTINUOUS WORLD.", 0.62, 1.18, 8.0, 1.5, size=34,
     font=DISPLAY, bold=True, spacing=1.05)
rows = [("01", "/", "HOME", "Hero, live dial, featured ten, eras, modes"),
        ("02", "/aliens", "ALIEN ARCHIVE", "10 art cards + 45 archive forms, filters"),
        ("03", "/aliens/{slug}", "DOSSIER ×10", "Radar, stats, moves, related, replay"),
        ("04", "/omnitrix", "OMNITRIX LAB", "Modes, exploded dial, spec sheet"),
        ("05", "/encyclopedia", "ENCYCLOPEDIA", "86 entries across 6 categories"),
        ("06", "/universe", "UNIVERSE", "5-era timeline, factions, devices"),
        ("07", "/search", "UNIVERSAL SEARCH", "Fuzzy matcher + themed 404"),
        ("08", "/about", "ABOUT", "Design system, credits, rights")]
for i, (n, route, name, desc) in enumerate(rows):
    y = 2.9 + i * 0.44
    text(s, n, 0.62, y, 0.4, 0.24, size=8, color=GREEN, font=MONO, bold=True)
    text(s, route, 1.15, y - 0.02, 1.9, 0.24, size=10, color=MUTED, font=MONO)
    text(s, name, 3.2, y - 0.04, 2.6, 0.24, size=11, color=INK, font=DISPLAY, bold=True)
    text(s, desc, 6.1, y - 0.01, 6.2, 0.24, size=10, color=MUTED2)
    line(s, 0.62, y + 0.33, 12.7, y + 0.33, LINE, 0.4)
text(s, "18 PAGES TOTAL", 0.62, 6.68, 3.0, 0.2, size=7.5, color=GREEN, font=MONO,
     bold=True, char_space=2.0)
text(s, "7 core · 10 dossiers · 1 themed error state", 3.4, 6.68, 6.0, 0.2,
     size=8, color=MUTED2, font=MONO)

# ---------------------------------------------------------------- 05 BOOT
s = slide()
chrome(s, "04 // THE FIRST EIGHT SECONDS", 5)
text(s, "IT BOOTS LIKE\nA DEVICE.", 0.62, 1.18, 6.2, 1.7, size=40, font=DISPLAY, bold=True)
text(s, "A full-screen Omnitrix sequence with an original synthesised sting.\nGesture-gated audio. Skippable. Remembered per browser.",
     0.68, 2.78, 6.0, 0.9, size=12.5, color=MUTED, spacing=1.5)
steps = [("00.0", "SEAL BREAKS", "Overlay fades in, device renders"),
         ("01.2", "CORE SPIN", "Ring accelerates, ticks ignite"),
         ("02.6", "DNA SCAN", "Sample lines resolve across the dial"),
         ("04.0", "LOCK", "Green flash, label stamps in"),
         ("05.2", "HANDOFF", "Hero reveals, particles start")]
for i, (t, n, d) in enumerate(steps):
    y = 1.5 + i * 0.92
    text(s, t, 7.0, y, 0.7, 0.24, size=9, color=GREEN, font=MONO, bold=True)
    text(s, n, 7.85, y - 0.05, 3.4, 0.28, size=12, color=INK, font=DISPLAY, bold=True)
    text(s, d, 7.85, y + 0.26, 4.4, 0.24, size=10, color=MUTED2)
    if i < len(steps) - 1:
        line(s, 7.32, y + 0.62, 7.32, y + 0.86, GREEN_DIM, 1.0)
line(s, 7.32, 1.62, 7.32, 5.9, LINE, 0.6)
omnitrix(s, 2.1, 5.5, 0.9)
text(s, "ORIGINAL STING", 3.35, 5.12, 3.0, 0.22, size=7.5, color=GREEN, font=MONO,
     bold=True, char_space=2.0)
text(s, "Oscillators + filtered noise,\ncomposed in code. No samples.", 3.35, 5.42,
     3.2, 0.7, size=10, color=MUTED2, spacing=1.4)

# ---------------------------------------------------------------- 06 DOSSIERS
s = slide()
chrome(s, "05 // ALIEN DOSSIERS", 6)
text(s, "TEN FORMS.\nTEN FULL RECORDS.", 0.62, 1.14, 8.0, 1.4, size=34, font=DISPLAY,
     bold=True, spacing=1.05)
aliens = [("001", "HEATBLAST", "#ff6a2c"), ("002", "FOUR ARMS", "#e0492f"),
          ("003", "XLR8", "#2f9bff"), ("004", "DIAMONDHEAD", "#7ee0c0"),
          ("005", "UPGRADE", "#4dff8f"), ("006", "GHOSTFREAK", "#b48cff"),
          ("007", "RIPJAWS", "#31c9b0"), ("008", "STINKFLY", "#b6d92a"),
          ("009", "WILDMUTT", "#ff8a3d"), ("010", "CANNONBOLT", "#ffc93c")]
for i, (n, name, col) in enumerate(aliens):
    cx = 0.62 + (i % 5) * 2.48
    cy = 2.78 + (i // 5) * 1.95
    rect(s, cx, cy, 2.28, 1.72, PANEL, LINE, 0.6)
    rect(s, cx, cy, 2.28, 0.035, RGBColor.from_string(col[1:]))
    text(s, n, cx + 0.16, cy + 0.16, 0.6, 0.2, size=7, color=MUTED2, font=MONO,
         char_space=1.6)
    text(s, name, cx + 0.16, cy + 0.46, 2.0, 0.3, size=14, color=INK, font=DISPLAY,
         bold=True)
    text(s, "SPECIES · HOME · RADAR · STATS", cx + 0.16, cy + 1.12, 2.0, 0.2,
         size=6, color=MUTED2, font=MONO, char_space=1.0)
    text(s, "8 DATA BLOCKS", cx + 0.16, cy + 1.36, 2.0, 0.2, size=7,
         color=RGBColor.from_string(col[1:]), font=MONO, bold=True, char_space=1.2)
text(s, "Each dossier: portrait holo, 6-axis radar, 6 stat bars, weaknesses, three signature moves, first appearance, related forms, replay control.",
     0.62, 6.78, 12.0, 0.3, size=9.5, color=MUTED2)

# ---------------------------------------------------------------- 07 LAB
s = slide()
chrome(s, "06 // OMNITRIX LAB", 7)
text(s, "TAKE THE\nWATCH APART.", 0.62, 1.14, 5.4, 1.6, size=38, font=DISPLAY, bold=True)
text(s, "Select a form on the left, inspect the device in the middle,\nread the spec sheet on the right.",
     0.68, 2.72, 5.4, 0.8, size=12, color=MUTED, spacing=1.5)
# three columns mock
for i, (label, body) in enumerate([
        ("PLAYLIST", "10 rows · glyph · species"),
        ("DEVICE", "Exploded dial · 4 depth layers"),
        ("SPEC", "Mode · power · risk · status")]):
    x = 0.62 + i * 4.18
    rect(s, x, 3.62, 3.9, 2.88, PANEL, LINE, 0.6)
    text(s, label, x + 0.22, 3.78, 3.4, 0.2, size=7, color=GREEN, font=MONO,
         bold=True, char_space=2.2)
    text(s, body, x + 0.22, 4.04, 3.4, 0.3, size=9, color=MUTED2, spacing=1.4)

# playlist rows
rows_mock = [("HEATBLAST", "PYRONITE", 0.92), ("XLR8", "KINECELERAN", 0.78),
             ("DIAMONDHEAD", "PETROSAPIEN", 0.64), ("GHOSTFREAK", "ECTONURITE", 0.5),
             ("CANNONBOLT", "ARBURIAN", 0.38)]
for i, (nm, sp, w) in enumerate(rows_mock):
    y = 4.52 + i * 0.36
    text(s, nm, 0.84, y, 1.9, 0.2, size=8, color=INK, font=MONO, bold=True)
    text(s, sp, 0.84, y + 0.16, 1.9, 0.16, size=6, color=MUTED2, font=MONO)
    rect(s, 3.05, y + 0.05, 1.2, 0.06, LINE, None)
    rect(s, 3.05, y + 0.05, 1.2 * w, 0.06, GREEN, None)
    if i == 0:
        rect(s, 0.7, y - 0.06, 0.03, 0.34, GREEN, None)

# device layers
omnitrix(s, 8.55, 5.42, 0.72)
for i, layer in enumerate(["GLASS", "CORE", "RING", "BEZEL"]):
    text(s, layer, 9.55, 4.55 + i * 0.3, 1.2, 0.2, size=7, color=MUTED2, font=MONO,
         char_space=1.4)
    line(s, 10.65, 4.62 + i * 0.3, 11.0 - i * 0.12, 4.62 + i * 0.3, GREEN_DIM, 0.8)

# spec rows
specs = [("MODE", "OMNIVERSE"), ("POWER", "8.4 / 10"), ("RISK", "LOW"),
         ("STATUS", "LOCKED"), ("FORMS", "55")]
for i, (k, v) in enumerate(specs):
    y = 4.5 + i * 0.38
    text(s, k, 8.98, y, 1.2, 0.2, size=7, color=MUTED2, font=MONO, char_space=1.4)
    text(s, v, 10.4, y - 0.02, 1.9, 0.22, size=8.5, color=GREEN if i in (0, 3) else INK,
         font=MONO, bold=True, align=PP_ALIGN.RIGHT)
    line(s, 8.98, y + 0.26, 12.3, y + 0.26, LINE, 0.4)
text(s, "MODE TABS:  PROTOTYPE · RECALIBRATED · ULTIMATRIX · OMNIVERSE",
     0.62, 6.72, 9.0, 0.24, size=8, color=MUTED2, font=MONO, char_space=1.6)

# ---------------------------------------------------------------- 08 SEARCH
s = slide()
chrome(s, "07 // UNIVERSAL SEARCH", 8)
text(s, "SPELL IT\nWRONG.\nIT STILL FINDS IT.", 0.62, 1.05, 5.4, 2.4, size=38,
     font=DISPLAY, bold=True, spacing=1.0)
text(s, "Normalise → alias table → token overlap → Levenshtein.\nTwo thresholds: 40 to appear, 55 to suggest.",
     0.68, 4.05, 5.2, 0.9, size=11.5, color=MUTED, spacing=1.5)
pairs = [("forearms", "FOUR ARMS"), ("upgarde", "UPGRADE"),
         ("humongousaur", "HUMUNGOUSAUR"), ("daimondhead", "DIAMONDHEAD"),
         ("zzzz", "404 · SIGNAL LOST")]
for i, (q, r) in enumerate(pairs):
    y = 1.35 + i * 1.02
    rect(s, 6.3, y, 2.55, 0.72, PANEL, LINE, 0.6)
    text(s, q, 6.48, y + 0.22, 2.2, 0.3, size=13, color=MUTED, font=MONO)
    text(s, "→", 9.05, y + 0.16, 0.5, 0.3, size=16,
         color=GREEN if i < 4 else RED, font=BODY, bold=True)
    col = GREEN if i < 4 else RED
    text(s, r, 9.62, y + 0.2, 3.1, 0.3, size=12 if i < 4 else 10.5, color=col,
         font=DISPLAY if i < 4 else MONO, bold=True)
text(s, "Corpus: 55 aliens · 86 entries · factions · worlds · devices", 6.32, 6.62,
     6.4, 0.24, size=8, color=MUTED2, font=MONO)

# ---------------------------------------------------------------- 09 404
s = slide()
chrome(s, "08 // ERROR STATE", 9)
text(s, "404", 7.25, 1.35, 5.8, 3.4, size=200, color=RGBColor(0x0B, 0x12, 0x0A),
     font=DISPLAY, bold=True)
text(s, "ERROR 404 // SAMPLE NOT FOUND", 0.74, 1.42, 5.0, 0.22, size=8,
     color=RED, font=MONO, bold=True, char_space=2.0)
text(s, "SIGNAL\nLOST.", 0.72, 1.78, 6.0, 2.0, size=62, color=INK, font=DISPLAY,
     bold=True, spacing=1.0)
rect(s, 0.78, 4.12, 0.9, 0.03, RED)
text(s, "A themed dead end that still helps: it echoes the failed query,\noffers the three nearest forms, and gives four ways back in.",
     0.78, 4.36, 6.2, 0.9, size=12.5, color=MUTED, spacing=1.5)
for i, label in enumerate(["OPEN ARCHIVE", "RUN SEARCH", "BACK HOME"]):
    x = 0.78 + i * 2.05
    rect(s, x, 5.55, 1.9, 0.5, None, GREEN_DIM, 0.9)
    text(s, label, x, 5.68, 1.9, 0.24, size=7.5, color=GREEN, font=MONO,
         bold=True, align=PP_ALIGN.CENTER, char_space=1.4)
omnitrix(s, 10.15, 3.75, 1.75)
text(s, "ROTATING DEVICE WATERMARK", 8.95, 5.95, 4.0, 0.2, size=7, color=MUTED2,
     font=MONO, align=PP_ALIGN.CENTER, char_space=1.6)

# ---------------------------------------------------------------- 10 ENCYCLOPEDIA
s = slide()
chrome(s, "09 // ENCYCLOPEDIA", 10)
text(s, "THE WHOLE\nUNIVERSE,\nINDEXED.", 0.62, 1.05, 5.6, 2.5, size=40, font=DISPLAY,
     bold=True, spacing=1.0)
text(s, "86 entries across six categories, filterable in real time.\nCharacters, worlds, factions, devices, series, glossary.",
     0.68, 4.12, 5.4, 0.9, size=12, color=MUTED, spacing=1.5)
cats = [("CHARACTERS", 16, 0.5), ("WORLDS", 16, 0.5), ("FACTIONS", 8, 0.25),
        ("DEVICES", 9, 0.28), ("SERIES", 5, 0.16), ("GLOSSARY", 32, 1.0)]
for i, (name, n, frac) in enumerate(cats):
    y = 1.45 + i * 0.82
    text(s, name, 6.9, y, 1.7, 0.22, size=7.5, color=MUTED, font=MONO,
         char_space=1.6)
    rect(s, 8.75, y + 0.02, 3.3, 0.18, LINE, None)
    rect(s, 8.75, y + 0.02, 3.3 * frac, 0.18, GREEN if i % 2 == 0 else GREEN_DIM, None)
    text(s, str(n), 12.2, y - 0.03, 0.6, 0.24, size=10, color=INK, font=MONO,
         bold=True)
text(s, "86", 6.9, 6.35, 2.0, 0.5, size=30, color=GREEN, font=DISPLAY, bold=True)
text(s, "TOTAL ENTRIES", 7.75, 6.5, 2.4, 0.22, size=7, color=MUTED2, font=MONO,
     char_space=1.8)

# ---------------------------------------------------------------- 11 ART
s = slide()
chrome(s, "10 // ART SYSTEM", 11)
text(s, "EVERY PIXEL\nIS ORIGINAL.", 0.62, 1.14, 6.0, 1.6, size=38, font=DISPLAY, bold=True)
text(s, "Official art and audio are off-limits. So the art is hand-authored SVG —\nten portraits plus a detailed device render, all under 7 KB each.",
     0.68, 2.74, 6.0, 0.9, size=12, color=MUTED, spacing=1.5)
facts = [("10", "SVG PORTRAITS", "Species-specific silhouettes, rim light, accent gradients"),
         ("01", "DEVICE RENDER", "800×800 bezel, hourglass, glass, pips, brackets"),
         ("00", "BORROWED ASSETS", "No logos, no frames, no episode audio"),
         ("100%", "SYNTHESISED", "Boot sting built from oscillators + noise")]
for i, (n, t, d) in enumerate(facts):
    y = 1.5 + i * 1.24
    text(s, n, 7.1, y, 1.1, 0.4, size=22, color=GREEN, font=DISPLAY, bold=True)
    text(s, t, 8.35, y + 0.02, 4.3, 0.24, size=9.5, color=INK, font=MONO,
         bold=True, char_space=1.4)
    text(s, d, 8.35, y + 0.34, 4.3, 0.5, size=10, color=MUTED2, spacing=1.4)
    line(s, 7.1, y + 0.94, 12.7, y + 0.94, LINE, 0.4)
text(s, "ART RULES", 0.62, 4.55, 2.0, 0.2, size=7, color=GREEN, font=MONO,
     bold=True, char_space=2.2)
rules = ["600 × 600 viewBox, no raster",
         "Three-stop accent gradients",
         "Single-source rim light",
         "Holo framing + corner ticks",
         "Under 7 KB, gzip-friendly"]
for i, r in enumerate(rules):
    text(s, "—", 0.62, 4.86 + i * 0.3, 0.2, 0.2, size=8, color=GREEN_DIM, font=MONO)
    text(s, r, 0.92, 4.86 + i * 0.3, 4.6, 0.2, size=8.5, color=MUTED2, font=MONO)

# ---------------------------------------------------------------- 12 DESIGN SYSTEM
s = slide()
chrome(s, "11 // DESIGN SYSTEM", 12)
text(s, "DARK, BUT\nLEGIBLE.", 0.62, 1.14, 5.0, 1.6, size=38, font=DISPLAY, bold=True)
swatches = [("#050705", "VOID"), ("#0B0F0A", "PANEL"), ("#A3FF12", "SIGNAL"),
            ("#57C400", "DEEP"), ("#E2493F", "ALERT"), ("#F2F6EE", "INK")]
for i, (hexv, name) in enumerate(swatches):
    x = 0.62 + i * 1.0
    rect(s, x, 3.0, 0.82, 0.82, RGBColor.from_string(hexv[1:]),
         LINE if hexv in ("#050705", "#0B0F0A") else None, 0.7)
    text(s, name, x, 3.94, 0.9, 0.2, size=6.5, color=MUTED2, font=MONO, char_space=1.2)
    text(s, hexv, x, 4.14, 0.9, 0.2, size=6.5, color=MUTED2, font=MONO)
text(s, "AA", 0.62, 4.75, 0.9, 0.3, size=9, color=GREEN, font=MONO, bold=True)
text(s, "BODY TEXT ≥ 4.5:1 CONTRAST · REDUCED-MOTION SUPPORT · FOCUS-VISIBLE",
     1.25, 4.78, 5.6, 0.24, size=7.5, color=MUTED2, font=MONO, char_space=0.8)
# type specimen
text(s, "Aa", 7.0, 1.4, 2.4, 1.4, size=80, color=INK, font=DISPLAY, bold=True)
text(s, "DISPLAY · ARIAL BLACK · UPPERCASE · TIGHT TRACKING", 7.1, 2.62, 5.6, 0.22,
     size=7, color=GREEN, font=MONO, char_space=1.2)
line(s, 7.0, 2.95, 12.7, 2.95, LINE, 0.5)
text(s, "Body copy stays humanist and calm so the data can shout.",
     7.0, 3.12, 5.6, 0.5, size=13, color=MUTED)
text(s, "0123456789 // SPECIMEN 001", 7.0, 3.85, 5.6, 0.3, size=14, color=INK,
     font=MONO)
text(s, "MONO · CONSOLAS · 7–9PX · 0.16–0.24EM TRACKING", 7.0, 4.22, 5.6, 0.22,
     size=7, color=GREEN, font=MONO, char_space=1.2)
line(s, 7.0, 4.55, 12.7, 4.55, LINE, 0.5)
text(s, "GRID 12 · MAX 1320 · 24PX GUTTERS · 1PX HAIRLINES", 7.0, 4.75, 5.6, 0.22,
     size=7.5, color=MUTED2, font=MONO, char_space=1.2)
line(s, 0.62, 5.05, 12.7, 5.05, LINE, 0.5)
text(s, "COMPONENT LANGUAGE", 0.62, 5.2, 3.0, 0.2, size=7, color=GREEN, font=MONO,
     bold=True, char_space=2.0)
# solid button
rect(s, 0.62, 5.55, 2.0, 0.44, GREEN, None)
text(s, "ENTER ARCHIVE", 0.62, 5.67, 2.0, 0.2, size=7.5, color=BG, font=MONO,
     bold=True, align=PP_ALIGN.CENTER, char_space=1.4)
# ghost button
rect(s, 2.75, 5.55, 1.8, 0.44, None, GREEN_DIM, 0.9)
text(s, "INSPECT WATCH", 2.75, 5.67, 1.8, 0.2, size=7.5, color=GREEN, font=MONO,
     bold=True, align=PP_ALIGN.CENTER, char_space=1.2)
# chip
rect(s, 4.7, 5.55, 1.15, 0.3, PANEL, LINE, 0.6)
text(s, "OMNIVERSE", 4.7, 5.62, 1.15, 0.2, size=6.5, color=MUTED, font=MONO,
     align=PP_ALIGN.CENTER, char_space=1.2)
# stat bar
text(s, "PYROKINESIS", 6.1, 5.5, 1.8, 0.2, size=6.5, color=MUTED2, font=MONO,
     char_space=1.2)
rect(s, 6.1, 5.76, 2.4, 0.1, LINE, None)
rect(s, 6.1, 5.76, 2.3, 0.1, GREEN, None)
text(s, "96", 8.6, 5.7, 0.5, 0.2, size=7, color=INK, font=MONO, bold=True)
# card mock
rect(s, 9.35, 5.42, 3.3, 1.05, PANEL, LINE, 0.6)
rect(s, 9.35, 5.42, 3.3, 0.03, GREEN, None)
text(s, "001", 9.5, 5.55, 0.5, 0.18, size=6, color=MUTED2, font=MONO)
text(s, "HEATBLAST", 9.5, 5.74, 2.0, 0.22, size=11, color=INK, font=DISPLAY,
     bold=True)
text(s, "PYRONITE · PYROS", 9.5, 6.06, 2.2, 0.18, size=6, color=MUTED2, font=MONO,
     char_space=1.2)

# ---------------------------------------------------------------- 13 ENGINEERING
s = slide()
chrome(s, "12 // ENGINEERING", 13)
text(s, "ZERO BUILD.\nZERO DEPENDENCIES.", 0.62, 1.14, 7.0, 1.6, size=34, font=DISPLAY,
     bold=True, spacing=1.05)
text(s, "SITE ROOT", 0.68, 2.62, 2.0, 0.2, size=9, color=GREEN, font=MONO, bold=True)
tree = ["index.html", "aliens.html", "omnitrix.html", "encyclopedia.html",
        "universe.html", "search.html", "about.html", "404.html", "aliens/ ×10"]
for i, f in enumerate(tree):
    y = 2.98 + i * 0.38
    text(s, ("├─ " if i < len(tree) - 1 else "└─ ") + f, 0.68, y, 3.2, 0.22,
         size=9, color=MUTED, font=MONO)
mods = [("data.js", "55 aliens · eras · modes · factions · glyphs"),
        ("lore.js", "86 encyclopedia entries"),
        ("app.js", "chrome · warp · search · boot · cursor"),
        ("render.js", "home · archive · dossier renderers"),
        ("render-pages.js", "lab · universe · search · 404 · encyclopedia")]
text(s, "assets/js/", 4.3, 2.95, 2.0, 0.22, size=9, color=GREEN, font=MONO, bold=True)
for i, (f, d) in enumerate(mods):
    y = 3.3 + i * 0.62
    text(s, f, 4.3, y, 2.0, 0.22, size=9.5, color=INK, font=MONO, bold=True)
    text(s, d, 4.3, y + 0.24, 3.6, 0.22, size=8, color=MUTED2, font=MONO)
# right column
text(s, "5 CSS MODULES", 8.55, 2.95, 3.0, 0.22, size=9, color=GREEN, font=MONO,
     bold=True)
css = ["base — tokens, chrome, overlays", "home — hero, dial, cards",
       "pages — heroes, archive, search", "extras — lab, universe, 404, art",
       "responsive — all breakpoints"]
for i, c in enumerate(css):
    text(s, c, 8.55, 3.3 + i * 0.42, 4.2, 0.22, size=8.5, color=MUTED2, font=MONO)
rect(s, 8.55, 5.6, 4.15, 1.0, PANEL, GREEN_DIM, 0.8)
text(s, "node serve.js  →  localhost:4173", 8.78, 5.86, 3.8, 0.24, size=10,
     color=GREEN, font=MONO, bold=True)
text(s, "No install. No bundler. Open the folder and it runs.", 8.78, 6.18, 3.8, 0.24,
     size=8, color=MUTED2, font=MONO)

# ---------------------------------------------------------------- 14 QUALITY
s = slide()
chrome(s, "13 // QUALITY GATE", 14)
text(s, "SHIPPED, NOT\nDEMOED.", 0.62, 1.14, 6.0, 1.6, size=38, font=DISPLAY, bold=True)
checks = [("Routes returning 200", "18 / 18"), ("Console errors", "0"),
          ("Seeded typo queries resolved", "10 / 10"), ("Portraits loading", "10 / 10"),
          ("Encyclopedia entries rendered", "86 / 86"), ("Horizontal overflow @360px", "0 px"),
          ("JS modules passing node --check", "5 / 5")]
for i, (k, v) in enumerate(checks):
    y = 2.95 + i * 0.5
    text(s, "✓", 0.68, y, 0.3, 0.24, size=10, color=GREEN, font=BODY, bold=True)
    text(s, k, 1.05, y, 4.6, 0.24, size=10.5, color=MUTED)
    text(s, v, 5.6, y, 1.3, 0.24, size=10.5, color=INK, font=MONO, bold=True,
         align=PP_ALIGN.RIGHT)
    line(s, 0.68, y + 0.34, 6.9, y + 0.34, LINE, 0.4)
text(s, "PERFORMANCE", 7.7, 1.5, 3.0, 0.22, size=7.5, color=GREEN, font=MONO,
     bold=True, char_space=2.0)
perf = [("First paint", "< 1.5s"), ("SVG art per portrait", "< 7 KB"),
        ("Search corpus", "~150 entries"), ("Matcher latency", "< 1 ms"),
        ("External requests", "0")]
for i, (k, v) in enumerate(perf):
    y = 1.9 + i * 0.66
    text(s, k, 7.7, y, 3.0, 0.24, size=10, color=MUTED2)
    text(s, v, 10.6, y, 2.1, 0.24, size=10, color=INK, font=MONO, bold=True,
         align=PP_ALIGN.RIGHT)
    line(s, 7.7, y + 0.4, 12.7, y + 0.4, LINE, 0.4)
rect(s, 7.7, 5.5, 5.0, 1.15, PANEL, LINE, 0.7)
text(s, "VERIFIED IN-BROWSER", 7.95, 5.72, 4.5, 0.22, size=7, color=GREEN,
     font=MONO, bold=True, char_space=1.8)
text(s, "DOM assertions on every route + manual visual pass", 7.95, 6.02, 4.5, 0.24,
     size=9, color=MUTED2, font=MONO)

# ---------------------------------------------------------------- 15 ROADMAP
s = slide()
chrome(s, "14 // WHAT'S NEXT", 15)
text(s, "THE PLAYLIST\nISN'T FULL.", 0.62, 1.14, 6.0, 1.6, size=38, font=DISPLAY, bold=True)
road = [("01", "EPISODE GUIDE", "200+ episodes, filtered by era, mapped to debuts"),
        ("02", "PLAYLIST BUILDER", "Pick ten, persist locally, share by URL hash"),
        ("03", "ULTIMATE FORMS", "Second dossier tier with evolved artwork"),
        ("04", "TIMELINE SCRUBBER", "Drag across eras, watch the watch change"),
        ("05", "AUDIO SUITE", "Per-alien stings, muteable by category"),
        ("06", "CMS BRIDGE", "Optional JSON export for no-code editing")]
for i, (n, t, d) in enumerate(road):
    col = i % 2
    row = i // 2
    x = 0.62 + col * 3.55
    y = 3.0 + row * 1.25
    text(s, n, x, y, 0.5, 0.22, size=8, color=GREEN, font=MONO, bold=True)
    text(s, t, x + 0.55, y - 0.04, 2.8, 0.26, size=11.5, color=INK, font=DISPLAY,
         bold=True)
    text(s, d, x + 0.55, y + 0.3, 2.85, 0.6, size=9, color=MUTED2, spacing=1.35)
line(s, 0.62, 2.72, 12.7, 2.72, LINE, 0.5)
line(s, 0.62, 6.1, 12.7, 6.1, LINE, 0.5)
text(s, "SHIP ORDER", 0.62, 6.26, 1.4, 0.2, size=7, color=GREEN, font=MONO,
     bold=True, char_space=2.0)
text(s, "EPISODE GUIDE  →  PLAYLIST BUILDER  →  ULTIMATE FORMS  →  SCRUBBER",
     2.05, 6.26, 8.0, 0.2, size=7.5, color=MUTED2, font=MONO, char_space=1.0)
text(s, "v1.1", 11.6, 6.2, 1.1, 0.24, size=9, color=GREEN, font=MONO, bold=True,
     align=PP_ALIGN.RIGHT)

# ---------------------------------------------------------------- 16 CLOSE
s = slide()
omnitrix(s, 10.6, 3.7, 2.2)
text(s, "IT'S\nHERO TIME.", 0.72, 1.6, 7.4, 2.6, size=76, color=INK, font=DISPLAY,
     bold=True, spacing=1.0)
rect(s, 0.78, 4.5, 1.9, 0.045, GREEN)
text(s, "BEN 10 // OMNIVERSE PROTOCOL", 0.78, 4.78, 7.0, 0.3, size=11, color=GREEN,
     font=MONO, bold=True, char_space=2.4)
text(s, "node serve.js  ·  localhost:4173  ·  no install", 0.78, 5.18, 7.0, 0.3,
     size=11, color=MUTED, font=MONO)
text(s, "Fan-made and non-commercial. Ben 10 and related characters are property of\nCartoon Network / Warner Bros. Discovery. All art, code and audio here are original.",
     0.78, 6.25, 7.6, 0.7, size=7.5, color=MUTED2, spacing=1.5)

prs.save(str(OUT))
print("saved", OUT, OUT.stat().st_size, "bytes", len(prs.slides.__iter__.__self__._sldIdLst), "slides")
