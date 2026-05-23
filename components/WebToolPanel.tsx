'use client'

import { useState } from 'react'
import {
  ArrowCounterClockwiseIcon, ArrowClockwiseIcon, FlipHorizontalIcon,
  MinusIcon, PlusIcon, XIcon, MagnifyingGlassPlusIcon, FrameCornersIcon, TextAaIcon,
} from '@phosphor-icons/react'
import type { BorderState, PhotoState } from '@/types/album'
import { effectiveSides } from '@/lib/border'
import TextLayerPanel from '@/components/TextLayerPanel'

const DARK = '#3a1a18'
const ACCENT = '#F5E642'
const ACCENT_DARK = '#C8BB00'
const BG = '#F6F5F9'
const BORDER = '#DEDEDE'
const FG = '#888'
type Tab = 'rotate' | 'zoom' | 'border' | 'text'
type Side = 'top' | 'right' | 'bottom' | 'left'

const TABS: { key: Tab; Icon: React.ElementType; label: string }[] = [
  { key: 'rotate', Icon: ArrowClockwiseIcon, label: 'Rotate' },
  { key: 'zoom',   Icon: MagnifyingGlassPlusIcon, label: 'Zoom' },
  { key: 'border', Icon: FrameCornersIcon, label: 'Border' },
  { key: 'text',   Icon: TextAaIcon, label: 'Text' },
]
const SWATCHES = ['#ffffff', '#1a1a1a', '#f5f0e8', '#c8a97e', '#F4B8B0', '#A8D4E8', '#F5E642']
const SIDE_KEYS: Side[] = ['top', 'right', 'bottom', 'left']
const ZOOM_CHIPS = [{ l: 'Fit', v: 1 }, { l: '1.5×', v: 1.5 }, { l: '2×', v: 2 }, { l: '3×', v: 3 }]
const ROT_CHIPS = [{ l: '−15°', v: -15 }, { l: '−5°', v: -5 }, { l: '0°', v: 0 }, { l: '+5°', v: 5 }, { l: '+15°', v: 15 }]
const SUB = 'text-[11px] font-medium uppercase tracking-[0.07em]'

function Stepper({ value, onMinus, onPlus }: { value: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex overflow-hidden" style={{ borderRadius: 10, border: `2px solid ${BORDER}` }}>
      <button onClick={onMinus} className="flex shrink-0 items-center justify-center bg-white transition-colors active:bg-gray-50" style={{ width: 38, height: 40 }}>
        <MinusIcon size={14} style={{ color: DARK }} weight="bold" />
      </button>
      <div className="flex flex-1 items-center justify-center text-[14px] font-semibold"
        style={{ height: 40, color: DARK, borderLeft: `2px solid ${BORDER}`, borderRight: `2px solid ${BORDER}` }}>
        {value}
      </div>
      <button onClick={onPlus} className="flex shrink-0 items-center justify-center bg-white transition-colors active:bg-gray-50" style={{ width: 38, height: 40 }}>
        <PlusIcon size={14} style={{ color: DARK }} weight="bold" />
      </button>
    </div>
  )
}

