'use client'

import dynamic from 'next/dynamic'
import { CircleNotchIcon, DownloadSimpleIcon, FloppyDiskIcon } from '@phosphor-icons/react'
import type { EditorShellProps } from '@/types/album'
import PhotoStrip from '@/components/PhotoStrip'
import DesktopSidebar from '@/components/DesktopSidebar'

const Uploader = dynamic(() => import('@/components/Uploader'), { ssr: false })
const FormatPicker = dynamic(() => import('@/components/FormatPicker'), { ssr: false })
const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), { ssr: false })
const ExportScreen = dynamic(() => import('@/components/ExportScreen'), { ssr: false })

const DARK = '#3a1a18'
const PRIMARY = '#F4B8B0'
const SECONDARY = '#A8D4E8'
const BG = '#F6F5F9'
const SUCCESS = '#2d6e3a'
const BORDER = '#DEDEDE'

const STEPPER_STEPS = [{ num: 1, label: 'Photos' }, { num: 2, label: 'Format' }, { num: 3, label: 'Adjust' }]
const HINTS = ['', 'Step 1 of 3 — select your photos', 'Step 2 of 3 — choose your format', 'Step 3 of 3 — adjust each photo', 'Ready to download']

function stepStatus(idx: number, step: number): 'done' | 'active' | 'pending' {
  if (step === 4 || idx < step) return 'done'
  if (idx === step) return 'active'
  return 'pending'
}

