'use client'

import { useEffect } from 'react'
import { WarningIcon, DownloadSimpleIcon, InfoIcon } from '@phosphor-icons/react'

interface Props {
  isOpen: boolean
  warning: string | null
  onCancel: () => void
  onConfirm: () => void
}

export default function RiskWarning({ isOpen, warning, onCancel, onConfirm }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rw-title"
        className="w-full max-w-md rounded-[16px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="rw-title" className="text-[18px] font-medium tracking-[-0.02em] text-(--color-text-primary)">
          Before you download
        </h2>

        <ul className="mt-4 space-y-3 text-[13px] text-(--color-text-secondary)">
          <li className="flex items-start gap-3">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" weight="light" />
            <span>
              Colour profiles may vary between your screen and printer — printed colours may look different from what you see.
            </span>
          </li>
          {warning && (
            <li className="flex items-start gap-3">
              <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-text-warning)" weight="light" />
              <span>{warning}</span>
            </li>
          )}
          <li className="flex items-start gap-3">
            <DownloadSimpleIcon className="mt-0.5 h-4 w-4 shrink-0 text-pteal-600" weight="light" />
            <span>
              We recommend <strong>PNG</strong> for the best print quality. PDF is convenient for multi-photo orders.
            </span>
          </li>
        </ul>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-[8px] border-[0.5px] border-(--color-border-tertiary) px-4 py-2 text-[13px] text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary)"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-[8px] bg-pteal-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-pteal-400 active:scale-[0.98]"
          >
            Download anyway
          </button>
        </div>
      </div>
    </div>
  )
}
