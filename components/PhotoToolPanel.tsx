'use client'

import { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon, CaretDownIcon, FlipHorizontalIcon, ArrowCounterClockwiseIcon, ArrowClockwiseIcon, XIcon } from '@phosphor-icons/react'
import type { BorderState, PhotoState } from '@/types/album'
import { effectiveSides } from '@/lib/border'
import TextLayerPanel from '@/components/TextLayerPanel'

const SIDE_KEYS = ['top', 'right', 'bottom', 'left'] as const
type Side = typeof SIDE_KEYS[number]

const BORDER_SWATCHES = [
  { label: 'White', color: '#ffffff' },
  { label: 'Light gray', color: '#e5e7eb' },
  { label: 'Warm gray', color: '#d1d5db' },
  { label: 'Black', color: '#000000' },
  { label: 'Cream', color: '#f5f0e8' },
  { label: 'Warm tan', color: '#c8a97e' },
  { label: 'Gold', color: '#fbbf24' },
  { label: 'Soft red', color: '#f87171' },
  { label: 'Sky blue', color: '#7dd3fc' },
  { label: 'Sage green', color: '#86efac' },
  { label: 'Navy', color: '#0C447C' },
] as const

const BLOCK = 'rounded-[10px] bg-(--color-background-secondary) p-3'
const BLOCK_HEADER = 'flex w-full cursor-pointer select-none items-center justify-between'
const SUBLABEL = 'text-[11px] font-medium uppercase tracking-[0.06em] text-(--color-text-secondary)'
const ICON_BTN = 'flex h-8 flex-1 items-center justify-center rounded-[7px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary)'
const FIELD_LABEL = 'flex-1 text-[12px] text-(--color-text-secondary)'
const NUM_INPUT = 'w-16 rounded-[6px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) px-2.5 py-1.5 text-right text-[12px] text-(--color-text-secondary) focus:outline-none focus:border-(--color-border-primary)'
const UNIT = 'w-4 shrink-0 text-[11px] text-(--color-text-tertiary)'

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

