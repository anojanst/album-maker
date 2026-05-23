# Kisku — mobile UI design system

## Overview
Mobile-first design using the tweakcn Candyland theme. Bold full-bleed
hero blocks, Poppins font, touch-native controls only — no sliders anywhere.

## Font
Poppins (Google Fonts) — weights 400, 500, 600 only.
Load in layout.tsx:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
```

## Candyland CSS variables
Paste into globals.css:
```css
:root {
  --background: oklch(0.9809 0.0025 228.7836);
  --foreground: oklch(0.3211 0 0);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.3211 0 0);
  --primary: oklch(0.8677 0.0735 7.0855);
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.8148 0.0819 225.7537);
  --secondary-foreground: oklch(0 0 0);
  --muted: oklch(0.8828 0.0285 98.1033);
  --muted-foreground: oklch(0.5382 0 0);
  --accent: oklch(0.9680 0.2110 109.7692);
  --accent-foreground: oklch(0 0 0);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.8699 0 0);
  --input: oklch(0.8699 0 0);
  --ring: oklch(0.8677 0.0735 7.0855);
  --radius: 0.5rem;
  --font-sans: Poppins, sans-serif;
}

.dark {
  --background: oklch(0.2303 0.0125 264.2926);
  --foreground: oklch(0.9219 0 0);
  --card: oklch(0.3210 0.0078 223.6661);
  --card-foreground: oklch(0.9219 0 0);
  --primary: oklch(0.8027 0.1355 349.2347);
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.7395 0.2268 142.8504);
  --secondary-foreground: oklch(0 0 0);
  --muted: oklch(0.3867 0 0);
  --muted-foreground: oklch(0.7155 0 0);
  --accent: oklch(0.8148 0.0819 225.7537);
  --accent-foreground: oklch(0 0 0);
  --border: oklch(0.3867 0 0);
  --input: oklch(0.3867 0 0);
}
```

## Colour reference (hex equivalents for quick use)
| Token          | Hex       | Usage                                      |
|----------------|-----------|--------------------------------------------|
| primary        | #F4B8B0   | hero block bg, selected card bg            |
| primary-dark   | #3a1a18   | all dark text, button bg, borders on hero  |
| secondary      | #A8D4E8   | download screen hero bg                    |
| secondary-dark | #1a4a5a   | text on secondary hero                     |
| accent         | #F5E642   | photo border, active tab, quick chips,     |
|                |           | rotate/zoom filled buttons, upload icon bg |
| accent-dark    | #C8BB00   | accent border                              |
| background     | #F6F5F9   | page background                            |
| card           | #FFFFFF   | all card surfaces                          |
| border         | #DEDEDE   | all card and element borders               |
| fg             | #525252   | body text                                  |
| fg-light       | #888888   | labels, hints, muted text                  |
| success        | #2d6e3a   | download button background                 |
| success-light  | #7FE4A0   | download button icon colour                |
| warn-bg        | #FFF8E1   | warning box background                     |
| warn-border    | #F5C842   | warning box border                         |
| warn-text      | #7a5a00   | warning box text                           |

## Border radius
| Element              | Radius  |
|----------------------|---------|
| Phone container      | 32px    |
| Hero block           | 0       |
| Cards / tool blocks  | 16px    |
| Buttons (primary)    | 16px    |
| Format cards         | 16px    |
| Stepper container    | 12px    |
| Stepper buttons      | 0       |
| Quick chips          | 10px    |
| Tool tab active      | 10px    |
| Tool tab container   | 14px    |
| Thumbnails           | 10–12px |
| Strip thumbs         | 10px    |
| Photo frame          | 2px     |
| Hint pills           | 20px    |

## Border widths
- Card / tool block borders: 2px solid #DEDEDE
- Selected card / active state: 2px solid #3a1a18
- Stepper outer border: 2px solid #DEDEDE
- Stepper dividers (between btn and val): 2px solid #DEDEDE
- Strip thumb active: 2.5px solid #3a1a18
- Colour swatch active: 2.5px solid #3a1a18
- Upload zone: 2.5px solid #3a1a18
- Back button: 2px solid #3a1a18
- Step badge: none (rgba white background)

## Typography scale
| Element          | Size | Weight | Colour          |
|------------------|------|--------|-----------------|
| Hero title       | 36px | 600    | #3a1a18         |
| Hero subtitle    | 13px | 400    | #7a3a35         |
| Screen body text | 14px | 400    | #525252         |
| Card title       | 14px | 600    | #3a1a18         |
| Card subtitle    | 12px | 400    | #888888         |
| Section label    | 11px | 500    | #888888         |
| Primary button   | 16px | 600    | #ffffff         |
| Stepper value    | 16px | 600    | #3a1a18         |
| Quick chip       | 12px | 500    | #3a1a18         |
| Tab label        | 12px | 500    | #888 / #3a1a18  |
| Hint pill        | 11px | 500    | #3a1a18         |
| Step badge       | 12px | 500    | #3a1a18         |
| Logo name        | 16px | 600    | #3a1a18         |

## Layout structure — every screen

### Status bar (44px)
Background: var(--primary) — salmon pink on screens 1–3,
var(--secondary) — pastel blue on screen 4.
Text and icons: #3a1a18.

### Hero block
Full-bleed coloured section. No card wrapper. Owns top third of screen.
Padding: 14–20px horizontal, 14–18px top, 18–32px bottom.
Screens 1–3: background var(--primary) #F4B8B0.
Screen 4 (download): background var(--secondary) #A8D4E8.

Hero top row: back button (left) · centre label · step badge (right).
Back button: 38×38px, border-radius 11px, 2px solid #3a1a18, white bg.
Step badge: "N / 3", rgba(255,255,255,0.35) bg, border-radius 20px,
  padding 5px 12px, font-size 12px, color #3a1a18.

Hero title: 36px / 600 / #3a1a18 / letter-spacing -1px / line-height 1.05.
Hero subtitle: 13px / 400 / #7a3a35 / line-height 1.5.
Screen 4 title and subtitle use #1a2a3a and #2a5a6a respectively.

### Body area
Background: var(--background) #F6F5F9.
Padding: 20px horizontal, 14–20px top, 14px bottom.
Flex column, gap 12–14px.

### Footer / primary action
Background: var(--background).
Padding: 10px 16px 24px (extra bottom padding for safe area).
Single full-width primary button.

## Primary button
Height: 54px. Border-radius: 16px. Background: #3a1a18.
Label: 16px / 600 / #ffffff.
Icon: 16px, colour var(--primary) #F4B8B0 on dark bg,
  #7FE4A0 on success/download button.
Download button background: #2d6e3a (success green).
No border.

## Screen 1 — upload

### Hero
Title: "Your photos,\nprinted."
Subtitle: "Upload from your phone — everything stays in your browser"
No back button. Step badge: "1 / 3".

### Upload zone
Border: 2.5px solid #3a1a18. Border-radius: 18px.
Background: var(--card) white. Padding: 28px 16px. Text-align: centre.
Icon block: 52×52px, border-radius 15px, background var(--accent) #F5E642.
Icon: ti-cloud-upload, 24px, color #3a1a18.
Title: "Tap to choose photos" 15px / 600 / #3a1a18.
Subtitle: "JPEG · PNG · HEIC · up to 50 files" 12px / #888.

### Thumbnail grid
4 columns, gap 6px. Each thumb: border-radius 12px, aspect-ratio 1.
Remove button: 17×17px circle, top-right corner, bg rgba(58,26,24,0.5),
  white × icon 9px.
Last cell: dashed add tile — 2px dashed #DEDEDE, white bg, + icon 20px #888.

### Count label
"N photos selected" — 12px / #888 / text-align centre.

### Footer button
Label: "Choose format →"

## Screen 2 — format

### Hero
Title: "Print size."
Subtitle: "All N photos use the same size and orientation"
Back button visible. Step badge: "2 / 3".

### Format grid
2 columns, gap 8px.
Each card: border-radius 16px, 2px solid #DEDEDE, white bg,
  padding 14px 12px, flex row, gap 12px.
Left: physical proportion rectangle (see sizes below), border-radius 4px,
  background #DEDEDE, border 1px solid #C0C0C0.
Right: name 14px/600/#3a1a18, dimensions 11px/#888.

Selected state: border 2px solid #3a1a18, background var(--primary) #F4B8B0.
Selected proportion rect: background #fff, border rgba(58,26,24,0.3).
Selected dimensions text: #7a3a35.

Proportion rect sizes (w × h):
  4×6" → 28×20px  |  5×7" → 28×22px  |  6×8" → 28×26px
  A5   → 20×28px  |  A4   → 20×28px  |  10cm → 24×24px  |  15cm → 28×28px

### Section label
"ORIENTATION" — 11px / 500 / #888 / letter-spacing 0.07em.

### Orientation toggle
2 columns, gap 8px.
Each option: border-radius 16px, 2px solid #DEDEDE, white bg,
  padding 14px, flex column centred, gap 8px.
Contains: proportion rect (32×44px portrait / 44×32px landscape),
  border-radius 5px, background #DEDEDE.
Label: 13px / 600 / #3a1a18.

Selected state: border 2px solid #3a1a18, background var(--secondary) #A8D4E8.
Selected rect: background #fff, border rgba(58,26,24,0.3).

### Footer button
Label: "Adjust photos →"

## Screen 3 — editor

### Hero
Back button (left) · "photo N / N" (centre, 13px/500/#3a1a18) ·
step badge (right).
Canvas sits INSIDE the hero block on a white card bg.

### Canvas area
Background: var(--card). Border-radius: 18px. Border: 2px solid #DEDEDE.
Padding: 16px. Min-height: 230px. Position: relative.
Photo frame: border-radius 2px, border = user's chosen border
  width and colour (default 8px solid #F5E642).
Hint pills: absolute bottom-centre. Two pills side by side:
  "drag to pan" and "pinch to zoom". Each: rgba(255,255,255,0.92) bg,
  border-radius 20px, padding 4px 10px, 11px/500/#3a1a18, small icon left.

### Photo strip
Horizontal scrollable row of 48×48px thumbs, gap 6px.
Active thumb: 2.5px solid #3a1a18 border.
Inactive: transparent border.

### Tool tabs
Container: white bg, border-radius 14px, padding 4px, 2px solid #DEDEDE.
Four tabs: Rotate · Zoom · Border · Text.
Inactive: 12px/500/#888.
Active: background var(--accent) #F5E642, color #3a1a18, border-radius 10px.
One panel shown at a time — show/hide on tab tap.

### Tool block (shared container)
Background: white. Border-radius: 16px. Padding: 16px.
Border: 2px solid #DEDEDE. Flex column, gap 12px.
Section label inside: 11px / 500 / #888 / letter-spacing 0.06em.

### Rotate panel
Two sections:

ROTATE 90° — four equal buttons in a row, gap 6px, height 44px,
  border-radius 10px.
  Rotate-left and rotate-right: background #F5E642, border #C8BB00 (filled).
  Flip-H and flip-V: white bg, 2px solid #DEDEDE (outline).
  All icons: 18px, color #3a1a18.

FINE ROTATION — stepper + quick chips (same pattern as zoom below).
  Stepper value: current degrees e.g. "0°", "+5°", "−12°".
  Range: −45° to +45°. Step: 1° per tap.
  Quick chips: −15° · −5° · 0° · +5° · +15°.
  0° chip is accent-filled when rotation === 0 (acts as reset indicator).
  All other chips: white bg, 2px solid #DEDEDE.

### Zoom panel
ZOOM — stepper (same pattern):
  Stepper: minus btn | current value e.g. "1.0×" | plus btn.
  Step: 0.1× per tap. Range: 0.5× to 5×. Display 1 decimal place.
  Quick chips row: Fit · 1× · 1.5× · 2× · 3×.
  Active/current chip highlighted in accent yellow.

### Stepper component (used in both Zoom and Rotate)
Outer container: 2px solid #DEDEDE, border-radius 12px,
  overflow hidden, background #F6F5F9.
Minus button: 52×48px, white bg, flex centre.
Value display: flex:1, height 48px, 16px/600/#3a1a18, flex centre.
  Border-left and border-right: 2px solid #DEDEDE.
Plus button: 52×48px, white bg, flex centre.
Button icons: ti-minus / ti-plus, 18px, #3a1a18.

### Quick chips (used in both Zoom and Rotate)
Flex row, gap 6px. Each chip: flex:1, height 38px, border-radius 10px,
  2px solid #DEDEDE, white bg, 12px/500/#3a1a18, flex centre.
Active/matching chip: background #F5E642, border-color #C8BB00.

### Border panel
BORDER WIDTH — stepper. Step: 1px. Range: 0–40px. Value: "N px".

COLOUR — swatch row, gap 7px.
Seven swatches + one "none" swatch.
Each swatch: 26×26px circle, border 2.5px solid transparent.
Active swatch: border-color #3a1a18.
Swatches: white (+ box-shadow 0 0 0 1px #DEDEDE) · black #1a1a1a ·
  cream #f5f0e8 · warm tan #c8a97e · candy pink #F4B8B0 ·
  pastel blue #A8D4E8 · candy yellow #F5E642.
None swatch: bg #F6F5F9, border 2px solid #DEDEDE, × icon 10px #888.

### Text panel
Dashed add button: full width, border-radius 12px, 2px dashed #DEDEDE,
  bg #F6F5F9, padding 16px, flex row centred, gap 8px.
+ icon 18px + "Add text" 14px/500 both #3a1a18.
Each text layer (once added): white card, border-radius 12px,
  2px solid #DEDEDE, flex row, layer content left, edit + delete icons right.
Selected layer: 2px solid #3a1a18 border, accent bg.
Below selected layer: font picker (dropdown), size stepper,
  colour swatches (same as border palette).

### Footer button
Label: "Download →"

## Screen 4 — download

### Hero
Background: var(--secondary) #A8D4E8 (different from other screens).
Back button: border #1a4a5a, icon #1a4a5a.
Step badge replaced with ready badge:
  "✓ ready" — rgba(255,255,255,0.4) bg, #2d6e3a checkmark, #1a4a5a text.
Title: "Almost\ndone." — color #1a2a3a.
Subtitle: "N photos · size · orientation" — color #2a5a6a.

### Warning box
Border-radius: 14px. Background: #FFF8E1. Border: 2px solid #F5C842.
Padding: 14px.
Header: ti-alert-triangle 14px + "Before you print" 13px/600/#7a5a00.
Bullet items: ti-circle-dot icon + 12px/#7a5a00 text, line-height 1.4.
Show resolution warning for any photo below minimum DPI.

### Download format cards
Flex column, gap 8px. Two cards.
Each card: 2px solid #DEDEDE, border-radius 16px, padding 16px,
  flex row, gap 14px, white bg.
Icon block: 44×44px, border-radius 12px, background #F5E642 (accent).
  Icon: 22px, color #3a1a18.
Title: 14px/600/#3a1a18. Subtitle: 12px/#888.

Selected card: border 2px solid #3a1a18, background var(--primary) #F4B8B0.
Selected icon block: background #fff.

### T&Cs row
Border-top: 2px solid #DEDEDE. Padding: 10px 0.
Checkbox + 12px/#525252 label.
Link "terms & conditions": color #5AAAC8 (secondary-dark), font-weight 500.

### Footer button
Background: #2d6e3a (success green).
Label: "Download N photos".
Icon: ti-download, color #7FE4A0.

## Rules for the coding agent

- No range input sliders anywhere in the UI — use steppers and
  quick chips for all numeric controls (zoom, rotation, border width)
- Primary gesture for zoom is pinch-to-zoom on the Konva canvas
- Primary gesture for rotation is two-finger rotate on the Konva canvas
- Steppers and chips are the fallback UI for fine-tuning
- All tap targets minimum 44×44px
- Font is Poppins everywhere — no system font fallback in components
- Hero block is not a card — it has no border-radius, it bleeds edge to edge
- Section labels are 11px uppercase with letter-spacing 0.06–0.08em
- Two border weights only: 2px for cards/components, 2.5px for active thumbs
  and swatches
- Never use navy #0C447C — all dark colour is #3a1a18 (warm dark brown)
- Accent yellow #F5E642 is the highlight colour — use for active states,
  filled action buttons, and the photo frame border default
- Download screen hero switches from pink to blue — this is intentional,
  it signals completion
- Download button is green #2d6e3a — distinct from all other actions