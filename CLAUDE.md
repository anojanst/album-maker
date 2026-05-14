# Photo Album Maker

## What this is
A browser-only, print-ready photo layout tool. Users upload photos from
their phone, choose a print size and orientation, adjust each photo
(zoom, pan, rotate, optional border), then download print-ready PNGs or
a combined PDF. No photos are ever sent to a server.

## Tech stack
- Next.js (App Router), TypeScript, Tailwind CSS
- react-konva + konva for canvas-based photo editing
- pdf-lib for multi-page PDF export
- react-dropzone for drag-and-drop upload
- file-saver for triggering downloads
- shadcn/ui for UI components

## Architecture
- Single page (app/page.tsx), three-step linear flow:
  Step 1 — Upload photos
  Step 2 — Choose print size + orientation
  Step 3 — Adjust each photo, then download
- Step state managed in page.tsx with useState, passed as props
- All photo processing is strictly client-side (no server actions for images)
- Preview canvas: ~600px wide, aspect ratio matches chosen print size
- Export canvas: offscreen OffscreenCanvas at full 300 DPI resolution
- Zoom/pan/rotate values are unitless numbers applied to both canvases

## Print sizes (lib/printSizes.ts)
| id     | label    | mm          | px at 300dpi  |
|--------|----------|-------------|---------------|
| 4x6    | 4×6"     | 152 × 102   | 1800 × 1200   |
| 5x7    | 5×7"     | 178 × 127   | 2100 × 1500   |
| 6x8    | 6×8"     | 203 × 152   | 2400 × 1800   |
| A4     | A4       | 297 × 210   | 3508 × 2480   |
| A5     | A5       | 210 × 148   | 2480 × 1748   |
| sq10   | 10×10cm  | 100 × 100   | 1181 × 1181   |
| sq15   | 15×15cm  | 150 × 150   | 1772 × 1772   |
Orientation (portrait/landscape) flips width and height at export time.

## Types (types/album.ts)
- PrintSize: id, label, mm, px
- Orientation: "portrait" | "landscape"
- PhotoState: id, file (File object), objectUrl, zoom, panX, panY,
  rotation, borderWidth, borderColor
- AlbumConfig: printSizeId, orientation

## Folder structure
app/
  page.tsx           ← step controller, top-level state
  layout.tsx
