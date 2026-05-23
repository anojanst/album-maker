'use client'

import { useEffect } from 'react'
import { WarningIcon, XIcon } from '@phosphor-icons/react'

const DARK = '#3a1a18'
const BORDER = '#DEDEDE'
const FG = '#525252'
const FG_LIGHT = '#888888'

interface Props {
  isOpen: boolean
  photoCount: number
  onConfirm: () => void
  onCancel: () => void
}

export default function NewAlbumDialog({ isOpen, photoCount, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel, onConfirm])

  if (!isOpen) return null

  const hasPhotos = photoCount > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[3px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-album-title"
        className="relative w-full max-w-[360px] rounded-[16px] p-6 shadow-2xl"
        style={{ background: '#fff', border: `2px solid ${BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-[8px] transition-colors hover:bg-gray-100"
        >
          <XIcon className="h-4 w-4" style={{ color: FG_LIGHT }} weight="light" />
        </button>

        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px]"
          style={{ background: '#FFF8E1', border: `2px solid #F5C842` }}
        >
          <WarningIcon className="h-5 w-5" style={{ color: '#7a5a00' }} weight="light" />
        </div>

        <h2 id="new-album-title" className="mb-1.5 text-[15px] font-semibold" style={{ color: DARK }}>
          Start a new album?
        </h2>
        <p className="mb-6 text-[13px] leading-relaxed" style={{ color: FG }}>
          {hasPhotos
            ? <><strong className="font-semibold" style={{ color: DARK }}>{photoCount} photo{photoCount === 1 ? '' : 's'}</strong> and all settings will be cleared. This can&apos;t be undone.</>
            : 'All settings will be reset to defaults.'}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-[10px] py-2 text-[13px] transition-colors active:scale-[0.98]"
            style={{ border: `2px solid ${BORDER}`, color: FG, background: '#fff' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-[10px] py-2 text-[13px] font-semibold text-white transition-colors active:scale-[0.98]"
            style={{ background: DARK }}
          >
            New album
          </button>
        </div>
      </div>
    </div>
  )
}
