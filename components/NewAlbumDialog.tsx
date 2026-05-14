'use client'

import { useEffect } from 'react'
import { WarningIcon, XIcon } from '@phosphor-icons/react'

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[3px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-album-title"
        className="relative mx-4 w-full max-w-[360px] rounded-[16px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-[6px] text-(--color-text-tertiary) transition-colors hover:bg-(--color-background-secondary) hover:text-(--color-text-secondary)"
        >
          <XIcon className="h-4 w-4" weight="light" />
        </button>

        {/* Icon badge */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-(--color-border-warning) bg-(--color-background-warning)">
          <WarningIcon className="h-5 w-5 text-(--color-text-warning)" weight="light" />
        </div>

        {/* Copy */}
        <h2 id="new-album-title" className="mb-1.5 text-[15px] font-medium tracking-[-0.02em] text-(--color-text-primary)">
          Start a new album?
        </h2>
        <p className="mb-6 text-[13px] leading-relaxed text-(--color-text-secondary)">
          {hasPhotos
            ? <>Your <strong className="font-medium text-(--color-text-primary)">{photoCount} photo{photoCount === 1 ? '' : 's'}</strong> and all settings will be cleared. This can't be undone.</>
            : 'All settings will be reset to defaults.'}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-[8px] border-[0.5px] border-(--color-border-tertiary) py-2 text-[13px] text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary) active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-[8px] bg-navy-800 py-2 text-[13px] font-medium text-white transition-colors hover:bg-navy-900 active:scale-[0.98]"
          >
            New album
          </button>
        </div>
      </div>
    </div>
  )
}
