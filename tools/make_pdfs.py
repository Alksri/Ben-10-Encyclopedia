"""Render the PRD and implementation plan markdown into branded PDFs."""
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, NextPageTemplate,
)

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

BG = colors.HexColor("#050705")
PANEL = colors.HexColor("#0b0f0a")
GREEN = colors.HexColor("#7fd400")
GREEN_BRIGHT = colors.HexColor("#a3ff12")
INK = colors.HexColor("#12160f")
MUTED = colors.HexColor("#5d6657")
LINE = colors.HexColor("#d8ddd2")
RED = colors.HexColor("#c8402f")


def esc(text):
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"`([^`]+)`", r'<font face="Courier" color="#2f6f00">\1</font>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    return text


class Doc(BaseDocTemplate):
    def __init__(self, path, title, subtitle, **kw):
        super().__init__(path, pagesize=A4,
                         leftMargin=20 * mm, rightMargin=18 * mm,
                         topMargin=24 * mm, bottomMargin=18 * mm,
                         title=title, author="Omniverse Protocol", **kw)
        self.doc_title = title
        self.subtitle = subtitle
        frame = Frame(self.leftMargin, self.bottomMargin,
                      self.width, self.height, id="body")
        cover_frame = Frame(0, 0, A4[0], A4[1], id="cover")
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[cover_frame], onPage=self.draw_cover),
            PageTemplate(id="body", frames=[frame], onPage=self.draw_chrome),
        ])
        self.page_no = 0

    def draw_cover(self, canv, doc):
        w, h = A4
        canv.saveState()
        canv.setFillColor(BG)
        canv.rect(0, 0, w, h, stroke=0, fill=1)
        # glow
        for r, a in ((260, 0.05), (190, 0.06), (120, 0.07)):
            canv.setFillColor(colors.Color(0.64, 1, 0.07, alpha=a))
            canv.circle(w * 0.78, h * 0.78, r, stroke=0, fill=1)
        # grid
        canv.setStrokeColor(colors.Color(0.64, 1, 0.07, alpha=0.07))
        canv.setLineWidth(0.4)
        for x in range(0, int(w), 22):
            canv.line(x, 0, x, h)
        for y in range(0, int(h), 22):
            canv.line(0, y, w, y)
        # corner brackets
        canv.setStrokeColor(GREEN)
        canv.setLineWidth(1.2)
        m, s = 16 * mm, 12 * mm
        for cx, cy, dx, dy in ((m, h - m, 1, -1), (w - m, h - m, -1, -1),
                               (m, m, 1, 1), (w - m, m, -1, 1)):
            canv.line(cx, cy, cx + s * dx, cy)
            canv.line(cx, cy, cx, cy + s * dy)
        # eyebrow
        canv.setFillColor(GREEN_BRIGHT)
        canv.setFont("Helvetica-Bold", 8)
        canv.drawString(m, h - 44 * mm, "O M N I V E R S E   P R O T O C O L   / /   D O C S")
        # title
        canv.setFillColor(colors.white)
        canv.setFont("Helvetica-Bold", 40)
        y = h - 66 * mm
        for line in self.doc_title.split("\n"):
            canv.drawString(m, y, line)
            y -= 15 * mm
        # rule
        canv.setFillColor(GREEN)
        canv.rect(m, y + 4 * mm, 46 * mm, 1.6 * mm, stroke=0, fill=1)
        # subtitle
        canv.setFillColor(colors.HexColor("#b9c4ae"))
        canv.setFont("Helvetica", 13)
        y -= 12 * mm
        for line in self.subtitle.split("\n"):
            canv.drawString(m, y, line)
            y -= 7 * mm
        # meta block
        canv.setStrokeColor(colors.Color(1, 1, 1, alpha=0.12))
        canv.setLineWidth(0.6)
        canv.rect(m, 30 * mm, w - 2 * m, 22 * mm, stroke=1, fill=0)
        canv.setFillColor(colors.HexColor("#7d8874"))
        canv.setFont("Helvetica", 7.5)
        canv.drawString(m + 6 * mm, 44 * mm, "FAN-MADE  ·  NON-COMMERCIAL  ·  ORIGINAL ART & AUDIO")
        canv.drawString(m + 6 * mm, 38 * mm, "BUILD v1.0  ·  NOVEMBER 2026  ·  ZERO DEPENDENCIES")
        canv.setFillColor(GREEN)
        canv.setFont("Helvetica-Bold", 7.5)
        canv.drawRightString(w - m - 6 * mm, 38 * mm, "LOCALHOST:4173")
        canv.restoreState()

    def draw_chrome(self, canv, doc):
        w, h = A4
        canv.saveState()
        canv.setFillColor(colors.white)
        canv.rect(0, 0, w, h, stroke=0, fill=1)
        # top rule
        canv.setFillColor(GREEN)
        canv.rect(0, h - 12 * mm, w, 1.1 * mm, stroke=0, fill=1)
        canv.setFillColor(colors.HexColor("#7d8874"))
        canv.setFont("Helvetica", 7)
        canv.drawString(20 * mm, h - 9 * mm,
                        "BEN 10 // OMNIVERSE PROTOCOL")
        canv.drawRightString(w - 18 * mm, h - 9 * mm, self.doc_title.replace("\n", " "))
        # footer
        canv.setStrokeColor(LINE)
        canv.setLineWidth(0.4)
        canv.line(20 * mm, 13 * mm, w - 18 * mm, 13 * mm)
        canv.setFillColor(colors.HexColor("#8d9686"))
        canv.setFont("Helvetica", 7)
        canv.drawString(20 * mm, 9 * mm, "Original fan project · no official assets")
        canv.drawRightString(w - 18 * mm, 9 * mm, f"{doc.page - 1:02d}")
        canv.restoreState()


