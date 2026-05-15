'use client'

import { WarningIcon, ArchiveIcon, ImageIcon, FilePdfIcon } from '@phosphor-icons/react'
import type { PhotoState, PrintSize, Orientation } from '@/types/album'
import type { ExportType } from '@/app/page'

const FORMAT_CARDS: { type: ExportType; label: string; subtitle: string; Icon: React.ElementType }[] = [
  { type: 'png', label: 'Photo (PNG)', subtitle: 'Current photo only · best quality', Icon: ImageIcon },
  { type: 'zip', label: 'All photos (ZIP)', subtitle: 'Every photo as a PNG file', Icon: ArchiveIcon },
  { type: 'pdf', label: 'PDF document', subtitle: 'All photos in one file', Icon: FilePdfIcon },
]

interface Props {
  photos: PhotoState[]
  printSize: PrintSize
  orientation: Orientation
  selectedFormat: ExportType
  onFormatChange: (f: ExportType) => void
  termsAccepted: boolean
  onTermsChange: (v: boolean) => void
}

export default function ExportScreen({ photos, printSize, orientation, selectedFormat, onFormatChange, termsAccepted, onTermsChange }: Props) {
  const mmW = orientation === 'landscape' ? printSize.mm.w : printSize.mm.h
  const mmH = orientation === 'landscape' ? printSize.mm.h : printSize.mm.w

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 overflow-y-auto p-6">
      {/* Summary */}
      <p className="text-[13px] text-(--color-text-secondary)">
        {photos.length} photo{photos.length === 1 ? '' : 's'} · {printSize.label} {mmW}×{mmH} mm · <span className="capitalize">{orientation}</span> · ready to export
      </p>

      {/* Warning box */}
      <div className="rounded-[10px] border-[0.5px] border-(--color-border-warning) bg-(--color-background-warning) p-4">
        <div className="mb-2 flex items-center gap-2">
          <WarningIcon className="h-3.5 w-3.5 text-(--color-text-warning)" weight="light" />
          <span className="text-[12px] font-medium text-(--color-text-warning)">
            A few things to know before printing
          </span>
        </div>
        <ul className="space-y-1.5 text-[11px] text-(--color-text-warning)">
          <li className="flex items-start gap-2">
            <span className="mt-px">·</span>
            Colour profiles may vary between your screen and printer — printed colours may differ from what you see.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px">·</span>
            Check photo resolution warnings shown in the editor if any appeared.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px">·</span>
            PNG gives the best print quality; PDF is convenient for multi-photo print orders.
          </li>
        </ul>
      </div>

      {/* Format cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {FORMAT_CARDS.map(({ type, label, subtitle, Icon }) => {
          const selected = selectedFormat === type
          return (
            <button
              key={type}
              onClick={() => onFormatChange(type)}
              className={[
                'flex flex-col items-start gap-3 rounded-[12px] border p-4 text-left transition-colors',
                selected
                  ? 'border-[1.5px] border-primary bg-primary/10'
                  : 'border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary)',
              ].join(' ')}
            >
              <div className={[
                'flex h-9 w-9 items-center justify-center rounded-[8px]',
                selected ? 'bg-primary/20 text-primary' : 'bg-(--color-background-secondary) text-(--color-text-secondary)',
              ].join(' ')}>
                <Icon className="h-4.5 w-4.5" weight="light" />
              </div>
              <div>
                <p className={['text-[13px] font-medium', selected ? 'text-primary' : 'text-(--color-text-primary)'].join(' ')}>
                  {label}
                </p>
                <p className="mt-0.5 text-[11px] text-(--color-text-tertiary)">{subtitle}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* T&Cs */}
      <div className="flex flex-col gap-2.5 border-t border-(--color-border-tertiary) pt-4">
        <label className="flex cursor-pointer items-start gap-2.5 text-[12px] text-(--color-text-secondary)">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-px h-3.5 w-3.5 accent-primary"
          />
          <span>
            I&apos;ve read the{' '}
            <a href="/terms" className="text-primary underline">terms &amp; conditions</a>
            {' '}— when I save an album, my photos are stored securely in Cloudflare R2 and my settings are saved to the database. I can delete my albums and all data at any time from my dashboard.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-[12px] text-(--color-text-secondary)">
          <input type="checkbox" className="mt-px h-3.5 w-3.5 accent-primary" />
          <span>
            I agree to the{' '}
            <a href="/privacy" className="text-primary underline">privacy policy</a>.
          </span>
        </label>
      </div>
    </div>
  )
}
