#!/usr/bin/env python3
"""Replace Unicode 11–15 emoji that render as empty rectangles on many devices."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", "node_modules", "dist", "build", ".next", "coverage"}
SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".md", ".json"}

# Whole ZWJ sequences first so we do not leave broken combiners.
SEQUENCES = {
    "🧑‍🚀": "🚀",
    "👩‍🚀": "🚀",
    "👨‍🚀": "🚀",
    "🦸‍♀️": "⭐",
    "🦸‍♂️": "⭐",
    "🐻‍❄️": "🐻",
    "👩‍🌾": "🐮",
    "👨‍🌾": "🐮",
}

# Single-codepoint swaps. Keep 🧸 (app mascot).
CHARS = {
    "🪵": "🌳",
    "🪟": "🏠",
    "🪑": "💺",
    "🪨": "⛰️",
    "🫧": "💧",
    "🪜": "🏡",
    "🪙": "💰",
    "🪢": "➰",
    "🪣": "🥄",
    "🪴": "🌱",
    "🫖": "☕",
    "🫙": "🍯",
    "🪁": "🎈",
    "🪐": "🌍",
    "🪸": "🌊",
    "🪲": "🐛",
    "🪶": "🐔",
    "🪺": "🐦",
    "🛞": "🚗",
    "🩷": "💗",
    "🪪": "🎫",
    "🪥": "😁",
    "🪱": "🐛",
    "🪧": "📌",
    "🪭": "🌸",
    "🪞": "✨",
    "🪡": "🎀",
    "🪝": "⚓",
    "🪄": "✨",
    "🪈": "🎵",
    "🪖": "🎩",
    "🪂": "🎈",
    "🪀": "🎾",
    "🩳": "👖",
    "🩴": "👟",
    "🩱": "👙",
    "🪼": "🐙",
    "🪿": "🦆",
    "🫒": "🍇",
    "🫘": "🌰",
    "🫛": "🌽",
    "🫶": "💛",
    "🪰": "🐝",
    "🪷": "🌸",
    "🪹": "🐦",
    "🪻": "🌸",
    "🪽": "🕊️",
    "🫐": "🍇",
    "🫕": "🍲",
    "🪮": "💇",
    "🦭": "🐬",
    "🦥": "🐨",
    "🦦": "🐿️",
    "🧅": "🥔",
    "🧍": "🚶",
    "🧗": "⛰️",
    "🧙": "🎩",
    "🧮": "🔢",
    "🛝": "🎠",
    "🛗": "🏢",
    "🛟": "⭕",
    "🛖": "🏠",
    "🟡": "💛",
    "🟢": "💚",
    "🟣": "💜",
    "🟠": "🔶",
    "🟤": "📦",
    "🟦": "📘",
    "🟥": "📕",
    "🟩": "📗",
    "🟪": "💜",
    "🟫": "📦",
    "🤍": "⚪",
    "🧊": "❄️",
    "🧁": "🍰",
    "🧦": "👟",
    "🧤": "👋",
    "🧥": "👕",
    "🧳": "🎒",
    "🧻": "📄",
    "🧼": "🛁",
    "🧽": "🛁",
    "🧹": "🗑️",
    "🧯": "🚒",
    "🧰": "🔧",
    "🧴": "🛁",
    "🧭": "🗺️",
    "🧪": "⚗️",
    "🧲": "🔗",
    "🧢": "🎩",
    "🧣": "🎀",
    "🥾": "👢",
    "🥽": "👓",
    "🦶": "👟",
    "🦵": "👢",
    "🦷": "😁",
    "🦴": "🍖",
    "🦸": "⭐",
    "🧃": "🥤",
    "🧈": "🍞",
    "🧂": "🍚",
    "🧠": "💭",
    "🧒": "👧",
    "🧑": "👤",
    "🧘": "😌",
    "🧩": "🎲",
    "🧱": "🏠",
    "🧺": "👜",
    "🧵": "🎀",
    "🧶": "🎀",
    "🦺": "👷",
    "🧾": "📄",
    "🫀": "🎯",
    "🫘": "🌰",
}


def should_skip(path: Path) -> bool:
    return any(part in SKIP_DIRS for part in path.parts)


def main() -> None:
    changed = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or should_skip(path):
            continue
        if path.suffix not in SUFFIXES:
            continue
        if path.resolve() == Path(__file__).resolve():
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        orig = text
        for a, b in SEQUENCES.items():
            text = text.replace(a, b)
        for a, b in CHARS.items():
            text = text.replace(a, b)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))
    print(f"updated {len(changed)} files")
    for name in changed:
        print(name)


if __name__ == "__main__":
    main()
