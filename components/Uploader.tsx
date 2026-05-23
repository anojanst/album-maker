'use client'

import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { PlusIcon, UploadSimpleIcon, XIcon } from '@phosphor-icons/react'
import type { PhotoState } from '@/types/album'

const DARK = '#3a1a18'
const ACCENT = '#F5E642'
const BORDER = '#DEDEDE'
const FG_LIGHT = '#888888'

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
        border: { mode: 'uniform', uniform: 0, top: 0, right: 0, bottom: 0, left: 0, color: '#F5E642' },
        textLayers: [],
      })
    }
    onChangeRef.current([...photosRef.current, ...added])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  function remove(id: string) {
    const hit = photosRef.current.find((p) => p.id === id)
    if (hit) URL.revokeObjectURL(hit.objectUrl)
    onChangeRef.current(photosRef.current.filter((p) => p.id !== id))
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div
          {...getRootProps()}
          className="w-full cursor-pointer rounded-[18px] px-4 py-7 text-center transition-colors"
          style={{
            border: `2.5px solid ${isDragActive ? ACCENT : DARK}`,
            background: isDragActive ? '#FFFDE0' : '#fff',
          }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex h-[52px] w-[52px] items-center justify-center"
              style={{ borderRadius: 15, background: ACCENT }}
            >
              <UploadSimpleIcon className="h-6 w-6" style={{ color: DARK }} weight="bold" />
            </div>
            <div>
              <p className="text-[15px] font-semibold" style={{ color: DARK }}>
                Tap to choose photos
              </p>
              <p className="mt-1 text-[12px]" style={{ color: FG_LIGHT }}>
                JPEG · PNG · HEIC · up to 50 files
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <div className="grid grid-cols-4 gap-1.5">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square">
            <img
              src={photo.objectUrl}
              alt={photo.file?.name ?? 'Photo'}
              className="h-full w-full object-cover"
              style={{ borderRadius: 12 }}
            />
            <button
              onClick={() => remove(photo.id)}
              aria-label={`Remove ${photo.file?.name ?? 'photo'}`}
              className="absolute right-1 top-1 flex items-center justify-center"
              style={{
                width: 17,
                height: 17,
                borderRadius: '50%',
                background: 'rgba(58,26,24,0.55)',
              }}
            >
              <XIcon className="h-[9px] w-[9px] text-white" weight="bold" />
            </button>
          </div>
        ))}
        {/* Add more tile */}
        <div
          {...getRootProps()}
          className="relative aspect-square cursor-pointer flex items-center justify-center transition-colors"
          style={{
            borderRadius: 12,
            border: `2px dashed ${BORDER}`,
            background: '#fff',
          }}
        >
          <input {...getInputProps()} />
          <PlusIcon className="h-5 w-5" style={{ color: FG_LIGHT }} weight="bold" />
        </div>
      </div>

      <p className="text-center text-[12px]" style={{ color: FG_LIGHT }}>
        {photos.length} photo{photos.length === 1 ? '' : 's'} selected
      </p>
    </div>
  )
}
