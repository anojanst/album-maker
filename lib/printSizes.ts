import type { PrintSize } from "@/types/album";

export const PRINT_SIZES: PrintSize[] = [
  { id: "4x6",  label: '4×6"',    mm: { w: 152, h: 102 }, px: { w: 1800, h: 1200 } },
  { id: "5x7",  label: '5×7"',    mm: { w: 178, h: 127 }, px: { w: 2100, h: 1500 } },
  { id: "6x8",  label: '6×8"',    mm: { w: 203, h: 152 }, px: { w: 2400, h: 1800 } },
  { id: "A4",   label: "A4",      mm: { w: 297, h: 210 }, px: { w: 3508, h: 2480 } },
  { id: "A5",   label: "A5",      mm: { w: 210, h: 148 }, px: { w: 2480, h: 1748 } },
  { id: "sq10", label: "10×10cm", mm: { w: 100, h: 100 }, px: { w: 1181, h: 1181 } },
  { id: "sq15", label: "15×15cm", mm: { w: 150, h: 150 }, px: { w: 1772, h: 1772 } },
];
