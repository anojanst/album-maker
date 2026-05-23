# Kisku — web UI design additions

## Overview
Desktop/web layout uses the same Candyland theme, colours, and
typography as the mobile design. This document covers only the
differences and additions for the web layout.

## Layout structure

### App container
Full viewport height (100vh). Flex column. Three zones:
- Topbar (52px fixed)
- Main area (flex:1, flex row)
- Footer bar (54px fixed)

No vertical scroll on the outer app. The main area fills the
remaining height exactly.

### Topbar (52px)
Background: var(--primary) #F4B8B0 on screens 1–3.
Background: var(--secondary) #A8D4E8 on screen 4.
Three-zone flex row: logo left · stepper centre · context right.
Progress bar (3px) sits immediately below topbar, not inside it.

Logo: same mark + "kisku" wordmark as mobile.

Stepper shows all three steps inline with connecting lines:
- Done: green dot (#2d6e3a) with white checkmark
- Active: dark brown dot (#3a1a18) with white number,
  step pill has rgba(255,255,255,0.35) background
- Pending: transparent dot, muted text rgba(58,26,24,0.5)
Connecting lines: 20px wide, 1.5px height, rgba(58,26,24,0.2).

Context right: screen-specific label e.g. "6 photos" or
"photo 1 / 6". 12px / 500 / rgba(58,26,24,0.6).

Screen 4 topbar: all three steps show as done with green dots.
Replace context with ready badge:
  "✓ ready" — rgba(255,255,255,0.4) bg, border-radius 20px,
  padding 5px 12px, #2d6e3a checkmark, #1a2a3a text.

### Progress bar
Height: 3px. Background track: rgba(58,26,24,0.15).
Fill: #3a1a18.
Screen 4 fill: #2d6e3a (green).
Widths: screen 1 = 33%, screen 2 = 66%, screens 3–4 = 100%.

### Main area
Flex row, height fills between topbar and footer.
Left: content area (flex:1, padding 20–28px).
Right: sidebar panel (256px fixed, border-left 2px solid #DEDEDE).

### Footer bar (54px)
Background: white. Border-top: 2px solid #DEDEDE.
Padding: 14px 24px.
Three-zone: ghost back button · hint text · primary action button.

Ghost back button: height 42px, padding 0 18px, border-radius 12px,
  border 2px solid #3a1a18, transparent bg, 13px/600/#3a1a18.
  Icon: ti-arrow-left 14px. Hidden (visibility:hidden) on screen 1.

Hint text: 12px / 500 / #888. Centre of footer.
  "Step 1 of 3 — select your photos"
  "Step 2 of 3 — choose your format"
  "Step 3 of 3 — adjust each photo"
  "Ready to download"

Primary button: height 42px, padding 0 24px, border-radius 12px,
  background #3a1a18, 13px/600/#fff. Icon right of label.
  Screen 4: background #2d6e3a, icon color #7FE4A0.

---

## Screen 1 — upload (web)

### Content area
Title: "Your photos,\nprinted." — 26px / 600 / #3a1a18 /
  letter-spacing -0.8px / line-height 1.1.
Subtitle: 13px / 400 / #7a3a35 / margin-top 4px.

Upload zone: same style as mobile but with "Drop photos here
  or click to browse" as the label (desktop can drag-drop).

Thumbnail grid: 6 columns (not 4 — more horizontal space).
  Gap 8px. Same thumb style as mobile.

Count label: "N photos selected" centred below grid.

Footer button label: "Choose format →"

### Sidebar (screen 1)
Not a tool panel — shows contextual tips.
Title: "Tips" 13px/600/#3a1a18.
Three tip items: 12px/400/#888/line-height 1.6.
- Upload high-res photos for best print quality.
- You can reorder photos by dragging thumbnails.
- Nothing leaves your browser — all processing is local.

---

## Screen 2 — format (web)

### Content area
Title: "Print size." — same style as screen 1.
Subtitle: "All N photos use the same size and orientation."

Section labels: "SIZE" and "ORIENTATION" —
  11px / 500 / #888 / letter-spacing 0.07em.

Format grid: 4 columns (not 2 — more space on desktop).
  Same card style as mobile. Gap 8px.

Orientation toggle: flex row, two options + flex:2 spacer
  (so the two options don't stretch full width).
  Same card style as mobile.

Footer button label: "Adjust photos →"

### Sidebar (screen 2)
Contextual size guide.
Title: "Which size?" 13px/600/#3a1a18.
Four items, each bold size name + description:
- 4×6" — the classic print size, fits standard frames.
- 5×7" — great for portraits and landscapes.
- A4/A5 — ideal for home printing.
- Square — perfect for Instagram-era phone photos.
All 12px/400/#888/line-height 1.6.

---

## Screen 3 — editor (web)

### Content area (left)
Canvas area: flex:1, background #F6F5F9, border-radius 14px,
  border 2px solid #DEDEDE, flex centre, min-height 320px,
  position relative.
Photo frame: same as mobile — user's border width and colour.
  Default: 8px solid #F5E642.

Hint pills: absolute bottom-centre, flex row gap 8px.
  THREE pills on web (not two):
  "drag to pan" · "scroll to zoom" · "two-finger rotate"
  Same style as mobile hint pills.

Photo strip: same as mobile, below canvas area.
  44×44px thumbs, gap 6px, active border 2.5px #3a1a18.

### Sidebar — tabbed tool panel (screen 3)

The right panel has two parts:
1. Tab bar at the top (flush to panel top, no padding)
2. Tab content area below (padding 16px, flex column gap 12px)

#### Tab bar
Background: white. Border-bottom: 2px solid #DEDEDE.
Four equal tabs: Rotate · Zoom · Border · Text.
Each tab:
  Flex column, align centre, gap 4px.
  Padding: 12px 4px. Font: 12px/500.
  Icon: Tabler outline, 18px.
    Rotate → ti-rotate
    Zoom   → ti-zoom-in
    Border → ti-square
    Text   → ti-text-size
  Inactive: color #888, border-bottom 3px solid transparent.
  Active: color #3a1a18, border-bottom 3px solid #3a1a18.
  margin-bottom: -2px to sit on top of the border-bottom.

One panel visible at a time. Show/hide on tab click.

#### Rotate panel
Section label: "ROTATE 90°"
Four equal buttons in a row, gap 5px, height 38px,
  border-radius 8px.
  Rotate-left (ti-rotate-2): accent filled (#F5E642 bg, #C8BB00 border).
  Rotate-right (ti-rotate): accent filled.
  Flip-H (ti-flip-horizontal): outline (white bg, #DEDEDE border).
  Flip-V (ti-flip-vertical): outline.
  All icons 16px, color #3a1a18.

Tool block (bg #F6F5F9, border-radius 12px, padding 12px,
  border 2px solid #DEDEDE):
  Section label: "FINE ROTATION"
  Stepper: − | value | + (see stepper spec below).
    Value format: "0°", "+5°", "−12°".
    Step: 1° per click. Range: −45° to +45°.
  Quick chips row: −15° · −5° · 0° · +5° · +15°.
    0° chip is accent when rotation === 0.

#### Zoom panel
Tool block:
  Section label: "ZOOM"
  Stepper: − | value | +.
    Value format: "1.0×". Step: 0.1. Range: 0.5–5.0.
  Quick chips: Fit · 1× · 1.5× · 2× · 3×.
    Active chip matches current zoom value.
    Fit chip = active when zoom is 1.0.

#### Border panel
Two tool blocks + one plain block:

Tool block 1:
  Section label: "BORDER WIDTH"
  Stepper: − | value | +.
    Value format: "N px". Step: 1. Range: 0–40.

Tool block 2:
  Section label: "BORDER COLOUR"
  Swatch row: white · black · cream · warm tan ·
    candy pink #F4B8B0 · pastel blue #A8D4E8 ·
    candy yellow #F5E642 · none (× icon).
  Active swatch: 2.5px solid #3a1a18 border.

Plain block (bg #F6F5F9, border-radius 12px, padding 12px,
  border 2px solid #DEDEDE):
  Section label: "INDIVIDUAL SIDES"
  Checkbox row: 18×18px checkbox + "Control each side
    separately" label 12px/400/#525252.
  When checked: reveal four steppers (Top/Right/Bottom/Left)
    below. Global width stepper greys out.

#### Text panel
Dashed add button (full width):
  border-radius 10px, 2px dashed #DEDEDE, bg #F6F5F9,
  padding 14px, flex row centred, gap 6px.
  + icon (ti-plus, 16px) + "Add text layer" 13px/500/#3a1a18.

Helper text below:
  "Tap a text layer on the canvas to select and edit it"
  11px / 400 / #888 / text-align centre.

Each text layer (once added) renders as a row:
  White card, border-radius 10px, 2px solid #DEDEDE,
  padding 10px 12px, flex row, gap 10px.
  Layer content (truncated) left, ti-edit + ti-trash right.
  Selected: 2px solid #3a1a18, bg #F4B8B0.

Below selected layer:
  Font picker dropdown (Poppins, Playfair Display, Lora,
    Montserrat, Merriweather, Dancing Script, Pacifico,
    Oswald, Raleway, Crimson Text).
  Size stepper (same component, value in pt).
  Colour swatches (same as border palette).

Footer button label: "Download →"

---

## Screen 4 — download (web)

### Content area
Title: "Almost done." — 26px / 600 / #1a2a3a.
Subtitle: "N photos · size · orientation" — 13px / #2a5a6a.

Warning box: same as mobile. Full width.

Download cards: flex column, gap 8px.
  Same card style as mobile but full width.

T&Cs row: border-top 2px solid #DEDEDE, padding 10px 0,
  checkbox + 12px label. Same copy as mobile.

Footer button label: "Download N photos" with ti-download icon.
Footer button background: #2d6e3a.

### Sidebar (screen 4)
Print tips + sign-in prompt.
Title: "Print tips" 13px/600/#1a2a3a.
Three tip items: 12px/400/#888/line-height 1.6.
- For print shops: send the ZIP of PNG files.
- For home printing: use the PDF.
- Paper matters — use matte or gloss photo paper.

Sign-in card (bottom of sidebar):
  Background: #E8F5EC. Border-radius: 10px.
  Border: 2px solid #7FE4A0. Padding: 10px 12px.
  Title: "Save your album" 12px/600/#1a4a28.
  Subtitle: "Sign in to save this album and come back to
    edit it later." 11px/#2d6e3a/line-height 1.4.
  Button: height 32px, border-radius 8px, bg #2d6e3a,
    "Sign in to save" 12px/600/#fff. Full width.

---

## Stepper component spec (web)

Outer: border 2px solid #DEDEDE, border-radius 10px,
  overflow hidden, background white.
Minus button: 38×40px, white bg, flex centre, cursor pointer.
Value display: flex:1, height 40px, 14px/600/#3a1a18, flex centre.
  Border-left and border-right: 2px solid #DEDEDE.
Plus button: 38×40px, white bg, flex centre, cursor pointer.
Icons: ti-minus / ti-plus, 16px, color #3a1a18.

---

## Quick chips spec (web)

Flex row, gap 4px, flex-wrap wrap.
Each chip: padding 5px 8px, border-radius 8px,
  border 2px solid #DEDEDE, white bg, 11px/500/#3a1a18,
  cursor pointer.
Active chip: background #F5E642, border-color #C8BB00.

---

## Responsive breakpoint

The web layout (two-column with 256px sidebar) applies at
viewport width ≥ 768px. Below 768px, fall back to the mobile
single-column layout defined in CLAUDE_MOBILE_UI.md.
The sidebar tool panel collapses to the bottom tab bar
from the mobile design below this breakpoint.

---

## Rules for the coding agent

- No range sliders anywhere — steppers + chips only,
  same as mobile
- Web hint pills include a third: "two-finger rotate"
  (desktop trackpad gesture)
- Thumbnail grid is 6 columns on web, 4 on mobile
- Format grid is 4 columns on web, 2 on mobile
- Sidebar is 256px fixed width, never grows or shrinks
- Tab bar sits flush at the top of the sidebar with no
  outer padding — content padding starts below the tab bar
- Active tab underline: 3px solid #3a1a18,
  margin-bottom -2px to overlap the panel border
- Screen 4 sidebar always shows the sign-in prompt card
  even if user is already signed in (show "Your albums →"
  button instead in that case)
- Screen 4 topbar and progress bar use completion colours
  (#A8D4E8 topbar, #2d6e3a progress fill)
- Never show the sidebar tool panel on screens 1, 2, or 4 —
  those screens use informational sidebars only