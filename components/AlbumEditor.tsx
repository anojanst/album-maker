'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  CaretLeftIcon,
  CircleNotchIcon,
  ArrowsOutIcon,
  MagnifyingGlassPlusIcon,
  FloppyDiskIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import type { PhotoState, AlbumConfig, BorderState, TextLayer, ExportType } from '@/types/album'
import { PRINT_SIZES } from '@/lib/printSizes'
import { exportPhoto, exportAllAsPdf } from '@/lib/canvasExport'
import { checkResolution } from '@/lib/resolutionCheck'
import PhotoStrip from '@/components/PhotoStrip'
import PhotoToolPanel from '@/components/PhotoToolPanel'
import RiskWarning from '@/components/RiskWarning'
import ExportScreen from '@/components/ExportScreen'
import NewAlbumDialog from '@/components/NewAlbumDialog'
import SaveAlbumModal from '@/components/SaveAlbumModal'

const Uploader = dynamic(() => import('@/components/Uploader'), { ssr: false })
const FormatPicker = dynamic(() => import('@/components/FormatPicker'), { ssr: false })
const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), { ssr: false })

type Step = 1 | 2 | 3 | 4

const R2_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''

// Kisku / Candyland palette
const DARK = '#3a1a18'
const PRIMARY = '#F4B8B0'
const SECONDARY = '#A8D4E8'
const BG = '#F6F5F9'
const SUCCESS = '#2d6e3a'

const STEP_LABELS: Record<number, string> = {
  1: 'Choose format →',
  2: 'Adjust photos →',
  3: 'Download →',
}

interface Props {
  albumId?: string
}

