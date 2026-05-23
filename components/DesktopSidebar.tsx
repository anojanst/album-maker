'use client'

import type { AlbumConfig, PhotoState, PrintSize, Step } from '@/types/album'
import WebToolPanel from '@/components/WebToolPanel'

const DARK = '#3a1a18'
const FG = '#888'

const TIPS1 = [
  'Upload high-res photos for best print quality.',
  'You can reorder photos by dragging thumbnails.',
  'Nothing leaves your browser — all processing is local.',
]
const SIZE_GUIDE = [
  { name: '4×6"',   desc: 'The classic print size, fits standard frames.' },
  { name: '5×7"',   desc: 'Great for portraits and landscapes.' },
  { name: 'A4/A5',  desc: 'Ideal for home printing.' },
  { name: 'Square', desc: 'Perfect for Instagram-era phone photos.' },
]
const TIPS4 = [
  'For print shops: send the ZIP of PNG files.',
  'For home printing: use the PDF.',
  'Paper matters — use matte or gloss photo paper.',
]

interface Props {
  step: Step
  photos: PhotoState[]
  printSize: PrintSize
  config: AlbumConfig
  activePhoto: PhotoState | null
  onPhotoChange: (p: PhotoState) => void
}

export default function DesktopSidebar({ step, activePhoto, onPhotoChange }: Props) {
  if (step === 3) {
    if (!activePhoto) return null
    return (
      <div className="flex h-full flex-col">
        <WebToolPanel photo={activePhoto} onChange={onPhotoChange} />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      {step === 1 && (
        <>
          <p className="text-[13px] font-semibold" style={{ color: DARK }}>Tips</p>
          <ul className="flex flex-col gap-2">
            {TIPS1.map(t => (
              <li key={t} className="text-[12px] leading-[1.6]" style={{ color: FG }}>{t}</li>
            ))}
          </ul>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-[13px] font-semibold" style={{ color: DARK }}>Which size?</p>
          <ul className="flex flex-col gap-2">
            {SIZE_GUIDE.map(({ name, desc }) => (
              <li key={name} className="text-[12px] leading-[1.6]" style={{ color: FG }}>
                <span className="font-semibold" style={{ color: DARK }}>{name}</span> — {desc}
              </li>
            ))}
          </ul>
        </>
      )}

      {step === 4 && (
        <>
          <p className="text-[13px] font-semibold" style={{ color: '#1a2a3a' }}>Print tips</p>
          <ul className="flex flex-col gap-2">
            {TIPS4.map(t => (
              <li key={t} className="text-[12px] leading-[1.6]" style={{ color: FG }}>{t}</li>
            ))}
          </ul>

          {/* Sign-in card */}
          <div className="mt-auto flex flex-col gap-2 rounded-[10px] p-3"
            style={{ background: '#E8F5EC', border: '2px solid #7FE4A0' }}>
            <p className="text-[12px] font-semibold" style={{ color: '#1a4a28' }}>Save your album</p>
            <p className="text-[11px] leading-[1.4]" style={{ color: '#2d6e3a' }}>
              Sign in to save this album and come back to edit it later.
            </p>
            <a href="/api/auth/sign-in"
              className="flex h-8 items-center justify-center rounded-[8px] text-[12px] font-semibold text-white"
              style={{ background: '#2d6e3a' }}>
              Sign in to save
            </a>
          </div>
        </>
      )}
    </div>
  )
}
