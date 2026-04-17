from __future__ import annotations

from pathlib import Path

from PIL import Image


BASE_DIR = Path(r"C:\Users\Timo\Desktop\SafeDiveCard\project\references\Iconset")
TARGET_SIZE = 256
CONTENT_BOX = 192
SKIP_PREFIXES = ("Vorlagen-",)


def should_skip(path: Path) -> bool:
    return path.name.startswith(SKIP_PREFIXES)


def normalize_icon(path: Path) -> None:
    with Image.open(path).convert("RGBA") as source:
        bbox = source.getbbox()
        if bbox is None:
            canvas = Image.new("RGBA", (TARGET_SIZE, TARGET_SIZE), (0, 0, 0, 0))
            canvas.save(path)
            return

        cropped = source.crop(bbox)
        width, height = cropped.size
        scale = min(CONTENT_BOX / width, CONTENT_BOX / height)
        resized = cropped.resize(
            (max(1, round(width * scale)), max(1, round(height * scale))),
            Image.Resampling.LANCZOS,
        )

        canvas = Image.new("RGBA", (TARGET_SIZE, TARGET_SIZE), (0, 0, 0, 0))
        x = (TARGET_SIZE - resized.width) // 2
        y = (TARGET_SIZE - resized.height) // 2
        canvas.alpha_composite(resized, (x, y))
        canvas.save(path)


def main() -> None:
    for path in sorted(BASE_DIR.glob("*.png")):
        if should_skip(path):
            continue
        normalize_icon(path)
        print(f"normalized\t{path.name}")


if __name__ == "__main__":
    main()