export default function AlbumEditor({ albumId }: Props) {
  const [step, setStep] = useState<Step>(albumId ? 3 : 1)
  const [photos, setPhotos] = useState<PhotoState[]>([])
  const [config, setConfig] = useState<AlbumConfig>({ printSizeId: PRINT_SIZES[0].id, orientation: 'portrait' })
  const [activeId, setActiveId] = useState('')
  const [selectedFormat, setSelectedFormat] = useState<ExportType>('png')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [riskOpen, setRiskOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [loadingAlbum, setLoadingAlbum] = useState(!!albumId)

  useEffect(() => {
    if (!albumId) return
    fetch(`/api/albums/${albumId}`)
      .then((r) => r.json())
      .then((album) => {
        setConfig({ printSizeId: album.printSizeId, orientation: album.orientation })
        const loaded: PhotoState[] = album.photos.map((p: {
          id: string; r2Key: string; zoom: number; panX: number; panY: number;
          rotation: number; border: BorderState; textLayers: TextLayer[]
        }) => ({
          id: p.id,
          objectUrl: `${R2_URL}/${p.r2Key}`,
          r2Key: p.r2Key,
          naturalWidth: 0,
          naturalHeight: 0,
          zoom: p.zoom,
          panX: p.panX,
          panY: p.panY,
          rotation: p.rotation,
          flipH: false,
          border: p.border,
          textLayers: p.textLayers,
        }))
        setPhotos(loaded)
        setActiveId(loaded[0]?.id ?? '')
        setLoadingAlbum(false)
      })
      .catch(() => setLoadingAlbum(false))
  }, [albumId])

  const activeIdx = photos.findIndex((p) => p.id === activeId)
  const activePhoto = photos[activeIdx] ?? null
  const printSize = PRINT_SIZES.find((s) => s.id === config.printSizeId) ?? PRINT_SIZES[0]

  const isFirst = activeIdx <= 0
  const isLast = activeIdx >= photos.length - 1

  function handlePhotoChange(updated: PhotoState) {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  function doReset() {
    photos.forEach((p) => { if (p.objectUrl.startsWith('blob:')) URL.revokeObjectURL(p.objectUrl) })
    setPhotos([])
    setConfig({ printSizeId: PRINT_SIZES[0].id, orientation: 'portrait' })
    setActiveId('')
    setSelectedFormat('png')
    setTermsAccepted(false)
    setRiskOpen(false)
    setConfirmOpen(false)
    setStep(1)
  }

  function goNext() {
    if (step === 1) { setActiveId(photos[0]?.id ?? ''); setStep(2) }
    else if (step === 4) setRiskOpen(true)
    else setStep((step + 1) as Step)
  }

  function goBack() {
    if (step > 1) setStep((step - 1) as Step)
  }

  async function runExport() {
    setRiskOpen(false)
    setExporting(true)
    try {
      if (selectedFormat === 'png') {
        const blob = await exportPhoto(activePhoto!, printSize, config.orientation)
        saveAs(blob, `photo-${String(activeIdx + 1).padStart(2, '0')}.png`)
      } else if (selectedFormat === 'zip') {
        const zip = new JSZip()
        for (let i = 0; i < photos.length; i++) {
          const blob = await exportPhoto(photos[i], printSize, config.orientation)
          zip.file(`photo-${String(i + 1).padStart(2, '0')}.png`, blob)
        }
        saveAs(await zip.generateAsync({ type: 'blob', compression: 'STORE' }), 'album.zip')
      } else {
        saveAs(await exportAllAsPdf(photos, printSize, config.orientation), 'album.pdf')
      }
      setSaveOpen(true)
    } finally {
      setExporting(false)
    }
  }

  function warningForExport(): string | null {
    if (selectedFormat === 'png') return activePhoto ? checkResolution(activePhoto, printSize, config.orientation) : null
    const any = photos.some((p) => checkResolution(p, printSize, config.orientation) !== null)
    return any ? 'One or more photos may print blurry — check the resolution warnings in the editor.' : null
  }

  const canContinue = step === 1 ? photos.length > 0 : step === 4 ? termsAccepted && !exporting : true
  const primaryLabel = exporting
    ? 'Exporting…'
    : step === 4
      ? `Download ${photos.length} photo${photos.length === 1 ? '' : 's'}`
      : STEP_LABELS[step]

  const heroBg = step === 4 ? SECONDARY : PRIMARY
  const heroTextColor = step === 4 ? '#1a2a3a' : DARK
  const heroSubColor = step === 4 ? '#2a5a6a' : '#7a3a35'
  const backBorderColor = step === 4 ? '#1a4a5a' : DARK

  if (loadingAlbum) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: BG }}>
        <CircleNotchIcon className="h-7 w-7 animate-spin" style={{ color: DARK }} weight="light" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: BG }}>
      {/* Status bar */}
      <div
        className="flex h-[44px] shrink-0 items-center justify-between px-5"
        style={{ background: heroBg }}
      >
        <span className="text-[13px] font-semibold" style={{ color: DARK }}>kisku</span>
        <div className="flex items-center gap-2">
          {photos.length > 0 && step > 1 && (
            <button
              onClick={() => setSaveOpen(true)}
              className="flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-medium"
              style={{ background: 'rgba(255,255,255,0.35)', color: DARK }}
            >
              <FloppyDiskIcon className="h-3 w-3" weight="bold" /> Save
            </button>
          )}
          {step > 1 && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="text-[11px] font-medium px-2 py-1 rounded-[8px]"
              style={{ color: DARK, background: 'rgba(255,255,255,0.25)' }}
            >
              New
            </button>
          )}
        </div>
      </div>

      {/* Hero block */}
      <div className="shrink-0" style={{ background: heroBg }}>
        {/* Hero nav row */}
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          {step > 1 ? (
            <button
              onClick={goBack}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border-2 bg-white transition-transform active:scale-[0.95]"
              style={{ borderColor: backBorderColor }}
            >
              <CaretLeftIcon className="h-4 w-4" style={{ color: backBorderColor }} weight="bold" />
            </button>
          ) : (
            <div className="h-[38px] w-[38px]" />
          )}

          <span className="text-[13px] font-medium" style={{ color: DARK }}>
            {step === 3 && photos.length > 0 ? `photo ${activeIdx + 1} / ${photos.length}` : ''}
          </span>

          <div
            className="rounded-[20px] px-3 py-[5px] text-[12px] font-medium"
            style={{ background: 'rgba(255,255,255,0.35)', color: step === 4 ? '#2d6e3a' : DARK }}
          >
            {step === 4 ? '✓ ready' : `${step} / 3`}
          </div>
        </div>

        {/* Hero title + subtitle — steps 1, 2, 4 */}
        {step !== 3 && (
          <div className="px-4 pb-6">
            <h1
              className="whitespace-pre-line text-[36px] font-semibold leading-[1.05] tracking-[-1px]"
              style={{ color: heroTextColor }}
            >
              {step === 1 && 'Your photos,\nprinted.'}
              {step === 2 && 'Print size.'}
              {step === 4 && 'Almost\ndone.'}
            </h1>
            <p className="mt-2 text-[13px] leading-[1.5]" style={{ color: heroSubColor }}>
              {step === 1 && 'Upload from your phone — everything stays in your browser'}
              {step === 2 && `All ${photos.length} photo${photos.length === 1 ? '' : 's'} use the same size and orientation`}
              {step === 4 && `${photos.length} photo${photos.length === 1 ? '' : 's'} · ${printSize.label} · ${config.orientation}`}
            </p>
          </div>
        )}

        {/* Canvas card — step 3 only */}
        {step === 3 && activePhoto && (
          <div className="px-4 pb-4">
            <div
              className="relative rounded-[18px] border-2"
              style={{ background: '#fff', borderColor: '#DEDEDE', padding: 16 }}
            >
              <div style={{ height: 260, overflow: 'hidden' }}>
                <PhotoEditor
                  key={activePhoto.id}
                  photo={activePhoto}
                  size={printSize}
                  orientation={config.orientation}
                  onChange={handlePhotoChange}
                />
              </div>
              {/* Hint pills */}
              <div className="mt-2 flex justify-center gap-2">
                <span
                  className="flex items-center gap-1.5 rounded-[20px] px-3 py-1 text-[11px] font-medium"
                  style={{ background: 'rgba(255,255,255,0.92)', color: DARK, border: '1px solid rgba(58,26,24,0.1)' }}
                >
                  <ArrowsOutIcon className="h-3 w-3" weight="light" /> drag to pan
                </span>
                <span
                  className="flex items-center gap-1.5 rounded-[20px] px-3 py-1 text-[11px] font-medium"
                  style={{ background: 'rgba(255,255,255,0.92)', color: DARK, border: '1px solid rgba(58,26,24,0.1)' }}
                >
                  <MagnifyingGlassPlusIcon className="h-3 w-3" weight="light" /> pinch to zoom
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <main className="flex-1 overflow-y-auto" style={{ background: BG }}>
        {step === 1 && (
          <Uploader
            photos={photos}
            onChange={(p) => {
              setPhotos(p)
              if (p.length > 0 && !activeId) setActiveId(p[0].id)
            }}
          />
        )}
        {step === 2 && <FormatPicker config={config} onChange={setConfig} />}
        {step === 3 && activePhoto && (
          <div className="flex flex-col gap-3 px-4 py-4">
            <PhotoStrip
              photos={photos}
              currentIndex={activeIdx}
              onSelect={(i) => setActiveId(photos[i].id)}
            />
            <PhotoToolPanel
              photo={activePhoto}
              onChange={handlePhotoChange}
              onPrev={() => { if (!isFirst) setActiveId(photos[activeIdx - 1].id) }}
              onNext={() => { if (!isLast) setActiveId(photos[activeIdx + 1].id) }}
              isFirst={activeIdx === 0}
              isLast={activeIdx === photos.length - 1}
              activeIdx={activeIdx}
              totalPhotos={photos.length}
            />
          </div>
        )}
        {step === 4 && (
          <ExportScreen
            photos={photos}
            printSize={printSize}
            orientation={config.orientation}
            selectedFormat={selectedFormat}
            onFormatChange={setSelectedFormat}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="shrink-0 px-4 pb-6 pt-2.5" style={{ background: BG }}>
        <button
          onClick={goNext}
          disabled={!canContinue}
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[16px] text-[16px] font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: step === 4 ? SUCCESS : DARK }}
        >
          {exporting && <CircleNotchIcon className="h-4 w-4 animate-spin" weight="light" />}
          {step === 4 && !exporting && <DownloadSimpleIcon className="h-4 w-4" style={{ color: '#7FE4A0' }} weight="bold" />}
          {primaryLabel}
        </button>
      </footer>

      <RiskWarning isOpen={riskOpen} warning={warningForExport()} onCancel={() => setRiskOpen(false)} onConfirm={runExport} />
      <SaveAlbumModal isOpen={saveOpen} photos={photos} config={config} onClose={() => setSaveOpen(false)} />
      <NewAlbumDialog isOpen={confirmOpen} photoCount={photos.length} onConfirm={doReset} onCancel={() => setConfirmOpen(false)} />
    </div>
  )
}
