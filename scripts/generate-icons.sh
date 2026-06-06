#!/usr/bin/env bash
#
# Generate all platform icons from a single 1024x1024 master PNG.
#   Windows -> build/icon.ico   (multi-size: 16/32/48/64/128/256)
#   macOS   -> build/icon.icns
#   Linux   -> build/icon.png   (512x512)
#   Window/taskbar icon (dev + linux) -> resources/icon.png (512x512)
#
# Usage:  npm run icons              # uses build/icon-source.png
#         npm run icons path/to.png  # explicit master
#
# Requires: ImageMagick (magick/convert). macOS .icns also needs iconutil.
set -euo pipefail

SRC="${1:-build/icon-source.png}"
OUT="build"

if [[ ! -f "$SRC" ]]; then
  echo "❌ 마스터 이미지를 찾을 수 없습니다: $SRC"
  echo "   1024x1024 PNG 파일을 '$SRC' 위치에 두거나, 경로를 인자로 넘기세요."
  echo "   예) npm run icons ~/Downloads/wildboar-icon.png"
  exit 1
fi

# Resolve ImageMagick binary (v7 = magick, v6 = convert)
if command -v magick >/dev/null 2>&1; then IM="magick"; else IM="convert"; fi

mkdir -p "$OUT"

echo "▶ 소스: $SRC"

# --- Windows .ico (embeds multiple sizes) ---
"$IM" "$SRC" -background none -define icon:auto-resize=256,128,64,48,32,16 "$OUT/icon.ico"
echo "✓ $OUT/icon.ico (Windows)"

# --- Linux .png + window/taskbar icon ---
"$IM" "$SRC" -resize 512x512 "$OUT/icon.png"
"$IM" "$SRC" -resize 512x512 resources/icon.png
echo "✓ $OUT/icon.png + resources/icon.png (Linux / window)"

# --- macOS .icns (needs iconutil, macOS only) ---
if command -v iconutil >/dev/null 2>&1; then
  ICONSET="$OUT/icon.iconset"
  rm -rf "$ICONSET"; mkdir -p "$ICONSET"
  for s in 16 32 128 256 512; do
    "$IM" "$SRC" -resize "${s}x${s}"     "$ICONSET/icon_${s}x${s}.png"
    "$IM" "$SRC" -resize "$((s*2))x$((s*2))" "$ICONSET/icon_${s}x${s}@2x.png"
  done
  iconutil -c icns "$ICONSET" -o "$OUT/icon.icns"
  rm -rf "$ICONSET"
  echo "✓ $OUT/icon.icns (macOS)"
else
  echo "⚠ iconutil 없음 — .icns 건너뜀 (macOS에서 실행하면 생성됩니다)"
fi

echo "✅ 아이콘 생성 완료. 이제 'npm run build:win' 으로 빌드하세요."
