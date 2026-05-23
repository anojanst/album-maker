'use client'

import { useState } from 'react'
import { CircleNotchIcon, CheckCircleIcon } from '@phosphor-icons/react'
import type { PhotoState, AlbumConfig } from '@/types/album'

const DARK = '#3a1a18'
const SUCCESS = '#2d6e3a'
const BORDER = '#DEDEDE'
const FG = '#525252'
const FG_LIGHT = '#888888'
const BG = '#F6F5F9'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-[380px] rounded-[16px] p-6 shadow-xl"
        style={{ background: '#fff', border: `2px solid ${BORDER}` }}
      >
        {saveState === 'done' ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <CheckCircleIcon className="h-10 w-10" style={{ color: SUCCESS }} weight="light" />
            <p className="text-[15px] font-semibold" style={{ color: DARK }}>Album saved!</p>
            <p className="text-[13px]" style={{ color: FG }}>
              Your album is saved to your dashboard and can be edited any time.
            </p>
            <div className="mt-2 flex gap-2.5">
              <a
                href="/dashboard"
                className="rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white transition-colors"
                style={{ background: DARK }}
              >
                Go to dashboard
              </a>
              <button
                onClick={handleClose}
                className="rounded-[10px] px-4 py-2 text-[13px] transition-colors"
                style={{ border: `2px solid ${BORDER}`, color: FG, background: '#fff' }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-1 text-[15px] font-semibold" style={{ color: DARK }}>Save album</p>
            <p className="mb-5 text-[13px]" style={{ color: FG }}>
              Give your album a name and we&apos;ll save it to your account so you can come back and edit it later.
            </p>

            <label className="mb-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: FG_LIGHT }}>
                Album name
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saveState === 'saving'}
                className="rounded-[10px] px-3 py-2.5 text-[13px] outline-none disabled:opacity-60"
                style={{ border: `2px solid ${BORDER}`, background: BG, color: DARK }}
              />
            </label>

            {saveState === 'saving' && (
              <div className="mb-4">
                <div className="mb-1.5 flex justify-between text-[11px]" style={{ color: FG_LIGHT }}>
                  <span>Uploading photos…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: BORDER }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, background: DARK }}
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
                className="flex flex-1 items-center justify-center gap-2 rounded-[10px] py-2.5 text-[13px] font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: SUCCESS }}
              >
                {saveState === 'saving' && <CircleNotchIcon className="h-3.5 w-3.5 animate-spin" weight="light" />}
                Save album
              </button>
              <button
                onClick={handleClose}
                disabled={saveState === 'saving'}
                className="rounded-[10px] px-4 py-2.5 text-[13px] transition-colors disabled:opacity-60"
                style={{ border: `2px solid ${BORDER}`, color: FG, background: '#fff' }}
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
