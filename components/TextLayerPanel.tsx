'use client'

import { PlusIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { TextLayer } from '@/types/album'

export const FONTS = [
  'Inter', 'Playfair Display', 'Lora', 'Montserrat', 'Merriweather',
  'Dancing Script', 'Pacifico', 'Oswald', 'Raleway', 'Crimson Text',
]

const TEXT_COLORS = [
  '#ffffff', '#000000', '#f5f0e8', '#c8a97e',
  '#f87171', '#7dd3fc', '#86efac', '#fbbf24',
]

const FIELD_LABEL = 'flex-1 text-[12px] text-(--color-text-secondary)'
const NUM_INPUT = 'w-16 rounded-[6px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) px-2.5 py-1.5 text-right text-[12px] text-(--color-text-secondary) focus:outline-none focus:border-(--color-border-primary)'
const UNIT = 'w-4 shrink-0 text-[11px] text-(--color-text-tertiary)'

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
    <div className="flex flex-col gap-2">
      <button
        onClick={add}
        className="flex h-7 w-full items-center justify-center gap-1.5 rounded-[7px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) text-[12px] text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary)"
      >
        <PlusIcon className="h-3 w-3" weight="bold" /> Add text
      </button>

      {textLayers.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {textLayers.map(layer => (
            <div
              key={layer.id}
              onClick={() => select(layer.id)}
              className={[
                'flex cursor-pointer items-center gap-1 rounded-[6px] px-2 py-1.5 text-[11px]',
                layer.selected
                  ? 'bg-navy-50 text-navy-800'
                  : 'text-(--color-text-secondary) hover:bg-(--color-background-secondary)',
              ].join(' ')}
            >
              <PencilSimpleIcon className="h-3 w-3 shrink-0 opacity-50" weight="light" />
              <span className="flex-1 truncate">{layer.content}</span>
              <button
                onClick={(e) => { e.stopPropagation(); remove(layer.id) }}
                className="shrink-0 text-(--color-text-tertiary) transition-colors hover:text-red-400"
                title="Delete layer"
              >
                <TrashIcon className="h-3.5 w-3.5" weight="light" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="flex flex-col gap-2 border-t-[0.5px] border-(--color-border-tertiary) pt-2">
          <input
            type="text"
            value={selected.content}
            onChange={(e) => patch({ content: e.target.value })}
            className="w-full rounded-[6px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) px-2.5 py-1.5 text-[12px] text-(--color-text-secondary) focus:outline-none focus:border-(--color-border-primary)"
            placeholder="Layer text"
          />
          <select
            value={selected.fontFamily}
            onChange={(e) => patch({ fontFamily: e.target.value })}
            className="w-full rounded-[6px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) px-2.5 py-1.5 text-[12px] text-(--color-text-secondary) focus:outline-none"
          >
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <span className={FIELD_LABEL}>Size</span>
            <input
              type="number"
              min={8}
              max={500}
              step={4}
              value={selected.fontSize}
              onChange={(e) => patch({ fontSize: Math.max(8, parseInt(e.target.value) || 48) })}
              className={NUM_INPUT}
            />
            <span className={UNIT}>pt</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEXT_COLORS.map(color => (
              <button
                key={color}
                title={color}
                onClick={() => patch({ color })}
                style={{ backgroundColor: color }}
                className={[
                  'h-[22px] w-[22px] rounded-full transition-all',
                  selected.color === color
                    ? 'outline-2 outline-offset-1 outline-navy-800 scale-110'
                    : color === '#ffffff'
                      ? 'ring-1 ring-(--color-border-tertiary) hover:scale-110'
                      : 'hover:scale-110',
                ].join(' ')}
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
