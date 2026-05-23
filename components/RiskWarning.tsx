'use client'

import { useEffect } from 'react'
import { WarningIcon, DownloadSimpleIcon, InfoIcon } from '@phosphor-icons/react'

const DARK = '#3a1a18'
const SUCCESS = '#2d6e3a'
const BORDER = '#DEDEDE'
const FG = '#525252'

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
        className="w-full max-w-md rounded-[16px] p-6 shadow-xl"
        style={{ background: '#fff', border: `2px solid ${BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="rw-title" className="text-[18px] font-semibold" style={{ color: DARK }}>
          Before you download
        </h2>

        <ul className="mt-4 space-y-3 text-[13px]" style={{ color: FG }}>
          <li className="flex items-start gap-3">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: DARK }} weight="light" />
            <span>
              Colour profiles may vary between your screen and printer — printed colours may look different from what you see.
            </span>
          </li>
          {warning && (
            <li className="flex items-start gap-3">
              <WarningIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#7a5a00' }} weight="light" />
              <span style={{ color: '#7a5a00' }}>{warning}</span>
            </li>
          )}
          <li className="flex items-start gap-3">
            <DownloadSimpleIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: SUCCESS }} weight="light" />
            <span>
              We recommend <strong>PNG</strong> for the best print quality. PDF is convenient for multi-photo orders.
            </span>
          </li>
        </ul>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-[10px] px-4 py-2 text-[13px] transition-colors"
            style={{ border: `2px solid ${BORDER}`, color: FG, background: '#fff' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white transition-colors active:scale-[0.98]"
            style={{ background: SUCCESS }}
          >
            Download anyway
          </button>
        </div>
      </div>
    </div>
  )
}
