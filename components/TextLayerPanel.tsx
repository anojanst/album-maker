'use client'

import { PlusIcon, PencilSimpleIcon, TrashIcon, MinusIcon } from '@phosphor-icons/react'
import type { TextLayer } from '@/types/album'

export const FONTS = [
  'Inter', 'Playfair Display', 'Lora', 'Montserrat', 'Merriweather',
  'Dancing Script', 'Pacifico', 'Oswald', 'Raleway', 'Crimson Text',
]

const TEXT_COLORS = [
  '#ffffff', '#000000', '#f5f0e8', '#c8a97e',
  '#f87171', '#7dd3fc', '#86efac', '#fbbf24',
]

const DARK = '#3a1a18'
const ACCENT = '#F5E642'
const ACCENT_DARK = '#C8BB00'
const BORDER = '#DEDEDE'
const FG_LIGHT = '#888888'
const BG = '#F6F5F9'

interface Props {
  textLayers: TextLayer[]
  onChange: (layers: TextLayer[]) => void
}

export default function TextLayerPanel({ textLayers, onChange }: Props) {
  const selected = textLayers.find(l => l.selected) ?? null

  function add() {
    onChange([
      ...textLayers.map(l => ({ ...l, selected: false })),
      { id: crypto.randomUUID(), content: 'Your text here', x: 0.5, y: 0.5, fontSize: 48, fontFamily: 'Inter', color: '#ffffff', selected: true },
    ])
  }

  function remove(id: string) {
    onChange(textLayers.filter(l => l.id !== id))
  }

  function select(id: string) {
    onChange(textLayers.map(l => ({ ...l, selected: l.id === id })))
  }

  function patch(p: Partial<TextLayer>) {
    if (!selected) return
    onChange(textLayers.map(l => l.id === selected.id ? { ...l, ...p } : l))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Add text button */}
      <button
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-dashed py-4 transition-colors"
        style={{ borderColor: BORDER, background: BG }}
      >
        <PlusIcon className="h-[18px] w-[18px]" style={{ color: DARK }} weight="bold" />
        <span className="text-[14px] font-medium" style={{ color: DARK }}>Add text</span>
      </button>

      {/* Layer list */}
      {textLayers.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {textLayers.map(layer => (
            <div
              key={layer.id}
              onClick={() => select(layer.id)}
              className="flex cursor-pointer items-center gap-2 rounded-[12px] border-2 px-3 py-2.5"
              style={{
                borderColor: layer.selected ? DARK : BORDER,
                background: layer.selected ? ACCENT : '#fff',
              }}
            >
              <PencilSimpleIcon className="h-3.5 w-3.5 shrink-0" style={{ color: DARK }} weight="light" />
              <span className="flex-1 truncate text-[12px] font-medium" style={{ color: DARK }}>
                {layer.content}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); remove(layer.id) }}
                className="shrink-0 transition-colors"
                title="Delete layer"
              >
                <TrashIcon className="h-4 w-4" style={{ color: FG_LIGHT }} weight="light" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selected layer controls */}
      {selected && (
        <div
          className="flex flex-col gap-3 rounded-[12px] border-2 p-3"
          style={{ borderColor: BORDER, background: '#fff' }}
        >
          <input
            type="text"
            value={selected.content}
            onChange={(e) => patch({ content: e.target.value })}
            className="w-full rounded-[8px] border-2 px-3 py-2 text-[13px] outline-none"
            style={{ borderColor: BORDER, color: DARK }}
            placeholder="Layer text"
          />
          <select
            value={selected.fontFamily}
            onChange={(e) => patch({ fontFamily: e.target.value })}
            className="w-full rounded-[8px] border-2 px-3 py-2 text-[12px] outline-none"
            style={{ borderColor: BORDER, color: DARK }}
          >
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {/* Size stepper */}
          <div className="flex items-center gap-2">
            <span className="w-10 text-[11px] font-medium uppercase tracking-wide" style={{ color: FG_LIGHT }}>Size</span>
            <div
              className="flex flex-1 overflow-hidden rounded-[10px] border-2"
              style={{ background: BG, borderColor: BORDER }}
            >
              <button
                onClick={() => patch({ fontSize: Math.max(8, selected.fontSize - 4) })}
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-white"
              >
                <MinusIcon className="h-4 w-4" style={{ color: DARK }} weight="bold" />
              </button>
              <div
                className="flex flex-1 items-center justify-center border-x-2 text-[14px] font-semibold"
                style={{ color: DARK, borderColor: BORDER }}
              >
                {selected.fontSize} pt
              </div>
              <button
                onClick={() => patch({ fontSize: Math.min(500, selected.fontSize + 4) })}
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-white"
              >
                <PlusIcon className="h-4 w-4" style={{ color: DARK }} weight="bold" />
              </button>
            </div>
          </div>

          {/* Colour swatches */}
          <div className="flex flex-wrap gap-1.5">
            {TEXT_COLORS.map(color => (
              <button
                key={color}
                title={color}
                onClick={() => patch({ color })}
                className="h-[22px] w-[22px] rounded-full border-[2.5px] transition-all"
                style={{
                  backgroundColor: color,
                  borderColor: selected.color === color ? DARK : 'transparent',
                  boxShadow: color === '#ffffff' ? '0 0 0 1px #DEDEDE' : undefined,
                }}
              />
            ))}
            <input
              type="color"
              value={selected.color.startsWith('#') && selected.color.length === 7 ? selected.color : '#ffffff'}
              onChange={(e) => patch({ color: e.target.value })}
              className="h-[22px] w-[22px] cursor-pointer rounded-full border-none bg-transparent p-0"
              title="Custom color"
            />
          </div>
        </div>
      )}
    </div>
  )
}
