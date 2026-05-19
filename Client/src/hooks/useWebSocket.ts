import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildWebSocketUrl,
  buildPayload,
  captureFrameAsBase64,
  parseDetectionResponse,
  generatedClientId,
} from "../services/detectionService";
import type { DetectionResponse, WSStatus } from "../types/detection";
 
interface UseWebSocketOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled: boolean;
  intervalMs?: number;
}
 
interface UseWebSocketReturn {
  status: WSStatus;
  lastResponse: DetectionResponse | null;
  connect: () => void;
  disconnect: () => void;
}
 
export function useWebSocket({
  videoRef,
  enabled,
  intervalMs = 150,
}: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const frameIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clientId = useRef(generatedClientId()).current;
 
  const [status, setStatus] = useState<WSStatus>("disconnected");
  const [lastResponse, setLastResponse] = useState<DetectionResponse | null>(null);
 
  const sendFrame = useCallback(() => {
    const ws = wsRef.current;
    const video = videoRef.current;
 
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!video) return;
 
    const base64 = captureFrameAsBase64(video);
    if (!base64) return;
 
    frameIdRef.current += 1;
    ws.send(buildPayload(base64, frameIdRef.current));
  }, [videoRef]);
 
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
 
    setStatus("connecting");
    const ws = new WebSocket(buildWebSocketUrl(clientId));
 
    ws.onopen = () => {
      console.log("[useWebSocket] Connected");
      setStatus("connected");
    };
 
    ws.onmessage = (event) => {
      const response = parseDetectionResponse(event.data);
      if (response) setLastResponse(response);
    };
 
    ws.onerror = () => {
      console.error("[useWebSocket] Connection error");
      setStatus("error");
    };
 
    ws.onclose = () => {
      console.log("[useWebSocket] Disconnected");
      setStatus("disconnected");
    };
 
    wsRef.current = ws;
  }, [clientId]);
 
  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);
 
  useEffect(() => {
    if (enabled && status === "connected") {
      intervalRef.current = setInterval(sendFrame, intervalMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
 
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, status, sendFrame, intervalMs]);
 
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);
 
  return { status, lastResponse, connect, disconnect };
}