import { PDFDocument } from 'pdf-lib'
import type { PhotoState, PrintSize, Orientation } from '@/types/album'
import { effectiveSides } from '@/lib/border'

const MM_TO_PT = 2.8346
// Must match STAGE_W in PhotoEditor — pan values are in preview-pixel coordinates
const PREVIEW_W = 600

export async function exportPhoto(
  photo: PhotoState,
  size: PrintSize,
  orientation: Orientation,
): Promise<Blob> {
  const exportW = orientation === 'portrait' ? size.px.h : size.px.w
  const exportH = orientation === 'portrait' ? size.px.w : size.px.h

  const canvas = new OffscreenCanvas(exportW, exportH)
  const ctx = canvas.getContext('2d')!

  const res = await fetch(photo.objectUrl)
  const bitmap = await createImageBitmap(await res.blob())

  const natW = photo.naturalWidth
  const natH = photo.naturalHeight
  const panScale = exportW / PREVIEW_W
  const coverScale = Math.max(exportW / natW, exportH / natH) * photo.zoom

  ctx.save()
  ctx.translate(
    exportW / 2 + photo.panX * panScale,
    exportH / 2 + photo.panY * panScale,
  )
  ctx.rotate((photo.rotation * Math.PI) / 180)
  ctx.scale(coverScale * (photo.flipH ? -1 : 1), coverScale)
  ctx.drawImage(bitmap, -natW / 2, -natH / 2)
  ctx.restore()

  bitmap.close()

  const sides = effectiveSides(photo.border)
  const t = sides.top * panScale
  const r = sides.right * panScale
  const b = sides.bottom * panScale
  const l = sides.left * panScale
  ctx.fillStyle = photo.border.color
  if (t > 0) ctx.fillRect(0, 0, exportW, t)
  if (r > 0) ctx.fillRect(exportW - r, 0, r, exportH)
  if (b > 0) ctx.fillRect(0, exportH - b, exportW, b)
  if (l > 0) ctx.fillRect(0, 0, l, exportH)

  if (photo.textLayers.length > 0) {
    await document.fonts.ready
    ctx.textBaseline = 'top'
    for (const layer of photo.textLayers) {
      ctx.save()
      ctx.font = `${layer.fontSize}px "${layer.fontFamily}"`
      ctx.fillStyle = layer.color
      ctx.fillText(layer.content, layer.x * exportW, layer.y * exportH)
      ctx.restore()
    }
  }

  return canvas.convertToBlob({ type: 'image/png' })
}

export async function exportAllAsPdf(
  photos: PhotoState[],
  size: PrintSize,
  orientation: Orientation,
): Promise<Blob> {
  const mmW = orientation === 'portrait' ? size.mm.h : size.mm.w
  const mmH = orientation === 'portrait' ? size.mm.w : size.mm.h
  const ptW = mmW * MM_TO_PT
  const ptH = mmH * MM_TO_PT

  const pdfDoc = await PDFDocument.create()

  for (const photo of photos) {
    const pngBlob = await exportPhoto(photo, size, orientation)
    const pdfImage = await pdfDoc.embedPng(await pngBlob.arrayBuffer())
    const page = pdfDoc.addPage([ptW, ptH])
    page.drawImage(pdfImage, { x: 0, y: 0, width: ptW, height: ptH })
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
}
