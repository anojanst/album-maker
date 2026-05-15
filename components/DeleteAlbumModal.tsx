'use client'

import { useState } from 'react'
import { CircleNotchIcon } from '@phosphor-icons/react'

interface Props {
  albumId: string | null
  albumTitle: string
  onCancel: () => void
  onDeleted: (id: string) => void
}

export default function DeleteAlbumModal({ albumId, albumTitle, onCancel, onDeleted }: Props) {
  const [loading, setLoading] = useState(false)

  if (!albumId) return null

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/albums/${albumId}`, { method: 'DELETE' })
    setLoading(false)
    onDeleted(albumId!)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[360px] rounded-[16px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-6 shadow-xl">
        <p className="mb-1 text-[15px] font-medium tracking-[-0.02em] text-(--color-text-primary)">Delete album?</p>
        <p className="mb-5 text-[13px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">&ldquo;{albumTitle}&rdquo;</span> and all its photos will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-red-500 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {loading && <CircleNotchIcon className="h-3.5 w-3.5 animate-spin" weight="light" />}
            Delete
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-[8px] border-[0.5px] border-(--color-border-tertiary) px-4 py-2.5 text-[13px] text-(--color-text-secondary) transition-colors hover:bg-(--color-background-secondary) disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
