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
    <div className="flex flex-col min-h-screen bg-white text-neutral-900">
      <StatusBar
        wsStatus={status}
        inferenceMs={lastResponse?.inference_ms ?? null}
        cameraReady={isReady}
      />

      {/* Page header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Deteksi</h1>
          <p className="mt-2 text-sm text-neutral-500 max-w-md leading-relaxed">
            Arahkan tangan ke kamera dan peragakan abjad SIBI. Sistem akan mengenali gerakan secara langsung.
          </p>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10">
        <div className="relative w-full aspect-video bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <CameraView videoRef={videoRef} />

          {isReady && (
            <DetectionOverlay
              topPrediction={lastResponse?.top_prediction ?? null}
              allDetections={lastResponse?.detections ?? []}
            />
          )}

          {!isReady && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2.5 text-sm text-neutral-400">
                <div className="h-4 w-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                Mempersiapkan kamera...
              </div>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center bg-white">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-neutral-900">Kamera tidak dapat diakses</p>
                <p className="text-xs text-neutral-500 mt-1">{cameraError}</p>
              </div>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors"
              >
                Coba lagi
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}