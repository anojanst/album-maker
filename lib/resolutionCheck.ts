import type { PhotoState, PrintSize, Orientation } from "@/types/album";

export function checkResolution(
  photo: PhotoState,
  size: PrintSize,
  orientation: Orientation
): string | null {
  const exportW = orientation === "portrait" ? size.px.h : size.px.w;
  const exportH = orientation === "portrait" ? size.px.w : size.px.h;

  // Account for 90°/270° rotations where width and height are swapped
  const rot = ((photo.rotation % 360) + 360) % 360;
  const swapped = rot === 90 || rot === 270;
  const photoW = swapped ? photo.naturalHeight : photo.naturalWidth;
  const photoH = swapped ? photo.naturalWidth : photo.naturalHeight;

  if (photoW < exportW || photoH < exportH) {
    return (
      `This photo (${photoW}×${photoH}px) may print blurry at ${size.label} — ` +
      `the print requires ${exportW}×${exportH}px at 300 DPI.`
    );
  }

  return null;
}
