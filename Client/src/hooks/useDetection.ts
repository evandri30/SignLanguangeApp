import { useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useWebSocket } from "@/hooks/useWebSocket";

export function useDetection() {
    const { videoRef, isReady, error: cameraError, startCamera, stopCamera } = useCamera();
     
      const { status, lastResponse, connect, disconnect } = useWebSocket({
        videoRef,
        enabled: isReady,
        intervalMs: 150,
      });
     
      useEffect(() => {
        startCamera();
        return () => stopCamera();
      }, [startCamera, stopCamera]);
     
      useEffect(() => {
        if (isReady) connect();
        else disconnect();
      }, [isReady, connect, disconnect]);

      return { videoRef, isReady, cameraError, startCamera, status, lastResponse}
}