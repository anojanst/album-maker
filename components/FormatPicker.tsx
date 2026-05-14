'use client'

import { PRINT_SIZES } from '@/lib/printSizes'
import type { AlbumConfig, Orientation, PrintSize } from '@/types/album'

interface Props {
  config: AlbumConfig
  onChange: (config: AlbumConfig) => void
}

function thumbSize(size: PrintSize): { w: number; h: number } {
  const MAX = 44
  const ratio = size.mm.w / size.mm.h
  return ratio >= 1
    ? { w: MAX, h: Math.round(MAX / ratio) }
    : { w: Math.round(MAX * ratio), h: MAX }
}

const SUBLABEL = 'mb-3 text-[11px] font-normal uppercase tracking-[0.06em] text-(--color-text-tertiary)'

const CARD = (selected: boolean) =>
  ['flex flex-col items-center gap-2 rounded-[10px] border p-[14px_10px_12px] text-center transition-colors',
    selected
      ? 'border-[1.5px] border-primary bg-primary/10 text-primary'
      : 'border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) text-(--color-text-primary) hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary)',
  ].join(' ')

export default function FormatPicker({ config, onChange }: Props) {
  const { printSizeId, orientation } = config

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 overflow-y-auto p-4 sm:gap-8 sm:p-8">
      <div>
        <p className={SUBLABEL}>Size</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRINT_SIZES.map((size) => {
            const selected = size.id === printSizeId
            const { w, h } = thumbSize(size)
            return (
              <button
                key={size.id}
                onClick={() => onChange({ ...config, printSizeId: size.id })}
                className={CARD(selected)}
              >
                <div className="flex h-14 w-14 items-center justify-center">
                  <div
                    className={['rounded-sm border', selected ? 'border-primary/30 bg-primary/20' : 'border-(--color-border-secondary) bg-(--color-background-secondary)'].join(' ')}
                    style={{ width: w, height: h }}
                  />
                </div>
                <span className={['text-[12px] font-medium', selected ? 'text-primary' : ''].join(' ')}>
                  {size.label}
                </span>
                <span className="text-[11px] text-(--color-text-tertiary)">
                  {size.mm.w} × {size.mm.h} mm
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className={SUBLABEL}>Orientation</p>
        <div className="grid grid-cols-2 gap-2 sm:w-80">
          {(['portrait', 'landscape'] as const).map((o) => {
            const selected = orientation === o
            return (
              <button
                key={o}
                onClick={() => onChange({ ...config, orientation: o })}
                className={CARD(selected)}
              >
                <div className={['flex h-8 w-8 items-center justify-center rounded-[6px] border', selected ? 'border-primary/30 bg-primary/20' : 'border-(--color-border-secondary) bg-(--color-background-secondary)'].join(' ')}>
                  <div className={['rounded-sm border-2 border-current', o === 'portrait' ? 'h-4 w-3' : 'h-3 w-4'].join(' ')} />
                </div>
                <div>
                  <p className={['text-[13px] font-medium capitalize', selected ? 'text-primary' : 'text-(--color-text-primary)'].join(' ')}>{o}</p>
                  <p className="text-[11px] text-(--color-text-tertiary)">
                    {o === 'portrait' ? 'Tall format' : 'Wide format'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
