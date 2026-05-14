'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { CheckIcon, CaretLeftIcon, CircleNotchIcon, ArrowsOutIcon, MagnifyingGlassPlusIcon, PlusIcon } from '@phosphor-icons/react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import type { PhotoState, AlbumConfig } from '@/types/album'
import { PRINT_SIZES } from '@/lib/printSizes'
import { exportPhoto, exportAllAsPdf } from '@/lib/canvasExport'
import { checkResolution } from '@/lib/resolutionCheck'
import PhotoStrip from '@/components/PhotoStrip'
import ThemeToggle from '@/components/ThemeToggle'
import PhotoToolPanel from '@/components/PhotoToolPanel'
import RiskWarning from '@/components/RiskWarning'
import ExportScreen from '@/components/ExportScreen'
import NewAlbumDialog from '@/components/NewAlbumDialog'

const Uploader = dynamic(() => import('@/components/Uploader'), { ssr: false })
const FormatPicker = dynamic(() => import('@/components/FormatPicker'), { ssr: false })
const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), { ssr: false })

type Step = 1 | 2 | 3 | 4
export type ExportType = 'png' | 'zip' | 'pdf'

const STEPS = [
  { n: 1, label: 'Upload' },
  { n: 2, label: 'Format' },
  { n: 3, label: 'Adjust' },
  { n: 4, label: 'Export' },
] as const

