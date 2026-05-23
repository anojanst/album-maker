'use client'

import dynamic from 'next/dynamic'
import {
  CaretLeftIcon, CircleNotchIcon, ArrowsOutIcon,
  MagnifyingGlassPlusIcon, FloppyDiskIcon, DownloadSimpleIcon,
} from '@phosphor-icons/react'
import type { EditorShellProps } from '@/types/album'
import PhotoStrip from '@/components/PhotoStrip'
import PhotoToolPanel from '@/components/PhotoToolPanel'

const Uploader = dynamic(() => import('@/components/Uploader'), { ssr: false })
const FormatPicker = dynamic(() => import('@/components/FormatPicker'), { ssr: false })
const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), { ssr: false })
const ExportScreen = dynamic(() => import('@/components/ExportScreen'), { ssr: false })

const DARK = '#3a1a18'
const PRIMARY = '#F4B8B0'
const SECONDARY = '#A8D4E8'
const BG = '#F6F5F9'
const SUCCESS = '#2d6e3a'

export default function MobileShell({
  step, photos, config, activeId, activeIdx, activePhoto, printSize,
  selectedFormat, termsAccepted, exporting, canContinue, primaryLabel,
  setPhotos, setConfig, setActiveId, setSelectedFormat, setTermsAccepted,
  setSaveOpen, setConfirmOpen, handlePhotoChange, goNext, goBack,
}: EditorShellProps) {
  const heroBg = step === 4 ? SECONDARY : PRIMARY
  const heroTextColor = step === 4 ? '#1a2a3a' : DARK
  const heroSubColor = step === 4 ? '#2a5a6a' : '#7a3a35'
  const backBorderColor = step === 4 ? '#1a4a5a' : DARK
  const isFirst = activeIdx <= 0
  const isLast = activeIdx >= photos.length - 1

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: BG }}>
      {/* Status bar */}
      <div className="flex h-[44px] shrink-0 items-center justify-between px-5" style={{ background: heroBg }}>
        <span className="text-[13px] font-semibold" style={{ color: DARK }}>kisku</span>
        <div className="flex items-center gap-2">
          {photos.length > 0 && step > 1 && (
            <button onClick={() => setSaveOpen(true)}
              className="flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-medium"
              style={{ background: 'rgba(255,255,255,0.35)', color: DARK }}>
              <FloppyDiskIcon className="h-3 w-3" weight="bold" /> Save
            </button>
          )}
          {step > 1 && (
            <button onClick={() => setConfirmOpen(true)}
              className="rounded-[8px] px-2 py-1 text-[11px] font-medium"
              style={{ color: DARK, background: 'rgba(255,255,255,0.25)' }}>
              New
            </button>
          )}
        </div>
      </div>

      {/* Hero block */}
      <div className="shrink-0" style={{ background: heroBg }}>
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          {step > 1 ? (
            <button onClick={goBack}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border-2 bg-white transition-transform active:scale-[0.95]"
              style={{ borderColor: backBorderColor }}>
              <CaretLeftIcon className="h-4 w-4" style={{ color: backBorderColor }} weight="bold" />
            </button>
          ) : (
            <div className="h-[38px] w-[38px]" />
          )}
          <span className="text-[13px] font-medium" style={{ color: DARK }}>
            {step === 3 && photos.length > 0 ? `photo ${activeIdx + 1} / ${photos.length}` : ''}
          </span>
          <div className="rounded-[20px] px-3 py-[5px] text-[12px] font-medium"
            style={{ background: 'rgba(255,255,255,0.35)', color: step === 4 ? '#2d6e3a' : DARK }}>
            {step === 4 ? '✓ ready' : `${step} / 3`}
          </div>
        </div>

        {step !== 3 && (
          <div className="px-4 pb-6">
            <h1 className="whitespace-pre-line text-[36px] font-semibold leading-[1.05] tracking-[-1px]"
              style={{ color: heroTextColor }}>
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

        {step === 3 && activePhoto && (
          <div className="px-4 pb-4">
            <div className="relative rounded-[18px] border-2" style={{ background: '#fff', borderColor: '#DEDEDE', padding: 16 }}>
              <div style={{ height: 260, overflow: 'hidden' }}>
                <PhotoEditor key={activePhoto.id} photo={activePhoto} size={printSize}
                  orientation={config.orientation} onChange={handlePhotoChange} />
              </div>
              <div className="mt-2 flex justify-center gap-2">
                {['drag to pan', 'pinch to zoom'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 rounded-[20px] px-3 py-1 text-[11px] font-medium"
                    style={{ background: 'rgba(255,255,255,0.92)', color: DARK, border: '1px solid rgba(58,26,24,0.1)' }}>
                    {t === 'drag to pan' ? <ArrowsOutIcon className="h-3 w-3" weight="light" /> : <MagnifyingGlassPlusIcon className="h-3 w-3" weight="light" />}
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <main className="flex-1 overflow-y-auto" style={{ background: BG }}>
        {step === 1 && <Uploader photos={photos} onChange={p => { setPhotos(p); if (p.length > 0 && !activeId) setActiveId(p[0].id) }} />}
        {step === 2 && <FormatPicker config={config} onChange={setConfig} />}
        {step === 3 && activePhoto && (
          <div className="flex flex-col gap-3 px-4 py-4">
            <PhotoStrip photos={photos} currentIndex={activeIdx} onSelect={i => setActiveId(photos[i].id)} />
            <PhotoToolPanel
              photo={activePhoto} onChange={handlePhotoChange}
              onPrev={() => { if (!isFirst) setActiveId(photos[activeIdx - 1].id) }}
              onNext={() => { if (!isLast) setActiveId(photos[activeIdx + 1].id) }}
              isFirst={isFirst} isLast={isLast} activeIdx={activeIdx} totalPhotos={photos.length}
            />
          </div>
        )}
        {step === 4 && (
          <ExportScreen photos={photos} printSize={printSize} orientation={config.orientation}
            selectedFormat={selectedFormat} onFormatChange={setSelectedFormat}
            termsAccepted={termsAccepted} onTermsChange={setTermsAccepted} />
        )}
      </main>

      {/* Footer */}
      <footer className="shrink-0 px-4 pb-6 pt-2.5" style={{ background: BG }}>
        <button onClick={goNext} disabled={!canContinue}
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[16px] text-[16px] font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: step === 4 ? SUCCESS : DARK }}>
          {exporting && <CircleNotchIcon className="h-4 w-4 animate-spin" weight="light" />}
          {step === 4 && !exporting && <DownloadSimpleIcon className="h-4 w-4" style={{ color: '#7FE4A0' }} weight="bold" />}
          {primaryLabel}
        </button>
      </footer>
    </div>
  )
}
