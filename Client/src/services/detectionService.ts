import type { DetectionPayload, DetectionResponse } from "@/types/detection";

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const WS_BASE_URL = API_URL.replace(/^https/, "wss").replace(/^http/, "ws");

export function buildWebSocketUrl(clientId: string): string {
    return `${WS_BASE_URL}/ws/detect/${clientId}`;
}

export function captureFrameAsBase64(video: HTMLVideoElement, quality = 0.5) : string | null {
    if(video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return null;

    const MAX_WIDTH = 320;
    const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
    const width = Math.round(video.videoWidth * scale);
    const height = Math.round(video.videoHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if(!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
}

export function buildPayload(base64Frame: string, frameId: number): string {
    const payload: DetectionPayload = {
        frame: base64Frame,
        frame_id: frameId
    };

    return JSON.stringify(payload);
}

export function parseDetectionResponse(raw: string): DetectionResponse | null {
  try {
    return JSON.parse(raw) as DetectionResponse;
  } catch {
    console.error("[detectionService] Failed to parse response:", raw);
    return null;
  }
}

export function generatedClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}