"""Generate responsive AVIF/WebP variants for the large PNG product diagrams.

    python scripts/optimise-images.py

Dev-time tool (Pillow >= 11 with AVIF support); outputs are committed under public/media. The original
PNGs stay in place as the <img> fallback. Diagrams contain small readable text, so variants are
high-quality (AVIF q=70, WebP q=90) and widths never drop below 640 px.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "media"
SOURCES = [
    ROOT / "ai-governance" / "nova-ai-governance-human-review-workflow.png",
    ROOT / "evidence-automation" / "nova-evidence-automation-human-review-workflow.png",
    ROOT / "integrations" / "nova-integrations-connectors-evidence-workflow.png",
]
WIDTHS = [640, 960, 1280, 1672]

for src in SOURCES:
    with Image.open(src) as im:
        im = im.convert("RGB")
        for width in WIDTHS:
            if width > im.width:
                continue
            height = round(im.height * width / im.width)
            resized = im if width == im.width else im.resize((width, height), Image.LANCZOS)
            resized.save(src.with_name(f"{src.stem}-{width}.avif"), "AVIF", quality=70, speed=4)
            resized.save(src.with_name(f"{src.stem}-{width}.webp"), "WEBP", quality=90, method=6)
        print("generated variants for", src.name)

# Audience photos are displayed at <= 25vw (full width on phones): add 480/960 px WebP variants; the 1448 px original stays as the fallback.
for src in sorted((ROOT / "audience").glob("nova-*.webp")):
    if src.stem.rsplit("-", 1)[-1].isdigit():
        continue
    with Image.open(src) as im:
        im = im.convert("RGB")
        for width in (480, 960):
            height = round(im.height * width / im.width)
            im.resize((width, height), Image.LANCZOS).save(src.with_name(f"{src.stem}-{width}.webp"), "WEBP", quality=80, method=6)
    print("generated variants for", src.name)

# Framework logos render at 72 px; three were shipped at 1254 px (~1 MB each). Match the other five (320 px, alpha kept).
for src in sorted((ROOT / "frameworks").glob("*.png")):
    with Image.open(src) as im:
        if im.width <= 320:
            continue
        im.convert("RGBA").resize((320, 320), Image.LANCZOS).save(src, "PNG", optimize=True)
    print("downscaled", src.name)
