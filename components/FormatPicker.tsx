'use client'

import { PRINT_SIZES } from '@/lib/printSizes'
import type { AlbumConfig, PrintSize } from '@/types/album'

const DARK = '#3a1a18'
const PRIMARY = '#F4B8B0'
const SECONDARY = '#A8D4E8'
const BORDER = '#DEDEDE'
const FG_LIGHT = '#888888'
const BG = '#F6F5F9'

// Proportion rect sizes per spec (w × h in px)
const PROP_RECTS: Record<string, { w: number; h: number }> = {
  '4x6':  { w: 28, h: 20 },
  '5x7':  { w: 28, h: 22 },
  '6x8':  { w: 28, h: 26 },
  'A5':   { w: 20, h: 28 },
  'A4':   { w: 20, h: 28 },
  'sq10': { w: 24, h: 24 },
  'sq15': { w: 28, h: 28 },
}

const SUBLABEL = 'mb-2 text-[11px] font-medium uppercase tracking-[0.07em]'

interface Props {
  config: AlbumConfig
  onChange: (config: AlbumConfig) => void
}

export default function FormatPicker({ config, onChange }: Props) {
  const { printSizeId, orientation } = config

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      {/* FORMAT GRID */}
      <div>
        <p className={SUBLABEL} style={{ color: FG_LIGHT }}>SIZE</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {PRINT_SIZES.map((size: PrintSize) => {
            const selected = size.id === printSizeId
            const rect = PROP_RECTS[size.id] ?? { w: 24, h: 24 }
            return (
              <button
                key={size.id}
                onClick={() => onChange({ ...config, printSizeId: size.id })}
                className="flex items-center gap-3 rounded-[16px] border-2 px-3 py-3.5 text-left transition-colors"
                style={{
                  borderColor: selected ? DARK : BORDER,
                  background: selected ? PRIMARY : '#fff',
                }}
              >
                <div
                  className="shrink-0 rounded-[4px] border"
                  style={{
                    width: rect.w,
                    height: rect.h,
                    background: selected ? '#fff' : BORDER,
                    borderColor: selected ? 'rgba(58,26,24,0.3)' : '#C0C0C0',
                  }}
                />
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: DARK }}>{size.label}</p>
                  <p className="text-[11px]" style={{ color: selected ? '#7a3a35' : FG_LIGHT }}>
                    {size.mm.w} × {size.mm.h} mm
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ORIENTATION TOGGLE */}
      <div>
        <p className={SUBLABEL} style={{ color: FG_LIGHT }}>ORIENTATION</p>
        <div className="grid grid-cols-2 gap-2">
          {(['portrait', 'landscape'] as const).map((o) => {
            const selected = orientation === o
            const rectW = o === 'portrait' ? 32 : 44
            const rectH = o === 'portrait' ? 44 : 32
            return (
              <button
                key={o}
                onClick={() => onChange({ ...config, orientation: o })}
                className="flex flex-col items-center gap-2 rounded-[16px] border-2 px-4 py-4 transition-colors"
                style={{
                  borderColor: selected ? DARK : BORDER,
                  background: selected ? SECONDARY : '#fff',
                }}
              >
                <div
                  className="rounded-[5px] border"
                  style={{
                    width: rectW,
                    height: rectH,
                    background: selected ? '#fff' : BORDER,
                    borderColor: selected ? 'rgba(58,26,24,0.3)' : '#C0C0C0',
                  }}
                />
                <p className="text-[13px] font-semibold capitalize" style={{ color: DARK }}>{o}</p>
                <p className="text-[11px]" style={{ color: FG_LIGHT }}>
                  {o === 'portrait' ? 'Tall format' : 'Wide format'}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
