import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })
  const { id: albumId } = await params
  const userId = session.user.id!

  const album = await prisma.album.findFirst({ where: { id: albumId, userId } })
  if (!album) return new Response('Not Found', { status: 404 })

  const { r2Key, order, zoom, panX, panY, rotation, border, textLayers } = await req.json()

  const photo = await prisma.albumPhoto.create({
    data: { albumId, r2Key, order, zoom, panX, panY, rotation, border, textLayers },
  })

  return Response.json(photo, { status: 201 })
}