export default function Home() {
  const [step, setStep] = useState<Step>(1)
  const [photos, setPhotos] = useState<PhotoState[]>([])
  const [config, setConfig] = useState<AlbumConfig>({ printSizeId: PRINT_SIZES[0].id, orientation: 'portrait' })
  const [activeId, setActiveId] = useState('')
  const [selectedFormat, setSelectedFormat] = useState<ExportType>('png')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [riskOpen, setRiskOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const activeIdx = photos.findIndex((p) => p.id === activeId)
  const activePhoto = photos[activeIdx] ?? null
  const printSize = PRINT_SIZES.find((s) => s.id === config.printSizeId) ?? PRINT_SIZES[0]

  function handlePhotoChange(updated: PhotoState) {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  function doReset() {
    photos.forEach((p) => URL.revokeObjectURL(p.objectUrl))
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
    } finally {
      setExporting(false)
    }
  }

  function warningForExport(): string | null {
    if (selectedFormat === 'png') return activePhoto ? checkResolution(activePhoto, printSize, config.orientation) : null
    const any = photos.some((p) => checkResolution(p, printSize, config.orientation) !== null)
    return any ? 'One or more photos may print blurry — check the resolution warnings in the editor.' : null
  }

  const canContinue = step === 1 ? photos.length > 0
    : step === 4 ? termsAccepted && !exporting
    : true

  const primaryLabel = exporting ? 'Exporting…'
    : step === 4 ? `Download ${photos.length} photo${photos.length === 1 ? '' : 's'}`
    : 'Continue →'

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-(--color-background-primary)">
      {/* Topbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-(--color-border-tertiary) px-6">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Kisku.online" width={28} height={28} className="rounded-[8px]" />
          <span className="text-[13px] tracking-[-0.01em]">
            <span className="font-medium text-(--color-text-primary)">Kisku</span>
            <span className="font-[400] text-(--color-text-tertiary)">.online</span>
          </span>
          <div className="h-4 w-px bg-(--color-border-tertiary)" />
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-1 rounded-[8px] border-[0.5px] border-(--color-border-tertiary) px-2.5 py-1.5 text-[12px] text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary) active:scale-[0.98]"
          >
            <PlusIcon className="h-3 w-3" weight="bold" /> New album
          </button>
        </div>

        <nav className="flex items-center">
          {STEPS.map(({ n, label }, i) => {
            const active = step === n
            const done = step > n
            return (
              <div key={n} className="flex items-center">
                <div className={['flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px]',
                  active ? 'bg-(--color-background-secondary)' : '',
                  !active && !done ? 'text-(--color-text-tertiary)' : '',
                ].join(' ')}>
                  <div className={['flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px]',
                    done ? 'bg-pteal-400 text-white' : active ? 'bg-primary text-primary-foreground' : 'border border-current',
                  ].join(' ')}>
                    {done ? <CheckIcon className="h-3 w-3" weight="bold" /> : n}
                  </div>
                  <span className={done ? 'text-pteal-400' : active ? 'font-medium text-primary' : ''}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="mx-1 h-px w-5 bg-(--color-border-tertiary)" />}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-[12px] text-(--color-text-tertiary)">
            {photos.length > 0 ? `${photos.length} photo${photos.length === 1 ? '' : 's'}` : ''}
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {step === 1 && <Uploader photos={photos} onChange={setPhotos} />}
        {step === 2 && <FormatPicker config={config} onChange={setConfig} />}
        {step === 3 && activePhoto && (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* screen-head ~60px */}
            <div className="grid h-15 shrink-0 grid-cols-3 items-center border-b border-(--color-border-tertiary) px-5">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.02em] text-(--color-text-primary)">
                  {printSize.label} · {config.orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                </p>
                <p className="text-[11px] text-(--color-text-tertiary)">{printSize.mm.w} × {printSize.mm.h} mm · 300 DPI export</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) px-3 py-1 text-[11px] text-(--color-text-tertiary)">
                  <ArrowsOutIcon className="h-3 w-3" weight="light" /> drag to pan
                </span>
                <span className="flex items-center gap-1.5 rounded-full border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) px-3 py-1 text-[11px] text-(--color-text-tertiary)">
                  <MagnifyingGlassPlusIcon className="h-3 w-3" weight="light" /> scroll to zoom
                </span>
              </div>
              <span className="text-right text-[12px] text-(--color-text-tertiary)">Photo {activeIdx + 1} of {photos.length}</span>
            </div>
            {/* main row flex:1 */}
            <div className="flex min-h-0 flex-1 gap-2 p-4 pb-1">
              {/* canvas-wrap flex:1 */}
              <div className="min-h-0 flex-1 overflow-hidden rounded-[12px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-secondary) p-4">
                <PhotoEditor key={activePhoto.id} photo={activePhoto} size={printSize} orientation={config.orientation} onChange={handlePhotoChange} />
              </div>
              {/* tool-panel 200px */}
              <PhotoToolPanel
                photo={activePhoto}
                onChange={handlePhotoChange}
                onPrev={() => setActiveId(photos[activeIdx - 1].id)}
                onNext={() => setActiveId(photos[activeIdx + 1].id)}
                isFirst={activeIdx === 0}
                isLast={activeIdx === photos.length - 1}
                activeIdx={activeIdx}
                totalPhotos={photos.length}
              />
            </div>
            {/* photo-strip ~62px */}
            <div className="flex h-15.5 shrink-0 items-center px-4">
              <PhotoStrip photos={photos} currentIndex={activeIdx} onSelect={(i) => setActiveId(photos[i].id)} />
            </div>
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
      <footer className="flex h-13 shrink-0 items-center justify-between border-t border-(--color-border-tertiary) px-6">
        <button
          onClick={goBack}
          disabled={step === 1}
          className="flex items-center gap-1 rounded-[8px] border-[0.5px] border-(--color-border-tertiary) px-3 py-2 text-[13px] text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-secondary) disabled:pointer-events-none disabled:opacity-0"
        >
          <CaretLeftIcon className="h-3.5 w-3.5" weight="light" /> Back
        </button>
        <span className="text-[12px] text-(--color-text-tertiary)">Step {step} of 4</span>
        <button
          onClick={goNext}
          disabled={!canContinue}
          className={['flex items-center gap-1.5 rounded-[8px] px-5 py-2 text-[13px] font-medium text-white transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
            step === 4 ? 'bg-pteal-600 hover:bg-pteal-400' : 'bg-primary hover:bg-primary/90',
          ].join(' ')}
        >
          {exporting && <CircleNotchIcon className="h-3.5 w-3.5 animate-spin" weight="light" />}
          {primaryLabel}
        </button>
      </footer>

      <RiskWarning
        isOpen={riskOpen}
        warning={warningForExport()}
        onCancel={() => setRiskOpen(false)}
        onConfirm={runExport}
      />
      <NewAlbumDialog
        isOpen={confirmOpen}
        photoCount={photos.length}
        onConfirm={doReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