function Chips({ opts, active, onSelect }: { opts: { l: string; v: number }[]; active?: number; onSelect: (v: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {opts.map(({ l, v }) => (
        <button key={l} onClick={() => onSelect(v)} className="rounded-[8px] border-2 text-[11px] font-medium"
          style={{ padding: '5px 8px', background: active === v ? ACCENT : '#fff', borderColor: active === v ? ACCENT_DARK : BORDER, color: DARK }}>
          {l}
        </button>
      ))}
    </div>
  )
}

interface Props { photo: PhotoState; onChange: (p: PhotoState) => void }

export default function WebToolPanel({ photo, onChange }: Props) {
  const [tab, setTab] = useState<Tab>('rotate')
  const update = (patch: Partial<PhotoState>) => onChange({ ...photo, ...patch })
  const updateBorder = (patch: Partial<BorderState>) => update({ border: { ...photo.border, ...patch } })
  const setSide = (side: Side, v: number) => update({ border: { ...photo.border, [side]: v } })

  function toggleIndividual(on: boolean) {
    const v = photo.border.uniform
    updateBorder(on ? { mode: 'individual', top: v, right: v, bottom: v, left: v } : { mode: 'uniform' })
  }

  const sides = effectiveSides(photo.border)
  const hasBorder = sides.top > 0 || sides.right > 0 || sides.bottom > 0 || sides.left > 0
  const pickColor = (c: string) => hasBorder ? updateBorder({ color: c }) : updateBorder({ color: c, mode: 'uniform', uniform: 10 })
  const clearBorder = () => updateBorder({ mode: 'uniform', uniform: 0, top: 0, right: 0, bottom: 0, left: 0 })
  const fmtRot = (r: number) => r === 0 ? '0°' : r > 0 ? `+${r}°` : `${r}°`
  const nearZoom = ZOOM_CHIPS.find(c => Math.abs(c.v - photo.zoom) < 0.05)

  return (
    <div className="flex h-full flex-col" style={{ background: '#fff' }}>
      {/* Tab bar — flush to top */}
      <div className="flex shrink-0 border-b-2" style={{ borderColor: BORDER }}>
        {TABS.map(({ key, Icon, label }) => {
          const active = tab === key
          return (
            <button key={key} onClick={() => setTab(key)}
              className="flex flex-1 flex-col items-center gap-1 border-b-[3px] py-3 text-[12px] font-medium transition-colors"
              style={{ borderBottomColor: active ? DARK : 'transparent', color: active ? DARK : FG, marginBottom: -2 }}>
              <Icon size={18} weight="regular" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {tab === 'rotate' && (
          <>
            <p className={SUB} style={{ color: FG }}>ROTATE 90°</p>
            <div className="flex gap-1.5">
              {[
                { fn: () => update({ rotation: photo.rotation - 90 }), Icon: ArrowCounterClockwiseIcon, accent: true },
                { fn: () => update({ rotation: photo.rotation + 90 }), Icon: ArrowClockwiseIcon, accent: true },
                { fn: () => update({ flipH: !photo.flipH }), Icon: FlipHorizontalIcon, accent: false },
                { fn: () => update({ flipH: !photo.flipH, rotation: (photo.rotation + 180) % 360 }), Icon: FlipHorizontalIcon, accent: false, rotate90: true },
              ].map(({ fn, Icon, accent, rotate90 }, i) => (
                <button key={i} onClick={fn} className="flex h-[38px] flex-1 items-center justify-center rounded-[8px] border-2 active:scale-95"
                  style={{ background: accent ? ACCENT : '#fff', borderColor: accent ? ACCENT_DARK : BORDER }}>
                  <Icon size={16} style={{ color: DARK, ...(rotate90 ? { transform: 'rotate(90deg)' } : {}) }} />
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 rounded-[12px] border-2 p-3" style={{ background: BG, borderColor: BORDER }}>
              <p className={SUB} style={{ color: FG }}>FINE ROTATION</p>
              <Stepper value={fmtRot(photo.rotation)}
                onMinus={() => update({ rotation: photo.rotation - 1 })}
                onPlus={() => update({ rotation: photo.rotation + 1 })} />
              <Chips opts={ROT_CHIPS} active={photo.rotation === 0 ? 0 : undefined}
                onSelect={v => v === 0 ? update({ rotation: 0 }) : update({ rotation: photo.rotation + v })} />
            </div>
          </>
        )}

        {tab === 'zoom' && (
          <div className="flex flex-col gap-2 rounded-[12px] border-2 p-3" style={{ background: BG, borderColor: BORDER }}>
            <p className={SUB} style={{ color: FG }}>ZOOM</p>
            <Stepper value={`${photo.zoom.toFixed(1)}×`}
              onMinus={() => update({ zoom: Math.max(0.5, parseFloat((photo.zoom - 0.1).toFixed(1))) })}
              onPlus={() => update({ zoom: Math.min(5, parseFloat((photo.zoom + 0.1).toFixed(1))) })} />
            <Chips opts={ZOOM_CHIPS} active={nearZoom?.v} onSelect={v => update({ zoom: v })} />
          </div>
        )}

        {tab === 'border' && (
          <>
            <div className="flex flex-col gap-2 rounded-[12px] border-2 p-3" style={{ background: BG, borderColor: BORDER }}>
              <p className={SUB} style={{ color: FG }}>BORDER WIDTH</p>
              <Stepper value={`${photo.border.uniform} px`}
                onMinus={() => updateBorder({ uniform: Math.max(0, photo.border.uniform - 1), mode: 'uniform' })}
                onPlus={() => updateBorder({ uniform: Math.min(40, photo.border.uniform + 1), mode: 'uniform' })} />
            </div>
            <div className="flex flex-col gap-2 rounded-[12px] border-2 p-3" style={{ background: BG, borderColor: BORDER }}>
              <p className={SUB} style={{ color: FG }}>BORDER COLOUR</p>
              <div className="flex flex-wrap gap-1.5">
                {SWATCHES.map(c => (
                  <button key={c} onClick={() => pickColor(c)} className="h-6 w-6 rounded-full border-[2.5px] transition-all"
                    style={{ backgroundColor: c, borderColor: photo.border.color === c && hasBorder ? DARK : 'transparent', boxShadow: c === '#ffffff' ? '0 0 0 1px #DEDEDE' : undefined }} />
                ))}
                <button onClick={clearBorder} className="flex h-6 w-6 items-center justify-center rounded-full border-2"
                  style={{ background: BG, borderColor: !hasBorder ? DARK : BORDER }}>
                  <XIcon size={10} style={{ color: FG }} weight="bold" />
                </button>
              </div>
            </div>
            {hasBorder && (
              <div className="flex flex-col gap-2 rounded-[12px] border-2 p-3" style={{ background: BG, borderColor: BORDER }}>
                <label className="flex cursor-pointer items-center gap-2 text-[12px]" style={{ color: DARK }}>
                  <input type="checkbox" checked={photo.border.mode === 'individual'} onChange={e => toggleIndividual(e.target.checked)} className="h-[18px] w-[18px] rounded" />
                  Control each side separately
                </label>
                {photo.border.mode === 'individual' && SIDE_KEYS.map(side => (
                  <div key={side} className="flex items-center gap-2">
                    <span className="w-12 text-[11px] font-medium capitalize" style={{ color: DARK }}>{side}</span>
                    <Stepper value={`${photo.border[side]} px`}
                      onMinus={() => setSide(side, Math.max(0, photo.border[side] - 1))}
                      onPlus={() => setSide(side, Math.min(200, photo.border[side] + 1))} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'text' && (
          <TextLayerPanel textLayers={photo.textLayers} onChange={layers => onChange({ ...photo, textLayers: layers })} />
        )}
      </div>
    </div>
  )
}