components/
  Uploader.tsx       ← react-dropzone, accepts image/*, shows thumbnails
  FormatPicker.tsx   ← print size grid + orientation toggle
  PhotoEditor.tsx    ← Konva stage, per-photo zoom/pan/rotate/border
  PhotoStrip.tsx     ← horizontal thumbnail strip, click to navigate
  RiskWarning.tsx    ← modal shown before download
  TermsModal.tsx     ← T&C modal, checkbox acknowledgement
lib/
  printSizes.ts      ← PRINT_SIZES array
  canvasExport.ts    ← exportPhoto() and exportAllAsPdf() functions
  resolutionCheck.ts ← returns warning string if photo too low-res
types/
  album.ts

## Rules — always follow these
- Never handle photo data in server components or server actions
- Revoke object URLs on component unmount (URL.revokeObjectURL)
- Resolution check: if photo natural px < export px in either dimension, warn
- T&Cs checkbox must be ticked before the first download is allowed
- Show RiskWarning modal on every download (not just the first)
- Export filenames: photo-01.png, photo-02.png etc. PDF: album.pdf
- All sizes and labels use metric (mm) in the UI for NZ/international users
- Keep components under 200 lines — split if longer

## UI design system

### Brand
- App name: Printfolio
- Logo: 28×28px dark navy square (bg #0C447C), border-radius 8px, white
  camera icon centred inside. Followed by wordmark "printfolio" weight 500
  + ".app" in muted weight 400. Letter-spacing -0.01em on wordmark.

### Colour palette
Use these exact values — do not substitute Tailwind defaults.

| Token         | Value   | Usage                              |
|---------------|---------|------------------------------------|
| navy-900      | #042C53 | hover on primary button            |
| navy-800      | #0C447C | primary button bg, selected border |
| navy-600      | #185FA5 | links, hover on primary button     |
| navy-200      | #85B7EB | selected icon bg border            |
| navy-100      | #B5D4F4 | selected card/icon bg              |
| navy-50       | #E6F1FB | selected card fill, upload hover   |
| teal-600      | #0F6E56 | download button bg (completion)    |
| teal-400      | #1D9E75 | download button hover              |
| amber warnings| CSS var | use --color-background-warning /   |
|               |         | --color-border-warning /           |
|               |         | --color-text-warning throughout    |

All other surfaces use CSS variables only:
--color-background-primary / -secondary / -tertiary
--color-border-tertiary (default) / -secondary (hover) / -primary (active)
--color-text-primary / -secondary / -tertiary

### Typography
- Font: system font stack via --font-sans
- Headings: font-weight 500, letter-spacing -0.02em
- Screen title: 18px / 500 / tracking -0.02em
- Section sublabel: 11px / 400 / tracking 0.06em / uppercase /
  --color-text-tertiary. Used above format grid and orientation row.
- Body / labels: 13px / 400 / --color-text-secondary
- Small hints: 12px / 400 / --color-text-tertiary
- Two weights only: 400 and 500. Never 600 or 700.

### Spacing & shape
- App container: border-radius 16px, border 0.5px --color-border-tertiary
- Cards (format, download option): border-radius 10px
- Buttons (ghost, tool): border-radius 8px
- Primary button: border-radius 8px
- Tool blocks (rotate/zoom/border panels): border-radius 10px,
  background --color-background-secondary, padding 12px 14px
- Upload zone: border-radius 12px, 1px dashed border
- Canvas background: border-radius 12px, --color-background-secondary
- Photo strip thumbnails: border-radius 7px, 50×50px,
  active state border 2px solid #0C447C
- All non-featured borders: 0.5px solid --color-border-tertiary
- Selected/featured borders: 1.5px solid #0C447C

### Topbar
Three-zone layout: logo left, stepper centre, photo count right.
Height ~56px, border-bottom 0.5px.

Stepper: three steps with connecting lines (20px wide, 1px height,
--color-border-tertiary). Each step is a pill with a 18×18px dot + label.
- Pending: border 1px currentColor, --color-text-tertiary
- Active: background --color-background-secondary, dot filled #0C447C
  white text
- Done: dot filled #1D9E75 (teal), white checkmark icon

### Step 1 — upload screen
Upload zone: centred icon block (44×44px rounded-10 card inside zone),
bold 14px heading "Drop photos here", muted caption below.
Hover state: border-color #378ADD, background #E6F1FB.

Thumbnail grid: 7 columns, gap 6px, aspect-ratio 1, border-radius 8px.
On hover: dark overlay appears with a white × icon centred.
Last cell is an "add more" dashed tile.

### Step 2 — format screen
Section sublabel "SIZE" above grid, "ORIENTATION" above toggle.

Format grid: 4 columns (last row can wrap), gap 8px.
Each card: border-radius 10px, padding 14px 10px 12px, text-align centre.
Contains a proportional grey rectangle (the fmt-thumb) that visually
represents the aspect ratio — size it accurately per format:
  4×6  → 42×28px  |  5×7  → 42×34px  |  6×8  → 42×58px
  A5   → 36×52px  |  A4   → 36×52px  |  10cm → 38×38px  |  15cm → 44×44px
Format name: 12px / 500. Dimensions: 11px / --color-text-tertiary.

Selected card state:
  border: 1.5px solid #0C447C
  background: #E6F1FB
  fmt-thumb background: #B5D4F4, border-color #85B7EB
  format name color: #0C447C

Orientation toggle: two equal-width cards side by side.
Each has a 32×32px icon block (border-radius 6px) + text stack
(13px/500 label + 11px/tertiary subtitle). Same selected state as
format cards.

### Step 3 — editor screen
Two-column layout: canvas area (flex: 1) + tool panel (200px fixed).

Canvas area:
  Outer bg: --color-background-secondary, border-radius 12px,
  border 0.5px, padding 20px, min-height 320px, flex centre.
  Photo frame: white bg, overflow hidden. Border = user's chosen
  border width + colour applied as CSS border on the frame div.
  Below canvas: two hint pills ("drag to pan", "scroll to zoom"),
  each with an icon + 11px text, border 0.5px, border-radius 20px,
  background --color-background-primary.
  Photo strip: below hint pills, 50×50px thumbs, gap 6px,
  overflow-x auto, active thumb has 2px #0C447C border.

Tool panel — four stacked blocks:
  1. ROTATE — three equal icon buttons (rotate-left, rotate-right, flip)
     each 32px height, border-radius 7px.
  2. ZOOM & ANGLE — two range sliders with left label (min-width 34px)
     and right readout (min-width 26px). Labels: "Zoom" / "Angle".
     Readout format: "1.3×" / "0°".
  3. BORDER — one range slider (label "Width", readout "8 px") +
     colour swatch row below. Five swatches 22×22px border-radius 50%:
     white (with subtle ring border), black, cream (#f5f0e8),
     warm tan (#c8a97e), and a "none" swatch showing an × icon.
     Active swatch: border 2px solid #0C447C.
  4. PHOTO NAVIGATOR — prev arrow | "1 / 6" counter | next arrow.
     Counter: 11px / --color-text-tertiary, centred in flex:1.

### Step 4 — download screen
Screen subtitle shows a summary: "6 photos · 5×7" portrait · ready to export"

Warning box: border-radius 10px, background --color-background-warning,
border 0.5px --color-border-warning. Header row: amber warning icon +
"A few things to know before printing" at 12px/500.
Three bullet items at 11px, each with a ti-circle-dot icon.

Download format cards: 2-column grid, gap 10px.
Each card: border-radius 12px, padding 18px 16px.
Icon block: 36×36px, border-radius 8px, --color-background-secondary.
Card title: 13px/500. Subtitle: 11px/tertiary.
Selected state: 1.5px border #0C447C, bg #E6F1FB,
icon block bg #B5D4F4, icon color #0C447C.

T&Cs row: border-top 0.5px, padding 10px 0, 12px text.
Inline checkbox + "I've read the terms & conditions — I understand
no photos are stored anywhere". "terms & conditions" links to /terms.

### Footer bar
Three-zone: ghost back button | step hint text | primary action button.
Border-top 0.5px. Padding 14px 24px.

Ghost button: "← Back", border 0.5px, border-radius 8px, 13px.
Hint text: 12px / --color-text-tertiary e.g. "Step 2 of 3".
Primary button:
  Steps 1–3: background #0C447C, hover #185FA5, label "Continue →"
  Step 4: background #0F6E56 (teal/green), hover #1D9E75,
           label "Download 6 photos" (count is dynamic)

### Component states summary
| Element         | Default                  | Hover                     | Selected / Active          |
|-----------------|--------------------------|---------------------------|----------------------------|
| Format card     | 0.5px border, white bg   | border-secondary, bg-sec  | 1.5px #0C447C, #E6F1FB bg  |
| Orientation opt | 0.5px border, white bg   | border-secondary, bg-sec  | 1.5px #0C447C, #E6F1FB bg  |
| Download card   | 0.5px border, white bg   | border-secondary, bg-sec  | 1.5px #0C447C, #E6F1FB bg  |
| Tool icon btn   | 0.5px border, white bg   | border-secondary, bg-sec  | —                          |
| Strip thumb     | transparent border       | —                         | 2px #0C447C border         |
| Colour swatch   | transparent border       | —                         | 2px #0C447C border         |
| Upload zone     | 1px dashed border-sec    | #378ADD border, #E6F1FB   | —                          |
| Primary btn     | #0C447C bg               | #185FA5 bg                | scale(0.98) active         |
| Ghost btn       | 0.5px border-tertiary    | border-sec, bg-secondary  | scale(0.98) active         |

### Tailwind config additions
Add to tailwind.config.ts so class names stay consistent:
extend.colors:
  navy: { 50:'#E6F1FB', 100:'#B5D4F4', 200:'#85B7EB',
          600:'#185FA5', 800:'#0C447C', 900:'#042C53' }
  pteal: { 400:'#1D9E75', 600:'#0F6E56' }


## Editor screen layout constraint
The editor screen (step 3) must fit within the browser viewport with
zero vertical scroll. Use a fixed viewport layout:

- app wrapper: height 100vh, display flex, flex-direction column
- topbar and footer are fixed height (56px and 52px)
- editor screen: flex:1, overflow hidden, display flex, flex-direction column
- inside editor: screen-head (~60px), then a flex:1 row containing
  canvas-wrap and tool-panel, then hint-bar (~28px), then photo-strip (~62px)
- canvas-wrap: flex:1, use ResizeObserver to feed actual px dimensions
  into the Konva Stage — never hardcode stage width or height
- tool-panel: 200px wide, overflow-y auto (in case of very short screens)
- The Konva stage aspect ratio always matches the chosen print size
- Export quality is unaffected by screen size — offscreen canvas always
  renders at full 300 DPI dimensions

## v1.1.0 features

### Feature 1 — Per-side border control
- BorderState type:
  `{ mode: 'uniform'|'individual', uniform: number, top: number,
     right: number, bottom: number, left: number, color: string }`
- UI: global slider always visible. Checkbox "Individual sides" reveals
  four sliders (top/right/bottom/left). Toggling off resets to uniform value.
- Canvas: four inset rects drawn for border, not a single CSS border.
- Export: four filled rectangles at correct 300 DPI pixel widths.

### Feature 2 — Text layers
- TextLayer type:
  `{ id, content, x, y, fontSize, fontFamily, color, selected }`
  x and y are 0–1 fractions of stage dimensions for resolution independence.
- Fonts (load via Google Fonts in layout.tsx):
  Inter, Playfair Display, Lora, Montserrat, Merriweather,
  Dancing Script, Pacifico, Oswald, Raleway, Crimson Text
- Canvas: each TextLayer is a Konva Text node wrapped in a Transformer.
  Draggable. Double-click to edit inline. Click outside to deselect.
- Tool panel: "TEXT LAYERS" block below Border block. "+ Add text" button
  creates a new layer centred on canvas with default "Your text here".
  Layer list shows all text items with edit and delete icons.
  Selecting a layer shows font, size, and colour controls below the list.
- Font size stored in print points. Scale to screen: screenPt = printPt *
  (stageWidth / exportWidth). Scale to export: use printPt directly.
- Export: after drawing photo and border, iterate textLayers and draw each
  with ctx.font and ctx.fillText at scaled positions.
- colour picker: 8 preset swatches (white, black, cream, warm tan, soft red,
  sky blue, sage green, gold) + a native <input type="color"> for custom.