def styles():
    ss = getSampleStyleSheet()
    base = dict(fontName="Helvetica", textColor=INK, alignment=TA_LEFT)
    return {
        "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=19, leading=23,
                             textColor=INK, spaceBefore=6, spaceAfter=8),
        "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13.5, leading=17,
                             textColor=colors.HexColor("#2c3a22"), spaceBefore=14,
                             spaceAfter=5),
        "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11, leading=14,
                             textColor=GREEN, spaceBefore=10, spaceAfter=4),
        "p": ParagraphStyle("p", fontName="Helvetica", fontSize=9.4, leading=14.4,
                            textColor=colors.HexColor("#242a20"), spaceAfter=6),
        "li": ParagraphStyle("li", fontName="Helvetica", fontSize=9.4, leading=14,
                             textColor=colors.HexColor("#242a20"), leftIndent=12,
                             bulletIndent=2, spaceAfter=2.5),
        "quote": ParagraphStyle("quote", fontName="Helvetica-Oblique", fontSize=10.5,
                                leading=16, textColor=colors.HexColor("#3a4432"),
                                leftIndent=12, rightIndent=12, spaceBefore=4,
                                spaceAfter=8, borderColor=GREEN, borderWidth=0,
                                backColor=colors.HexColor("#f3f7ee"),
                                borderPadding=8),
        "code": ParagraphStyle("code", fontName="Courier", fontSize=8.2, leading=11.5,
                               textColor=colors.HexColor("#1d2b14"),
                               backColor=colors.HexColor("#f2f5ee"),
                               borderPadding=7, spaceBefore=3, spaceAfter=8,
                               leftIndent=6, rightIndent=6),
        "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=8.2, leading=11,
                               textColor=colors.HexColor("#242a20")),
        "cellh": ParagraphStyle("cellh", fontName="Helvetica-Bold", fontSize=7.6,
                                leading=10, textColor=colors.white),
    }


