import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { r2 } from '@/lib/r2'
import { DeleteObjectsCommand } from '@aws-sdk/client-s3'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })
  const { id } = await params

  const album = await prisma.album.findFirst({
    where: { id, userId: session.user.id! },
    include: { photos: { orderBy: { order: 'asc' } } },
  })

  if (!album) return new Response('Not Found', { status: 404 })
  return Response.json(album)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })
  const { id } = await params

  const data = await req.json()
  const album = await prisma.album.updateMany({
    where: { id, userId: session.user.id! },
    data: { title: data.title, printSizeId: data.printSizeId, orientation: data.orientation },
  })

  return Response.json(album)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })
  const { id } = await params
  const userId = session.user.id!

  const album = await prisma.album.findFirst({
    where: { id, userId },
    include: { photos: { select: { r2Key: true } } },
  })

  if (!album) return new Response('Not Found', { status: 404 })

  if (album.photos.length > 0) {
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Delete: {
          Objects: album.photos.map((p) => ({ Key: p.r2Key })),
        },
      })
    )
  }

  await prisma.album.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
