'use client'

import { useEffect, useRef } from 'react'
import type { PhotoState } from '@/types/album'

interface Props {
  photos: PhotoState[]
  currentIndex: number
  onSelect: (index: number) => void
}

export default function PhotoStrip({ photos, currentIndex, onSelect }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [currentIndex])

  return (
    <div className="flex shrink-0 gap-1.5 overflow-x-auto">
      {photos.map((photo, i) => {
        const active = i === currentIndex
        return (
          <button
            key={photo.id}
            ref={active ? activeRef : null}
            onClick={() => onSelect(i)}
            className={[
              'relative h-12.5 w-12.5 shrink-0 overflow-hidden rounded-[7px] border-2 transition-all focus-visible:outline-none',
              active
                ? 'border-primary'
                : 'border-transparent opacity-60 hover:opacity-100',
            ].join(' ')}
            aria-label={`Photo ${i + 1}`}
            aria-current={active ? 'true' : undefined}
          >
            <img
              src={photo.objectUrl}
              alt={photo.file?.name ?? 'Photo'}
              className="h-full w-full object-cover"
            />
          </button>
        )
      })}
    </div>
  )
}
