'use client'

import { useState } from 'react'
import {
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  FlipHorizontalIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from '@phosphor-icons/react'
import type { BorderState, PhotoState } from '@/types/album'
import { effectiveSides } from '@/lib/border'
import TextLayerPanel from '@/components/TextLayerPanel'

const DARK = '#3a1a18'
const ACCENT = '#F5E642'
const ACCENT_DARK = '#C8BB00'
const BG = '#F6F5F9'
const BORDER = '#DEDEDE'
const FG_LIGHT = '#888888'

const SIDE_KEYS = ['top', 'right', 'bottom', 'left'] as const
type Side = typeof SIDE_KEYS[number]
type Tab = 'rotate' | 'zoom' | 'border' | 'text'

const BORDER_SWATCHES = [
  { label: 'White',       color: '#ffffff',  shadow: true  },
  { label: 'Black',       color: '#1a1a1a',  shadow: false },
  { label: 'Cream',       color: '#f5f0e8',  shadow: false },
  { label: 'Warm tan',    color: '#c8a97e',  shadow: false },
  { label: 'Candy pink',  color: '#F4B8B0',  shadow: false },
  { label: 'Pastel blue', color: '#A8D4E8',  shadow: false },
  { label: 'Candy yellow',color: '#F5E642',  shadow: false },
]

const SUBLABEL = 'text-[11px] font-medium uppercase tracking-[0.06em]'

// ─── Stepper ────────────────────────────────────────────────────────────────
interface StepperProps {
  value: string
  onMinus: () => void
  onPlus: () => void
}

function Stepper({ value, onMinus, onPlus }: StepperProps) {
  return (
    <div
      className="flex overflow-hidden rounded-[12px] border-2"
      style={{ background: BG, borderColor: BORDER }}
    >
      <button
        onClick={onMinus}
        className="flex h-[48px] w-[52px] shrink-0 items-center justify-center bg-white transition-colors active:bg-gray-50"
      >
        <MinusIcon className="h-[18px] w-[18px]" style={{ color: DARK }} weight="bold" />
      </button>
      <div
        className="flex flex-1 items-center justify-center border-x-2 text-[16px] font-semibold"
        style={{ color: DARK, borderColor: BORDER, minHeight: 48 }}
      >
        {value}
      </div>
      <button
        onClick={onPlus}
        className="flex h-[48px] w-[52px] shrink-0 items-center justify-center bg-white transition-colors active:bg-gray-50"
      >
        <PlusIcon className="h-[18px] w-[18px]" style={{ color: DARK }} weight="bold" />
      </button>
    </div>
  )
}

// ─── Chips ──────────────────────────────────────────────────────────────────
interface ChipOption { label: string; value: number | string }
interface ChipsProps {
  options: ChipOption[]
  activeValue?: number | string
  onSelect: (v: number | string) => void
}

function Chips({ options, activeValue, onSelect }: ChipsProps) {
  return (
    <div className="flex gap-1.5">
      {options.map(({ label, value }) => {
        const active = value === activeValue
        return (
          <button
            key={label}
            onClick={() => onSelect(value)}
            className="flex h-[38px] flex-1 items-center justify-center rounded-[10px] border-2 text-[12px] font-medium transition-colors"
            style={
              active
                ? { background: ACCENT, borderColor: ACCENT_DARK, color: DARK }
                : { background: '#fff', borderColor: BORDER, color: DARK }
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main panel ─────────────────────────────────────────────────────────────
interface Props {
  photo: PhotoState
  onChange: (photo: PhotoState) => void
  onPrev: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  activeIdx: number
  totalPhotos: number
}

const ZOOM_CHIPS: ChipOption[] = [
  { label: 'Fit',   value: 1   },
  { label: '1.5×',  value: 1.5 },
  { label: '2×',    value: 2   },
  { label: '3×',    value: 3   },
]

const ROT_CHIPS: ChipOption[] = [
  { label: '−15°', value: -15 },
  { label: '−5°',  value: -5  },
  { label: '0°',   value: 0   },
  { label: '+5°',  value: 5   },
  { label: '+15°', value: 15  },
]

function fmtRot(r: number): string {
  if (r === 0) return '0°'
  return r > 0 ? `+${r}°` : `${r}°`
}

export default function PhotoToolPanel({ photo, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('rotate')

  function update(patch: Partial<PhotoState>) { onChange({ ...photo, ...patch }) }
  function rotate(deg: number) { update({ rotation: photo.rotation + deg }) }

  function updateBorder(patch: Partial<BorderState>) {
    update({ border: { ...photo.border, ...patch } })
  }
  function setSide(side: Side, value: number) {
    update({ border: { ...photo.border, [side]: value } })
  }
  function toggleIndividual(on: boolean) {
    if (on) {
      const v = photo.border.uniform
      updateBorder({ mode: 'individual', top: v, right: v, bottom: v, left: v })
    } else {
      updateBorder({ mode: 'uniform' })
    }
  }

  const sides = effectiveSides(photo.border)
  const hasBorder = sides.top > 0 || sides.right > 0 || sides.bottom > 0 || sides.left > 0

  function pickColor(color: string) {
    if (!hasBorder) updateBorder({ color, mode: 'uniform', uniform: 10 })
    else updateBorder({ color })
  }
  function clearBorder() {
    updateBorder({ mode: 'uniform', uniform: 0, top: 0, right: 0, bottom: 0, left: 0 })
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'rotate', label: 'Rotate' },
    { key: 'zoom',   label: 'Zoom'   },
    { key: 'border', label: 'Border' },
    { key: 'text',   label: 'Text'   },
  ]

  const nearestZoomChip = ZOOM_CHIPS.find(c => Math.abs((c.value as number) - photo.zoom) < 0.05)

  return (
    <div className="flex flex-col gap-3">
      {/* Tab bar */}
      <div
        className="grid grid-cols-4 gap-1 rounded-[14px] border-2 p-1"
        style={{ background: '#fff', borderColor: BORDER }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="h-9 rounded-[10px] text-[12px] font-medium transition-colors"
            style={activeTab === key ? { background: ACCENT, color: DARK } : { color: FG_LIGHT }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        className="flex flex-col gap-4 rounded-[16px] border-2 p-4"
        style={{ background: '#fff', borderColor: BORDER }}
      >
        {/* ── ROTATE ── */}
        {activeTab === 'rotate' && (
          <>
            <div className="flex flex-col gap-2">
              <p className={SUBLABEL} style={{ color: FG_LIGHT }}>ROTATE 90°</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => rotate(-90)}
                  className="flex h-11 flex-1 items-center justify-center rounded-[10px] border-2 transition-all active:scale-[0.96]"
                  style={{ background: ACCENT, borderColor: ACCENT_DARK }}
                  title="Rotate left"
                >
                  <ArrowCounterClockwiseIcon className="h-[18px] w-[18px]" style={{ color: DARK }} weight="bold" />
                </button>
                <button
                  onClick={() => rotate(90)}
                  className="flex h-11 flex-1 items-center justify-center rounded-[10px] border-2 transition-all active:scale-[0.96]"
                  style={{ background: ACCENT, borderColor: ACCENT_DARK }}
                  title="Rotate right"
                >
                  <ArrowClockwiseIcon className="h-[18px] w-[18px]" style={{ color: DARK }} weight="bold" />
                </button>
                <button
                  onClick={() => update({ flipH: !photo.flipH })}
                  className="flex h-11 flex-1 items-center justify-center rounded-[10px] border-2 transition-all active:scale-[0.96]"
                  style={{ background: '#fff', borderColor: BORDER }}
                  title="Flip horizontal"
                >
                  <FlipHorizontalIcon className="h-[18px] w-[18px]" style={{ color: DARK }} weight="bold" />
                </button>
                <button
                  onClick={() => update({ flipH: !photo.flipH, rotation: (photo.rotation + 180) % 360 })}
                  className="flex h-11 flex-1 items-center justify-center rounded-[10px] border-2 transition-all active:scale-[0.96]"
                  style={{ background: '#fff', borderColor: BORDER }}
                  title="Flip vertical"
                >
                  <FlipHorizontalIcon
                    className="h-[18px] w-[18px]"
                    style={{ color: DARK, transform: 'rotate(90deg)' }}
                    weight="bold"
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className={SUBLABEL} style={{ color: FG_LIGHT }}>FINE ROTATION</p>
              <Stepper
                value={fmtRot(photo.rotation)}
                onMinus={() => update({ rotation: photo.rotation - 1 })}
                onPlus={() => update({ rotation: photo.rotation + 1 })}
              />
              <Chips
                options={ROT_CHIPS}
                activeValue={photo.rotation === 0 ? 0 : undefined}
                onSelect={(v) => {
                  if (v === 0) update({ rotation: 0 })
                  else update({ rotation: photo.rotation + (v as number) })
                }}
              />
            </div>
          </>
        )}

        {/* ── ZOOM ── */}
        {activeTab === 'zoom' && (
          <div className="flex flex-col gap-2">
            <p className={SUBLABEL} style={{ color: FG_LIGHT }}>ZOOM</p>
            <Stepper
              value={`${photo.zoom.toFixed(1)}×`}
              onMinus={() => update({ zoom: Math.max(0.5, parseFloat((photo.zoom - 0.1).toFixed(1))) })}
              onPlus={() => update({ zoom: Math.min(5, parseFloat((photo.zoom + 0.1).toFixed(1))) })}
            />
            <Chips
              options={ZOOM_CHIPS}
              activeValue={nearestZoomChip?.value}
              onSelect={(v) => update({ zoom: v as number })}
            />
          </div>
        )}

        {/* ── BORDER ── */}
        {activeTab === 'border' && (
          <>
            <div className="flex flex-col gap-2">
              <p className={SUBLABEL} style={{ color: FG_LIGHT }}>BORDER WIDTH</p>
              <Stepper
                value={`${photo.border.uniform} px`}
                onMinus={() => updateBorder({ uniform: Math.max(0, photo.border.uniform - 1), mode: 'uniform' })}
                onPlus={() => updateBorder({ uniform: Math.min(40, photo.border.uniform + 1), mode: 'uniform' })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className={SUBLABEL} style={{ color: FG_LIGHT }}>COLOUR</p>
              <div className="flex flex-wrap gap-[7px]">
                {BORDER_SWATCHES.map(({ label, color, shadow }) => {
                  const active = photo.border.color === color && hasBorder
                  return (
                    <button
                      key={color}
                      title={label}
                      onClick={() => pickColor(color)}
                      className="h-[26px] w-[26px] rounded-full border-[2.5px] transition-all active:scale-90"
                      style={{
                        backgroundColor: color,
                        borderColor: active ? DARK : 'transparent',
                        boxShadow: shadow ? '0 0 0 1px #DEDEDE' : undefined,
                      }}
                    />
                  )
                })}
                <button
                  title="No border"
                  onClick={clearBorder}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-2"
                  style={{ background: BG, borderColor: !hasBorder ? DARK : BORDER }}
                >
                  <XIcon className="h-[10px] w-[10px]" style={{ color: FG_LIGHT }} weight="bold" />
                </button>
              </div>
            </div>

            {hasBorder && (
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-[12px]" style={{ color: DARK }}>
                  <input
                    type="checkbox"
                    checked={photo.border.mode === 'individual'}
                    onChange={(e) => toggleIndividual(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  Individual sides
                </label>
                {photo.border.mode === 'individual' && (
                  <div className="flex flex-col gap-2 pl-1">
                    {SIDE_KEYS.map((side) => (
                      <div key={side} className="flex items-center gap-2">
                        <span className="w-14 text-[12px] capitalize font-medium" style={{ color: DARK }}>{side}</span>
                        <Stepper
                          value={`${photo.border[side]} px`}
                          onMinus={() => setSide(side, Math.max(0, photo.border[side] - 1))}
                          onPlus={() => setSide(side, Math.min(200, photo.border[side] + 1))}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── TEXT ── */}
        {activeTab === 'text' && (
          <TextLayerPanel
            textLayers={photo.textLayers}
            onChange={(layers) => onChange({ ...photo, textLayers: layers })}
          />
        )}
      </div>
    </div>
  )
}
