import AlbumEditor from '@/components/AlbumEditor'

export default async function ExistingAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AlbumEditor albumId={id} />
}
