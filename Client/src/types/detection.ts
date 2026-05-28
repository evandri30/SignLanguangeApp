export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
 
export interface DetectionItem {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; 
}
 
export interface DetectionResponse {
  status: "ok" | "error";
  frame_id: number | null;
  inference_ms: number;
  detections: DetectionItem[];
  top_prediction: DetectionItem | null;
  message?: string; 
}
 
export interface DetectionPayload {
  frame: string;       
  frame_id: number;
}

export interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export interface DetectionOverlayProps {
  topPrediction: DetectionItem | null;
  allDetections: DetectionItem[];
}
 
export type WSStatus = "disconnected" | "connecting" | "connected" | "error";