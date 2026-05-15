'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PencilSimpleIcon, TrashIcon, CheckIcon } from '@phosphor-icons/react'

interface AlbumCardProps {
  id: string
  title: string
  printSizeId: string
  orientation: string
  photoCount: number
  firstPhotoKey: string | null
  updatedAt: string
  onDelete: (id: string) => void
}

export default function AlbumCard({
  id,
  title,
  printSizeId,
  orientation,
  photoCount,
  firstPhotoKey,
  updatedAt,
  onDelete,
}: AlbumCardProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const [currentTitle, setCurrentTitle] = useState(title)

  const thumbUrl = firstPhotoKey ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${firstPhotoKey}` : null
  const date = new Date(updatedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })

  async function saveTitle() {
    if (!draft.trim() || draft === currentTitle) { setEditing(false); return }
    await fetch(`/api/albums/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: draft }),
    })
    setCurrentTitle(draft)
    setEditing(false)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-[12px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) transition-colors hover:border-(--color-border-secondary)">
      {/* Thumbnail */}
      <a href={`/album/${id}`} className="relative block aspect-[4/3] overflow-hidden bg-(--color-background-secondary)">
        {thumbUrl ? (
          <Image src={thumbUrl} alt={currentTitle} fill className="object-cover transition-transform group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-(--color-text-tertiary)">No photos</div>
        )}
      </a>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3.5">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditing(false) }}
              className="flex-1 rounded-[6px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-secondary) px-2 py-1 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-border-primary)"
            />
            <button onClick={saveTitle} className="rounded-[6px] bg-navy-800 p-1 text-white hover:bg-navy-600">
              <CheckIcon className="h-3.5 w-3.5" weight="bold" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[13px] font-medium text-(--color-text-primary)">{currentTitle}</p>
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => { setDraft(currentTitle); setEditing(true) }}
                className="rounded-[6px] border-[0.5px] border-(--color-border-tertiary) p-1 text-(--color-text-tertiary) hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary)"
              >
                <PencilSimpleIcon className="h-3.5 w-3.5" weight="light" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="rounded-[6px] border-[0.5px] border-(--color-border-tertiary) p-1 text-(--color-text-tertiary) hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <TrashIcon className="h-3.5 w-3.5" weight="light" />
              </button>
            </div>
          </div>
        )}

        <p className="text-[11px] text-(--color-text-tertiary)">
          {printSizeId} · {orientation} · {photoCount} photo{photoCount === 1 ? '' : 's'} · {date}
        </p>
      </div>
    </div>
  )
}
