'use client'

import { WarningIcon, ArchiveIcon, ImageIcon, FilePdfIcon } from '@phosphor-icons/react'
import type { PhotoState, PrintSize, Orientation, ExportType } from '@/types/album'

const DARK = '#3a1a18'
const ACCENT = '#F5E642'
const BORDER = '#DEDEDE'
const FG_LIGHT = '#888888'
const PRIMARY = '#F4B8B0'

const FORMAT_CARDS: { type: ExportType; label: string; subtitle: string; Icon: React.ElementType }[] = [
  { type: 'png', label: 'Photo (PNG)',       subtitle: 'Current photo only · best quality', Icon: ImageIcon   },
  { type: 'zip', label: 'All photos (ZIP)',   subtitle: 'Every photo as a PNG file',         Icon: ArchiveIcon },
  { type: 'pdf', label: 'PDF document',       subtitle: 'All photos in one file',            Icon: FilePdfIcon },
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

export default function ExportScreen({
  selectedFormat, onFormatChange,
  termsAccepted, onTermsChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Warning box */}
      <div
        className="rounded-[14px] border-2 p-[14px]"
        style={{ background: '#FFF8E1', borderColor: '#F5C842' }}
      >
        <div className="mb-2 flex items-center gap-2">
          <WarningIcon className="h-[14px] w-[14px] shrink-0" style={{ color: '#7a5a00' }} weight="fill" />
          <span className="text-[13px] font-semibold" style={{ color: '#7a5a00' }}>
            Before you print
          </span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {[
            'Colour profiles may vary between your screen and printer — printed colours may differ.',
            'Check photo resolution warnings shown in the editor if any appeared.',
            'PNG gives the best print quality; PDF is convenient for multi-photo orders.',
          ].map((text) => (
            <li key={text} className="flex items-start gap-2 text-[12px] leading-[1.4]" style={{ color: '#7a5a00' }}>
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#7a5a00', marginTop: 5 }} />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Format cards */}
      <div className="flex flex-col gap-2">
        {FORMAT_CARDS.map(({ type, label, subtitle, Icon }) => {
          const selected = selectedFormat === type
          return (
            <button
              key={type}
              onClick={() => onFormatChange(type)}
              className="flex items-center gap-[14px] rounded-[16px] border-2 p-4 text-left transition-colors"
              style={{
                borderColor: selected ? DARK : BORDER,
                background: selected ? PRIMARY : '#fff',
              }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
                style={{ background: selected ? '#fff' : ACCENT }}
              >
                <Icon className="h-[22px] w-[22px]" style={{ color: DARK }} weight="bold" />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: DARK }}>{label}</p>
                <p className="text-[12px]" style={{ color: FG_LIGHT }}>{subtitle}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* T&Cs */}
      <div
        className="flex flex-col gap-2.5 border-t-2 pt-3"
        style={{ borderColor: BORDER }}
      >
        <label className="flex cursor-pointer items-start gap-2.5 text-[12px]" style={{ color: '#525252' }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-px h-4 w-4 shrink-0"
          />
          <span>
            I&apos;ve read the{' '}
            <a href="/terms" className="font-medium underline" style={{ color: '#5AAAC8' }}>
              terms &amp; conditions
            </a>
            {' '}— when I save an album, my photos are stored securely and I can delete them at any time.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-[12px]" style={{ color: '#525252' }}>
          <input type="checkbox" className="mt-px h-4 w-4 shrink-0" />
          <span>
            I agree to the{' '}
            <a href="/privacy" className="font-medium underline" style={{ color: '#5AAAC8' }}>
              privacy policy
            </a>
            .
          </span>
        </label>
      </div>
    </div>
  )
}