def parse(md):
    lines = md.split("\n")
    out = []
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()
        if not line.strip():
            i += 1
            continue
        if line.startswith("```"):
            i += 1
            block = []
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(lines[i].rstrip())
                i += 1
            i += 1
            out.append(("code", "\n".join(block)))
            continue
        if line.startswith("# "):
            out.append(("h1", line[2:].strip()))
            i += 1
            continue
        if line.startswith("## "):
            out.append(("h2", line[3:].strip()))
            i += 1
            continue
        if line.startswith("### "):
            out.append(("h3", line[4:].strip()))
            i += 1
            continue
        if line.strip() == "---":
            out.append(("rule", ""))
            i += 1
            continue
        if line.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].startswith(">"):
                buf.append(lines[i].lstrip(">").strip())
                i += 1
            out.append(("quote", " ".join(buf)))
            continue
        if line.lstrip().startswith("|"):
            rows = []
            while i < len(lines) and lines[i].lstrip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
                    rows.append(cells)
                i += 1
            out.append(("table", rows))
            continue
        m = re.match(r"^(\s*)[-*]\s+(.*)$", line)
        if m:
            items = []
            while i < len(lines):
                mm_ = re.match(r"^(\s*)[-*]\s+(.*)$", lines[i])
                if not mm_:
                    break
                txt = mm_.group(2)
                if txt.startswith("[x]") or txt.startswith("[X]"):
                    txt = "✓ " + txt[3:].strip()
                elif txt.startswith("[ ]"):
                    txt = "○ " + txt[3:].strip()
                items.append((len(mm_.group(1)), txt))
                i += 1
            out.append(("list", items))
            continue
        m = re.match(r"^(\d+)\.\s+(.*)$", line)
        if m:
            items = []
            while i < len(lines):
                mm_ = re.match(r"^(\d+)\.\s+(.*)$", lines[i])
                if not mm_:
                    break
                items.append((int(mm_.group(1)), mm_.group(2)))
                i += 1
            out.append(("olist", items))
            continue
        buf = [line.strip()]
        i += 1
        while i < len(lines):
            nxt = lines[i]
            if (not nxt.strip() or nxt.startswith("#") or nxt.startswith("|")
                    or nxt.startswith(">") or nxt.startswith("```")
                    or re.match(r"^\s*[-*]\s+", nxt) or re.match(r"^\d+\.\s+", nxt)
                    or nxt.strip() == "---"):
                break
            buf.append(nxt.strip())
            i += 1
        out.append(("p", " ".join(buf)))
    return out


def build(md_path, pdf_path, title, subtitle):
    st = styles()
    doc = Doc(str(pdf_path), title, subtitle)
    story = [NextPageTemplate("body"), PageBreak()]
    blocks = parse(md_path.read_text(encoding="utf-8"))
    start = 0
    for idx, (kind, val) in enumerate(blocks):
        if kind == "h2":
            start = idx
            break
    body = blocks[start:]

    for kind, val in body:
        if kind == "h1":
            story.append(Paragraph(esc(val), st["h1"]))
        elif kind == "h2":
            story.append(Spacer(1, 3))
            story.append(Paragraph(esc(val).upper(), st["h2"]))
            story.append(Table([[""]], colWidths=[doc.width], rowHeights=[1.2],
                               style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), GREEN)])))
            story.append(Spacer(1, 4))
        elif kind == "h3":
            story.append(Paragraph(esc(val), st["h3"]))
        elif kind == "p":
            story.append(Paragraph(esc(val), st["p"]))
        elif kind == "quote":
            story.append(Paragraph(esc(val), st["quote"]))
        elif kind == "code":
            safe = esc(val).replace("\n", "<br/>").replace("  ", "&nbsp;&nbsp;")
            story.append(Paragraph(safe, st["code"]))
        elif kind == "rule":
            story.append(Spacer(1, 5))
        elif kind == "list":
            for _, txt in val:
                story.append(Paragraph(esc(txt), st["li"], bulletText="•"))
            story.append(Spacer(1, 3))
        elif kind == "olist":
            for n, txt in val:
                story.append(Paragraph(esc(txt), st["li"], bulletText=f"{n}."))
            story.append(Spacer(1, 3))
        elif kind == "table":
            rows = val
            if not rows:
                continue
            ncols = max(len(r) for r in rows)
            data = []
            for ri, r in enumerate(rows):
                r = r + [""] * (ncols - len(r))
                style = st["cellh"] if ri == 0 else st["cell"]
                data.append([Paragraph(esc(c), style) for c in r])
            widths = [doc.width / ncols] * ncols
            t = Table(data, colWidths=widths, repeatRows=1)
            t.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1d2b14")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1),
                 [colors.white, colors.HexColor("#f7f9f4")]),
            ]))
            story.append(Spacer(1, 3))
            story.append(t)
            story.append(Spacer(1, 7))

    doc.build(story)
    return pdf_path


if __name__ == "__main__":
    DOCS.mkdir(exist_ok=True)
    jobs = [
        ("PRD.md", "PRD.pdf", "PRODUCT\nREQUIREMENTS", "Ben 10 // Omniverse Protocol\nA cinematic fan archive of the entire universe"),
        ("IMPLEMENTATION_PLAN.md", "IMPLEMENTATION_PLAN.pdf", "IMPLEMENTATION\nPLAN", "Seven phases, zero dependencies\nHow the Omniverse Protocol was built"),
    ]
    for src, out, title, sub in jobs:
        p = build(DOCS / src, DOCS / out, title, sub)
        print("wrote", p, p.stat().st_size, "bytes")
