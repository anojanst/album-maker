'use client'

import { useState, useEffect } from 'react'
import { CircleNotchIcon } from '@phosphor-icons/react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import type { PhotoState, AlbumConfig, BorderState, TextLayer, EditorShellProps, Step } from '@/types/album'
import { PRINT_SIZES } from '@/lib/printSizes'
import { exportPhoto, exportAllAsPdf } from '@/lib/canvasExport'
import { checkResolution } from '@/lib/resolutionCheck'
import RiskWarning from '@/components/RiskWarning'
import SaveAlbumModal from '@/components/SaveAlbumModal'
import NewAlbumDialog from '@/components/NewAlbumDialog'
import MobileShell from '@/components/MobileShell'
import DesktopShell from '@/components/DesktopShell'

const BG = '#F6F5F9'
const DARK = '#3a1a18'

const STEP_LABELS: Record<number, string> = {
  1: 'Choose format →',
  2: 'Adjust photos →',
  3: 'Download →',
}
const R2_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''

interface Props { albumId?: string }

export default function AlbumEditor({ albumId }: Props) {
  const [step, setStep] = useState<Step>(albumId ? 3 : 1)
  const [photos, setPhotos] = useState<PhotoState[]>([])
  const [config, setConfig] = useState<AlbumConfig>({ printSizeId: PRINT_SIZES[0].id, orientation: 'portrait' })
  const [activeId, setActiveId] = useState('')
  const [selectedFormat, setSelectedFormat] = useState<'png'|'zip'|'pdf'>('png')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [riskOpen, setRiskOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [loadingAlbum, setLoadingAlbum] = useState(!!albumId)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!albumId) return
    fetch(`/api/albums/${albumId}`)
      .then(r => r.json())
      .then(album => {
        setConfig({ printSizeId: album.printSizeId, orientation: album.orientation })
        const loaded: PhotoState[] = album.photos.map((p: {
          id: string; r2Key: string; zoom: number; panX: number; panY: number;
          rotation: number; border: BorderState; textLayers: TextLayer[]
        }) => ({
          id: p.id, objectUrl: `${R2_URL}/${p.r2Key}`, r2Key: p.r2Key,
          naturalWidth: 0, naturalHeight: 0, zoom: p.zoom, panX: p.panX, panY: p.panY,
          rotation: p.rotation, flipH: false, border: p.border, textLayers: p.textLayers,
        }))
        setPhotos(loaded)
        setActiveId(loaded[0]?.id ?? '')
        setLoadingAlbum(false)
      })
      .catch(() => setLoadingAlbum(false))
  }, [albumId])

  const activeIdx = photos.findIndex(p => p.id === activeId)
  const activePhoto = photos[activeIdx] ?? null
  const printSize = PRINT_SIZES.find(s => s.id === config.printSizeId) ?? PRINT_SIZES[0]

  function handlePhotoChange(updated: PhotoState) {
    setPhotos(photos.map(p => p.id === updated.id ? updated : p))
  }

  function doReset() {
    photos.forEach(p => { if (p.objectUrl.startsWith('blob:')) URL.revokeObjectURL(p.objectUrl) })
    setPhotos([]); setConfig({ printSizeId: PRINT_SIZES[0].id, orientation: 'portrait' })
    setActiveId(''); setSelectedFormat('png'); setTermsAccepted(false)
    setRiskOpen(false); setConfirmOpen(false); setStep(1)
  }

  function goNext() {
    if (step === 1) { setActiveId(photos[0]?.id ?? ''); setStep(2) }
    else if (step === 4) setRiskOpen(true)
    else setStep((step + 1) as Step)
  }

  function goBack() { if (step > 1) setStep((step - 1) as Step) }

  async function runExport() {
    setRiskOpen(false); setExporting(true)
    try {
      if (selectedFormat === 'png') {
        saveAs(await exportPhoto(activePhoto!, printSize, config.orientation), `photo-${String(activeIdx + 1).padStart(2, '0')}.png`)
      } else if (selectedFormat === 'zip') {
        const zip = new JSZip()
        for (let i = 0; i < photos.length; i++)
          zip.file(`photo-${String(i + 1).padStart(2, '0')}.png`, await exportPhoto(photos[i], printSize, config.orientation))
        saveAs(await zip.generateAsync({ type: 'blob', compression: 'STORE' }), 'album.zip')
      } else {
        saveAs(await exportAllAsPdf(photos, printSize, config.orientation), 'album.pdf')
      }
      setSaveOpen(true)
    } finally { setExporting(false) }
  }

  function warningForExport(): string | null {
    if (selectedFormat === 'png') return activePhoto ? checkResolution(activePhoto, printSize, config.orientation) : null
    return photos.some(p => checkResolution(p, printSize, config.orientation) !== null)
      ? 'One or more photos may print blurry — check the resolution warnings in the editor.' : null
  }

  const canContinue = step === 1 ? photos.length > 0 : step === 4 ? termsAccepted && !exporting : true
  const primaryLabel = exporting ? 'Exporting…'
    : step === 4 ? `Download ${photos.length} photo${photos.length === 1 ? '' : 's'}`
    : STEP_LABELS[step]

  if (loadingAlbum) return (
    <div className="flex h-screen items-center justify-center" style={{ background: BG }}>
      <CircleNotchIcon className="h-7 w-7 animate-spin" style={{ color: DARK }} weight="light" />
    </div>
  )

  const sharedProps: EditorShellProps = {
    step, photos, config, activeId, activeIdx, activePhoto, printSize,
    selectedFormat, termsAccepted, exporting, canContinue, primaryLabel,
    setPhotos, setConfig, setActiveId, setSelectedFormat, setTermsAccepted,
    setSaveOpen, setConfirmOpen, handlePhotoChange, goNext, goBack,
  }

  return (
    <>
      {isDesktop ? <DesktopShell {...sharedProps} /> : <MobileShell {...sharedProps} />}
      <RiskWarning isOpen={riskOpen} warning={warningForExport()} onCancel={() => setRiskOpen(false)} onConfirm={runExport} />
      <SaveAlbumModal isOpen={saveOpen} photos={photos} config={config} onClose={() => setSaveOpen(false)} />
      <NewAlbumDialog isOpen={confirmOpen} photoCount={photos.length} onConfirm={doReset} onCancel={() => setConfirmOpen(false)} />
    </>
  )
}