export default function DesktopShell({
  step, photos, config, activeId, activeIdx, activePhoto, printSize,
  selectedFormat, termsAccepted, exporting, canContinue, primaryLabel,
  setPhotos, setConfig, setActiveId, setSelectedFormat, setTermsAccepted,
  setSaveOpen, setConfirmOpen, handlePhotoChange, goNext, goBack,
}: EditorShellProps) {
  const heroBg = step === 4 ? SECONDARY : PRIMARY
  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100
  const progressFill = step === 4 ? SUCCESS : DARK
  const heroTextColor = step === 4 ? '#1a2a3a' : DARK
  const heroSubColor = step === 4 ? '#2a5a6a' : '#7a3a35'

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Topbar 52px */}
      <header className="flex shrink-0 items-center justify-between px-6" style={{ height: 52, background: heroBg }}>
        <span className="text-[15px] font-semibold tracking-tight" style={{ color: DARK }}>kisku</span>

        {/* Stepper */}
        <div className="flex items-center">
          {STEPPER_STEPS.map((s, i) => {
            const status = stepStatus(s.num, step)
            const isDone = status === 'done', isActive = status === 'active'
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-1.5 rounded-[20px] px-2.5 py-1"
                  style={isActive ? { background: 'rgba(255,255,255,0.35)' } : {}}>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                    style={{
                      background: isDone ? SUCCESS : isActive ? DARK : 'transparent',
                      border: isDone || isActive ? 'none' : '1.5px solid rgba(58,26,24,0.3)',
                      color: isDone || isActive ? '#fff' : 'rgba(58,26,24,0.5)',
                    }}>
                    {isDone ? '✓' : s.num}
                  </div>
                  <span className="text-[12px] font-medium"
                    style={{ color: isDone || isActive ? DARK : 'rgba(58,26,24,0.5)' }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className="w-5 shrink-0" style={{ height: 1.5, background: 'rgba(58,26,24,0.2)' }} />}
              </div>
            )
          })}
        </div>

        {/* Context right */}
        <div className="flex items-center gap-2">
          {photos.length > 0 && step > 1 && (
            <button onClick={() => setSaveOpen(true)}
              className="flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-medium"
              style={{ background: 'rgba(255,255,255,0.35)', color: DARK }}>
              <FloppyDiskIcon size={12} weight="bold" /> Save
            </button>
          )}
          {step === 4 ? (
            <span className="rounded-[20px] px-3 py-[5px] text-[12px] font-medium"
              style={{ background: 'rgba(255,255,255,0.4)', color: '#1a2a3a' }}>
              <span style={{ color: SUCCESS }}>✓ </span>ready
            </span>
          ) : (
            <span className="text-[12px] font-medium" style={{ color: 'rgba(58,26,24,0.6)' }}>
              {step === 3 && photos.length > 0
                ? `photo ${activeIdx + 1} / ${photos.length}`
                : `${photos.length} photo${photos.length === 1 ? '' : 's'}`}
            </span>
          )}
        </div>
      </header>

      {/* Progress bar 3px */}
      <div className="shrink-0" style={{ height: 3, background: 'rgba(58,26,24,0.15)' }}>
        <div className="h-full transition-all duration-300" style={{ width: `${progressPct}%`, background: progressFill }} />
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content area */}
        <div className={`flex-1 overflow-hidden ${step === 3 ? 'flex flex-col p-6' : 'overflow-y-auto p-6'}`}>
          {step !== 3 && (
            <div className="mb-5">
              <h1 className="whitespace-pre-line font-semibold leading-[1.1]"
                style={{ fontSize: 26, color: heroTextColor, letterSpacing: '-0.8px' }}>
                {step === 1 ? 'Your photos,\nprinted.' : step === 2 ? 'Print size.' : 'Almost done.'}
              </h1>
              <p className="mt-1 text-[13px]" style={{ color: heroSubColor }}>
                {step === 1 && 'Upload from your desktop — everything stays in your browser'}
                {step === 2 && `All ${photos.length} photo${photos.length === 1 ? '' : 's'} use the same size and orientation.`}
                {step === 4 && `${photos.length} photo${photos.length === 1 ? '' : 's'} · ${printSize.label} · ${config.orientation}`}
              </p>
            </div>
          )}

          {step === 1 && <Uploader photos={photos} onChange={p => { setPhotos(p); if (p.length > 0 && !activeId) setActiveId(p[0].id) }} />}
          {step === 2 && <FormatPicker config={config} onChange={setConfig} />}
          {step === 3 && activePhoto && (
            <>
              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-[14px] border-2"
                style={{ background: BG, borderColor: BORDER }}>
                <div className="absolute inset-0">
                  <PhotoEditor key={activePhoto.id} photo={activePhoto} size={printSize}
                    orientation={config.orientation} onChange={handlePhotoChange} />
                </div>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                  {['drag to pan', 'scroll to zoom', 'two-finger rotate'].map(t => (
                    <span key={t} className="whitespace-nowrap rounded-[20px] px-3 py-1 text-[11px] font-medium"
                      style={{ background: 'rgba(255,255,255,0.92)', color: DARK, border: '1px solid rgba(58,26,24,0.1)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <PhotoStrip photos={photos} currentIndex={activeIdx} onSelect={i => setActiveId(photos[i].id)} />
              </div>
            </>
          )}
          {step === 4 && (
            <ExportScreen photos={photos} printSize={printSize} orientation={config.orientation}
              selectedFormat={selectedFormat} onFormatChange={setSelectedFormat}
              termsAccepted={termsAccepted} onTermsChange={setTermsAccepted} />
          )}
        </div>

        {/* Sidebar 256px */}
        <aside className="shrink-0 overflow-hidden" style={{ width: 256, borderLeft: `2px solid ${BORDER}` }}>
          <DesktopSidebar step={step} photos={photos} printSize={printSize} config={config}
            activePhoto={activePhoto} onPhotoChange={handlePhotoChange} />
        </aside>
      </div>

      {/* Footer 54px */}
      <footer className="flex shrink-0 items-center justify-between px-6"
        style={{ height: 54, background: '#fff', borderTop: `2px solid ${BORDER}` }}>
        <button onClick={goBack}
          className="flex h-[42px] items-center gap-1.5 rounded-[12px] border-2 px-[18px] text-[13px] font-semibold transition-all active:scale-[0.98]"
          style={{ borderColor: DARK, color: DARK, background: 'transparent', visibility: step === 1 ? 'hidden' : 'visible' }}>
          ← Back
        </button>
        <span className="text-[12px] font-medium" style={{ color: '#888' }}>{HINTS[step]}</span>
        <button onClick={goNext} disabled={!canContinue}
          className="flex h-[42px] items-center gap-2 rounded-[12px] px-6 text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: step === 4 ? SUCCESS : DARK }}>
          {exporting && <CircleNotchIcon size={14} className="animate-spin" weight="light" />}
          {step === 4 && !exporting && <DownloadSimpleIcon size={14} style={{ color: '#7FE4A0' }} weight="bold" />}
          {primaryLabel}
        </button>
      </footer>
    </div>
  )
}
