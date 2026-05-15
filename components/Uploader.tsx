'use client'

import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { PlusIcon, UploadSimpleIcon, XIcon } from '@phosphor-icons/react'
import type { PhotoState } from '@/types/album'

interface Props {
  photos: PhotoState[]
  onChange: (photos: PhotoState[]) => void
}

function loadNaturalSize(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = () => resolve({ w: 0, h: 0 })
    img.src = url
  })
}

export default function Uploader({ photos, onChange }: Props) {
  const photosRef = useRef(photos)
  photosRef.current = photos
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const onDrop = useCallback(async (accepted: File[]) => {
    const added: PhotoState[] = []
    for (const file of accepted) {
      const objectUrl = URL.createObjectURL(file)
      const { w, h } = await loadNaturalSize(objectUrl)
      added.push({
        id: crypto.randomUUID(),
        file,
        objectUrl,
        naturalWidth: w,
        naturalHeight: h,
        zoom: 1,
        panX: 0,
        panY: 0,
        rotation: 0,
        flipH: false,
        border: {
          mode: 'uniform',
          uniform: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          color: '#ffffff',
        },
        textLayers: [],
      })
    }
    onChangeRef.current([...photosRef.current, ...added])
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  function remove(id: string) {
    const hit = photosRef.current.find((p) => p.id === id)
    if (hit) URL.revokeObjectURL(hit.objectUrl)
    onChangeRef.current(photosRef.current.filter((p) => p.id !== id))
  }

  const zoneClass = [
    'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[12px] border border-dashed p-8 text-center transition-colors sm:p-12',
    isDragReject
      ? 'border-red-400 bg-red-50 text-red-500'
      : isDragActive
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-(--color-border-secondary) bg-(--color-background-secondary) text-(--color-text-secondary) hover:border-primary hover:bg-primary/10 hover:text-primary',
  ].join(' ')

  if (photos.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div {...getRootProps()} className={zoneClass}>
          <input {...getInputProps()} />
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-(--color-background-primary) shadow-sm">
            <UploadSimpleIcon className="h-5 w-5" weight="light" />
          </div>
          <div>
            <p className="text-[14px] font-medium">
              {isDragActive ? 'Drop photos here' : 'Drop photos here or click to browse'}
            </p>
            <p className="mt-1 text-[12px] opacity-70">Accepts any image format</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-8">
      <div className="grid grid-cols-7 gap-1.5">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square">
            <img
              src={photo.objectUrl}
              alt={photo.file?.name ?? 'Photo'}
              className="h-full w-full rounded-[8px] object-cover"
            />
            <button
              onClick={() => remove(photo.id)}
              aria-label={`Remove ${photo.file?.name ?? 'photo'}`}
              className="absolute inset-0 flex items-center justify-center rounded-[8px] bg-transparent text-transparent transition-colors group-hover:bg-black/50 group-hover:text-white"
            >
              <XIcon className="h-4 w-4" weight="light" />
            </button>
          </div>
        ))}
        <div
          {...getRootProps()}
          className="aspect-square cursor-pointer flex items-center justify-center rounded-[8px] border border-dashed border-(--color-border-secondary) text-(--color-text-tertiary) transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
        >
          <input {...getInputProps()} />
          <PlusIcon className="h-5 w-5" weight="light" />
        </div>
      </div>
    </div>
  )
}
