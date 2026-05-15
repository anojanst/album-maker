import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })
  const userId = session.user.id!

  const albums = await prisma.album.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      photos: {
        orderBy: { order: 'asc' },
        take: 1,
        select: { r2Key: true },
      },
      _count: { select: { photos: true } },
    },
  })

  return Response.json(albums)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })
  const userId = session.user.id!

  const { title, printSizeId, orientation } = await req.json()

  const album = await prisma.album.create({
    data: { userId, title: title ?? 'Untitled album', printSizeId, orientation },
  })

  return Response.json(album, { status: 201 })
}
