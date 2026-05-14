import type { BorderState } from "@/types/album";

export function effectiveSides(border: BorderState) {
  if (border.mode === "uniform") {
    const v = border.uniform;
    return { top: v, right: v, bottom: v, left: v };
  }
  return {
    top: border.top,
    right: border.right,
    bottom: border.bottom,
    left: border.left,
  };
}
