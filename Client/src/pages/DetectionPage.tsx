import { useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useWebSocket } from "@/hooks/useWebSocket";
import { CameraView } from "@/components/CameraView";
import { DetectionOverlay } from "@/components/DetectionOverlay";
import { StatusBar } from "@/components/StatusBar";
 
export function DetectionPage() {
  
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
 
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <StatusBar
        wsStatus={status}
        inferenceMs={lastResponse?.inference_ms ?? null}
        cameraReady={isReady}
      />
 
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
 
          <CameraView videoRef={videoRef} />
 
          {isReady && (
            <DetectionOverlay
              topPrediction={lastResponse?.top_prediction ?? null}
              allDetections={lastResponse?.detections ?? []}
            />
          )}
 
          {!isReady && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 text-sm font-mono animate-pulse">
                Memulai kamera...
              </div>
            </div>
          )}
 
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="text-red-400 text-2xl">⚠️</span>
              <p className="text-red-300 text-sm">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      </main>
 
      <div className="px-4 py-2 text-center text-xs text-gray-600 font-mono">
        Sign Language Detection · Frame ID: {lastResponse?.frame_id ?? "—"}
      </div>
    </div>
  );
}