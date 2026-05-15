'use client'

import { useState } from 'react'
import { CircleNotchIcon, CheckCircleIcon } from '@phosphor-icons/react'
import type { PhotoState, AlbumConfig } from '@/types/album'

interface Props {
  isOpen: boolean
  photos: PhotoState[]
  config: AlbumConfig
  onClose: () => void
}

type SaveState = 'idle' | 'saving' | 'done' | 'error'

export default function SaveAlbumModal({ isOpen, photos, config, onClose }: Props) {
  const [title, setTitle] = useState('My album')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  async function handleSave() {
    setSaveState('saving')
    setProgress(0)
    try {
      const albumRes = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, printSizeId: config.printSizeId, orientation: config.orientation }),
      })
      if (!albumRes.ok) throw new Error('Failed to create album')
      const album = await albumRes.json()

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        if (!photo.file) continue

        const signRes = await fetch('/api/upload/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: photo.file.name, contentType: photo.file.type }),
        })
        if (!signRes.ok) throw new Error('Failed to get upload URL')
        const { url, key } = await signRes.json()

        const uploadRes = await fetch(url, {
          method: 'PUT',
          body: photo.file,
          headers: { 'Content-Type': photo.file.type },
        })
        if (!uploadRes.ok) throw new Error('Failed to upload photo')

        await fetch(`/api/albums/${album.id}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            r2Key: key,
            order: i,
            zoom: photo.zoom,
            panX: photo.panX,
            panY: photo.panY,
            rotation: photo.rotation,
            border: photo.border,
            textLayers: photo.textLayers,
          }),
        })

        setProgress(Math.round(((i + 1) / photos.length) * 100))
      }

      setSaveState('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setSaveState('error')
    }
  }

  function handleClose() {
    setSaveState('idle')
    setProgress(0)
    setErrorMsg('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[380px] rounded-[16px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-6 shadow-xl">
        {saveState === 'done' ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <CheckCircleIcon className="h-10 w-10 text-pteal-400" weight="light" />
            <p className="text-[15px] font-medium tracking-[-0.02em] text-(--color-text-primary)">Album saved!</p>
            <p className="text-[13px] text-(--color-text-secondary)">
              Your album is saved to your dashboard and can be edited any time.
            </p>
            <div className="mt-2 flex gap-2.5">
              <a
                href="/dashboard"
                className="rounded-[8px] bg-navy-800 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-navy-600"
              >
                Go to dashboard
              </a>
              <button
                onClick={handleClose}
                className="rounded-[8px] border-[0.5px] border-(--color-border-tertiary) px-4 py-2 text-[13px] text-(--color-text-secondary) transition-colors hover:bg-(--color-background-secondary)"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-1 text-[15px] font-medium tracking-[-0.02em] text-(--color-text-primary)">Save album</p>
            <p className="mb-5 text-[13px] text-(--color-text-secondary)">
              Give your album a name and we&apos;ll save it to your account so you can come back and edit it later.
            </p>

            <label className="mb-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-(--color-text-tertiary)">Album name</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saveState === 'saving'}
                className="rounded-[8px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-secondary) px-3 py-2.5 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-border-primary) disabled:opacity-60"
              />
            </label>

            {saveState === 'saving' && (
              <div className="mb-4">
                <div className="mb-1.5 flex justify-between text-[11px] text-(--color-text-tertiary)">
                  <span>Uploading photos…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-(--color-background-secondary)">
                  <div
                    className="h-full rounded-full bg-navy-800 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {saveState === 'error' && (
              <p className="mb-4 text-[12px] text-red-500">{errorMsg}</p>
            )}

            <div className="flex gap-2.5">
              <button
                onClick={handleSave}
                disabled={saveState === 'saving' || !title.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-pteal-600 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-pteal-400 disabled:opacity-60"
              >
                {saveState === 'saving' && <CircleNotchIcon className="h-3.5 w-3.5 animate-spin" weight="light" />}
                Save album
              </button>
              <button
                onClick={handleClose}
                disabled={saveState === 'saving'}
                className="rounded-[8px] border-[0.5px] border-(--color-border-tertiary) px-4 py-2.5 text-[13px] text-(--color-text-secondary) transition-colors hover:bg-(--color-background-secondary) disabled:opacity-60"
              >
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