export default function PhotoToolPanel({ photo, onChange, onPrev, onNext, isFirst, isLast, activeIdx, totalPhotos }: Props) {
  const [open, setOpen] = useState({ zoom: true, border: true, text: true, photos: true })
  function toggle(key: keyof typeof open) { setOpen((s) => ({ ...s, [key]: !s[key] })) }

  function update(patch: Partial<PhotoState>) { onChange({ ...photo, ...patch }) }
  function rotate(deg: number) { update({ rotation: ((photo.rotation + deg) % 360 + 360) % 360 }) }

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

  return (
    <div className="flex w-75 shrink-0 flex-col gap-2 overflow-y-auto">
      {/* ZOOM, ANGLE & ROTATE */}
      <div className={BLOCK}>
        <button className={BLOCK_HEADER} onClick={() => toggle('zoom')}>
          <p className={SUBLABEL}>Zoom & Angle</p>
          <CaretDownIcon className={['h-3 w-3 text-(--color-text-tertiary) transition-transform', open.zoom ? '' : '-rotate-90'].join(' ')} weight="light" />
        </button>
        {open.zoom && (
          <div className="mt-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={FIELD_LABEL}>Zoom</span>
              <input type="number" min={0.5} max={4} step={0.1} value={photo.zoom.toFixed(1)}
                onChange={(e) => update({ zoom: Math.min(4, Math.max(0.5, parseFloat(e.target.value) || 0.5)) })}
                className={NUM_INPUT} />
              <span className={UNIT}>×</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={FIELD_LABEL}>Angle</span>
              <input type="number" min={-180} max={180} step={1} value={photo.rotation}
                onChange={(e) => update({ rotation: Math.min(180, Math.max(-180, parseInt(e.target.value) || 0)) })}
                className={NUM_INPUT} />
              <span className={UNIT}>°</span>
            </div>
            <div className="flex gap-1.5 border-t-[0.5px] border-(--color-border-tertiary) pt-3">
              <button className={ICON_BTN} onClick={() => rotate(-90)} title="Rotate left">
                <ArrowCounterClockwiseIcon className="h-3.5 w-3.5" weight="light" />
              </button>
              <button className={ICON_BTN} onClick={() => rotate(90)} title="Rotate right">
                <ArrowClockwiseIcon className="h-3.5 w-3.5" weight="light" />
              </button>
              <button className={ICON_BTN} onClick={() => update({ flipH: !photo.flipH })} title="Flip horizontal">
                <FlipHorizontalIcon className="h-3.5 w-3.5" weight="light" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BORDER */}
      <div className={BLOCK}>
        <button className={BLOCK_HEADER} onClick={() => toggle('border')}>
          <p className={SUBLABEL}>Border</p>
          <CaretDownIcon className={['h-3 w-3 text-(--color-text-tertiary) transition-transform', open.border ? '' : '-rotate-90'].join(' ')} weight="light" />
        </button>
        {open.border && (
          <div className="mt-2 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {BORDER_SWATCHES.map(({ label, color }) => {
                const active = photo.border.color === color && hasBorder
                return (
                  <button
                    key={color}
                    title={label}
                    onClick={() => pickColor(color)}
                    style={{ backgroundColor: color }}
                    className={['h-6 w-6 rounded-full transition-all',
                      active
                        ? 'scale-110 outline-2 outline-offset-1 outline-primary'
                        : [color === '#ffffff' || color === '#e5e7eb' ? 'ring-1 ring-(--color-border-tertiary)' : '', 'hover:scale-110'].join(' '),
                    ].join(' ')}
                  />
                )
              })}
              <button
                title="No border"
                onClick={clearBorder}
                className={['flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] transition-all',
                  !hasBorder
                    ? 'border-primary text-primary'
                    : 'border-(--color-border-tertiary) text-(--color-text-tertiary) hover:scale-110',
                ].join(' ')}
              >
                <XIcon className="h-3 w-3" weight="light" />
              </button>
            </div>

            {hasBorder && (
              <div className="flex flex-col gap-3 border-t-[0.5px] border-(--color-border-tertiary) pt-3">
                <div className="flex items-center gap-2">
                  <span className={FIELD_LABEL}>Width</span>
                  <input type="number" min={0} max={200} step={1} value={photo.border.uniform}
                    onChange={(e) => updateBorder({ uniform: Math.max(0, parseInt(e.target.value) || 0) })}
                    className={NUM_INPUT} />
                  <span className={UNIT}>px</span>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-[12px] text-(--color-text-secondary)">
                  <input
                    type="checkbox"
                    checked={photo.border.mode === 'individual'}
                    onChange={(e) => toggleIndividual(e.target.checked)}
                    className="accent-primary"
                  />
                  Individual sides
                </label>
                {photo.border.mode === 'individual' && (
                  <div className="flex flex-col gap-2.5 border-l-[0.5px] border-(--color-border-tertiary) pl-3">
                    {SIDE_KEYS.map((side) => (
                      <div key={side} className="flex items-center gap-2">
                        <span className={FIELD_LABEL + ' capitalize'}>{side}</span>
                        <input type="number" min={0} max={200} step={1} value={photo.border[side]}
                          onChange={(e) => setSide(side, Math.max(0, parseInt(e.target.value) || 0))}
                          className={NUM_INPUT} />
                        <span className={UNIT}>px</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TEXT LAYERS */}
      <div className={BLOCK}>
        <button className={BLOCK_HEADER} onClick={() => toggle('text')}>
          <p className={SUBLABEL}>Text Layers</p>
          <CaretDownIcon className={['h-3 w-3 text-(--color-text-tertiary) transition-transform', open.text ? '' : '-rotate-90'].join(' ')} weight="light" />
        </button>
        {open.text && (
          <div className="mt-2">
            <TextLayerPanel
              textLayers={photo.textLayers}
              onChange={(layers) => onChange({ ...photo, textLayers: layers })}
            />
          </div>
        )}
      </div>

      {/* PHOTO NAVIGATOR */}
      <div className={BLOCK}>
        <button className={BLOCK_HEADER} onClick={() => toggle('photos')}>
          <p className={SUBLABEL}>Photos</p>
          <CaretDownIcon className={['h-3 w-3 text-(--color-text-tertiary) transition-transform', open.photos ? '' : '-rotate-90'].join(' ')} weight="light" />
        </button>
        {open.photos && (
          <div className="mt-2 flex items-center">
            <button onClick={onPrev} disabled={isFirst}
              className="rounded p-1 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) disabled:opacity-30">
              <CaretLeftIcon className="h-4 w-4" weight="light" />
            </button>
            <span className="flex-1 text-center text-[11px] text-(--color-text-tertiary)">
              {activeIdx + 1} / {totalPhotos}
            </span>
            <button onClick={onNext} disabled={isLast}
              className="rounded p-1 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) disabled:opacity-30">
              <CaretRightIcon className="h-4 w-4" weight="light" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
