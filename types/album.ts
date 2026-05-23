export interface PrintSize {
  id: string;
  label: string;
  mm: { w: number; h: number };
  px: { w: number; h: number };
}

export type Orientation = "portrait" | "landscape";

export interface BorderState {
  mode: "uniform" | "individual";
  uniform: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  color: string;
}

export interface TextLayer {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  selected: boolean;
}

export interface PhotoState {
  id: string;
  file?: File;
  objectUrl: string;
  r2Key?: string;
  naturalWidth: number;
  naturalHeight: number;
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  flipH: boolean;
  border: BorderState;
  textLayers: TextLayer[];
}

export interface AlbumConfig {
  printSizeId: string;
  orientation: Orientation;
}

export type ExportType = 'png' | 'zip' | 'pdf'

export type Step = 1 | 2 | 3 | 4

export interface EditorShellProps {
  step: Step
  photos: PhotoState[]
  config: AlbumConfig
  activeId: string
  activeIdx: number
  activePhoto: PhotoState | null
  printSize: PrintSize
  selectedFormat: ExportType
  termsAccepted: boolean
  exporting: boolean
  canContinue: boolean
  primaryLabel: string
  setPhotos: (photos: PhotoState[]) => void
  setConfig: (config: AlbumConfig) => void
  setActiveId: (id: string) => void
  setSelectedFormat: (f: ExportType) => void
  setTermsAccepted: (v: boolean) => void
  setSaveOpen: (v: boolean) => void
  setConfirmOpen: (v: boolean) => void
  handlePhotoChange: (photo: PhotoState) => void
  goNext: () => void
  goBack: () => void
}
