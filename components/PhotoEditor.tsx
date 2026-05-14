'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Text as KonvaText, Transformer } from 'react-konva'
import { WarningIcon } from '@phosphor-icons/react'
import type { PhotoState, PrintSize, Orientation, TextLayer } from '@/types/album'
import { checkResolution } from '@/lib/resolutionCheck'
import { effectiveSides } from '@/lib/border'
import { startInlineEdit } from '@/lib/textInlineEdit'

// Canonical pan coordinate space — must match PREVIEW_W in canvasExport.ts
const STAGE_W = 600

interface Props {
  photo: PhotoState
  size: PrintSize
  orientation: Orientation
  onChange: (photo: PhotoState) => void
}

export default function PhotoEditor({ photo, size, orientation, onChange }: Props) {
  const exportW = orientation === 'portrait' ? size.px.h : size.px.w
  const exportH = orientation === 'portrait' ? size.px.w : size.px.h

  const [stageW, setStageW] = useState(STAGE_W)
  const stageH = Math.round(stageW * exportH / exportW)

  const [htmlImage, setHtmlImage] = useState<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<any>(null)
  const trRef = useRef<any>(null)
  const textNodesRef = useRef<Map<string, any>>(new Map())
  const photoRef = useRef(photo)
  photoRef.current = photo
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const img = new Image()
    img.onload = () => setHtmlImage(img)
    img.src = photo.objectUrl
  }, [photo.objectUrl])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const aspectRatio = exportH / exportW
      let w = Math.floor(width)
      let h = Math.round(w * aspectRatio)
      if (height > 0 && h > height) {
        h = Math.floor(height)
        w = Math.round(h / aspectRatio)
      }
      setStageW(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [exportW, exportH])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const p = photoRef.current
      const z = Math.max(0.5, Math.min(4, p.zoom - e.deltaY * 0.001))
      onChangeRef.current({ ...p, zoom: parseFloat(z.toFixed(3)) })
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const selectedLayer = photo.textLayers.find(l => l.selected)

  useEffect(() => {
    const tr = trRef.current
    if (!tr) return
    const node = selectedLayer ? textNodesRef.current.get(selectedLayer.id) : null
    tr.nodes(node ? [node] : [])
    tr.getLayer()?.batchDraw()
  }, [selectedLayer?.id])

  const fontFamilyKey = photo.textLayers.map(l => l.fontFamily).join('\0')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    ;[...new Set(photo.textLayers.map(l => l.fontFamily))].forEach(f =>
      document.fonts.load(`48px "${f}"`).then(() =>
        textNodesRef.current.values().next().value?.getLayer()?.batchDraw()
      )
    )
  }, [fontFamilyKey])

  function selectLayer(id: string) {
    const p = photoRef.current
    onChangeRef.current({ ...p, textLayers: p.textLayers.map(l => ({ ...l, selected: l.id === id })) })
  }

  function handleInlineEdit(layer: TextLayer) {
    const node = textNodesRef.current.get(layer.id)
    const stage = stageRef.current
    if (!node || !stage) return
    startInlineEdit(layer, node, stage, trRef, (content) => {
      const p = photoRef.current
      onChangeRef.current({ ...p, textLayers: p.textLayers.map(l => l.id === layer.id ? { ...l, content } : l) })
    })
  }

  const warning = checkResolution(photo, size, orientation)
  const panScale = stageW / STAGE_W
  const coverScale = htmlImage
    ? Math.max(stageW / htmlImage.naturalWidth, stageH / htmlImage.naturalHeight)
    : 1
  const scale = coverScale * photo.zoom
  const bSides = effectiveSides(photo.border)
  const bFill = photo.border.color
  const [bT, bR, bB, bL] = [bSides.top, bSides.right, bSides.bottom, bSides.left].map(v => v * panScale)

  return (
    <div className="flex h-full w-full flex-col gap-2">
      {warning && (
        <div className="flex shrink-0 items-start gap-2 rounded-[8px] border-[0.5px] border-(--color-border-warning) bg-(--color-background-warning) px-3 py-2 text-[11px] text-(--color-text-warning)">
          <WarningIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" weight="light" />
          <span>{warning}</span>
        </div>
      )}
      <div ref={containerRef} className="min-h-0 flex-1 flex items-center justify-center">
        <div style={{ width: stageW, height: stageH }} className="overflow-hidden rounded-[10px] bg-white shadow-sm">
          <Stage
            ref={stageRef}
            width={stageW}
            height={stageH}
            onClick={(e) => {
              if (e.target === e.target.getStage()) {
                const p = photoRef.current
                if (p.textLayers.some(l => l.selected))
                  onChangeRef.current({ ...p, textLayers: p.textLayers.map(l => ({ ...l, selected: false })) })
              }
            }}
          >
            <Layer>
              {htmlImage && (
                <KonvaImage
                  image={htmlImage}
                  x={stageW / 2 + photo.panX * panScale}
                  y={stageH / 2 + photo.panY * panScale}
                  offsetX={htmlImage.naturalWidth / 2}
                  offsetY={htmlImage.naturalHeight / 2}
                  scaleX={scale * (photo.flipH ? -1 : 1)}
                  scaleY={scale}
                  rotation={photo.rotation}
                  draggable
                  onDragEnd={(e) => onChangeRef.current({
                    ...photoRef.current,
                    panX: (e.target.x() - stageW / 2) / panScale,
                    panY: (e.target.y() - stageH / 2) / panScale,
                  })}
                />
              )}
              {bT > 0 && <Rect x={0} y={0} width={stageW} height={bT} fill={bFill} listening={false} />}
              {bR > 0 && <Rect x={stageW - bR} y={0} width={bR} height={stageH} fill={bFill} listening={false} />}
              {bB > 0 && <Rect x={0} y={stageH - bB} width={stageW} height={bB} fill={bFill} listening={false} />}
              {bL > 0 && <Rect x={0} y={0} width={bL} height={stageH} fill={bFill} listening={false} />}
              {photo.textLayers.map(layer => (
                <KonvaText
                  key={layer.id}
                  ref={(node) => {
                    if (node) textNodesRef.current.set(layer.id, node)
                    else textNodesRef.current.delete(layer.id)
                  }}
                  text={layer.content}
                  x={layer.x * stageW}
                  y={layer.y * stageH}
                  fontSize={layer.fontSize * (stageW / exportW)}
                  fontFamily={layer.fontFamily}
                  fill={layer.color}
                  draggable
                  onClick={(e) => { e.cancelBubble = true; selectLayer(layer.id) }}
                  onDblClick={() => handleInlineEdit(layer)}
                  onDragEnd={(e) => {
                    const p = photoRef.current
                    onChangeRef.current({ ...p, textLayers: p.textLayers.map(l => l.id === layer.id ? { ...l, x: e.target.x() / stageW, y: e.target.y() / stageH } : l) })
                  }}
                />
              ))}
              <Transformer
                ref={trRef}
                rotateEnabled={false}
                enabledAnchors={[]}
                borderStroke="#0C447C"
                borderStrokeWidth={1.5}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  )
}
