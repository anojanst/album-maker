'use client'

import { useEffect, useRef } from 'react'
import type { PhotoState } from '@/types/album'

const DARK = '#3a1a18'

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
    <div className="flex shrink-0 gap-1.5 overflow-x-auto pb-0.5">
      {photos.map((photo, i) => {
        const active = i === currentIndex
        return (
          <button
            key={photo.id}
            ref={active ? activeRef : null}
            onClick={() => onSelect(i)}
            className="relative shrink-0 overflow-hidden transition-all focus-visible:outline-none"
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              border: active ? `2.5px solid ${DARK}` : '2.5px solid transparent',
              opacity: active ? 1 : 0.6,
            }}
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
