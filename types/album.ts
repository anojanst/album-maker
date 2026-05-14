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
  file: File;
  objectUrl: string;
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
