'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PlusIcon, CircleNotchIcon, SignOutIcon } from '@phosphor-icons/react'
import { signOut } from 'next-auth/react'
import AlbumCard from '@/components/AlbumCard'
import DeleteAlbumModal from '@/components/DeleteAlbumModal'

interface AlbumSummary {
  id: string
  title: string
  printSizeId: string
  orientation: string
  updatedAt: string
  photos: { r2Key: string }[]
  _count: { photos: number }
}

export default function DashboardPage() {
  const [albums, setAlbums] = useState<AlbumSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    fetch('/api/albums')
      .then((r) => r.json())
      .then((data) => { setAlbums(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleDeleted(id: string) {
    setAlbums((prev) => prev.filter((a) => a.id !== id))
    setDeleteTarget(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--color-background-primary)">
      {/* Topbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-(--color-border-tertiary) px-6">
        <a href="/">
          <Image src="/logo.png" alt="Kisku.online" width={120} height={40} className="rounded-[8px]" />
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/album/new"
            className="flex items-center gap-1.5 rounded-[8px] bg-navy-800 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-navy-600 active:scale-[0.98]"
          >
            <PlusIcon className="h-3.5 w-3.5" weight="bold" /> New album
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            className="flex items-center gap-1.5 rounded-[8px] border-[0.5px] border-(--color-border-tertiary) px-3.5 py-2 text-[13px] text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary) active:scale-[0.98]"
          >
            <SignOutIcon className="h-3.5 w-3.5" weight="light" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <h1 className="mb-6 text-[18px] font-medium tracking-[-0.02em] text-(--color-text-primary)">Your albums</h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <CircleNotchIcon className="h-6 w-6 animate-spin text-(--color-text-tertiary)" weight="light" />
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border-[0.5px] border-dashed border-(--color-border-tertiary) py-24 text-center">
            <p className="text-[15px] font-medium text-(--color-text-primary)">No albums yet</p>
            <p className="text-[13px] text-(--color-text-secondary)">Create your first album to get started.</p>
            <a
              href="/album/new"
              className="mt-2 flex items-center gap-1.5 rounded-[8px] bg-navy-800 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-navy-600"
            >
              <PlusIcon className="h-3.5 w-3.5" weight="bold" /> New album
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                title={album.title}
                printSizeId={album.printSizeId}
                orientation={album.orientation}
                photoCount={album._count.photos}
                firstPhotoKey={album.photos[0]?.r2Key ?? null}
                updatedAt={album.updatedAt}
                onDelete={(id) => setDeleteTarget({ id, title: album.title })}
              />
            ))}
          </div>
        )}
      </main>

      <DeleteAlbumModal
        albumId={deleteTarget?.id ?? null}
        albumTitle={deleteTarget?.title ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
