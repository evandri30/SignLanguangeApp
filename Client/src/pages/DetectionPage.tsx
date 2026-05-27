import { useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useWebSocket } from "@/hooks/useWebSocket";
import {DetectionHeader} from "@/components/Detection/DetectionHeader"
import { CameraView } from "@/components/Detection/CameraView";
import { DetectionOverlay } from "@/components/Detection/DetectionOverlay";
import { StatusBar } from "@/components/Sibi/StatusBar";
import {Footer} from "@/components/Footer";
 
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
 
      <DetectionHeader />
 
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:flex-1">
            <div className="relative w-full aspect-video bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
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
                    <div className="h-4 w-4 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
                    Mempersiapkan kamera...
                  </div>
                </div>
              )}
 
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center bg-white">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Kamera tidak dapat diakses</p>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-xs">{cameraError}</p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 transition-colors"
                  >
                    Coba lagi
                  </button>
                </div>
              )}
            </div>
          </div>
 
          <div className="w-full lg:w-60 lg:shrink-0">
            <div className="rounded-xl border border-neutral-100 overflow-hidden">
              <div className="p-5 border-b border-neutral-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  Tips
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-500 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-300 font-bold mt-0.5 shrink-0 tabular-nums">01</span>
                    Posisikan tangan 30–60 cm dari kamera
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-300 font-bold mt-0.5 shrink-0 tabular-nums">02</span>
                    Pastikan pencahayaan cukup terang
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-300 font-bold mt-0.5 shrink-0 tabular-nums">03</span>
                    Latar belakang polos meningkatkan akurasi
                  </li>
                </ul>
              </div>
              
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  Status
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Koneksi</span>
                    <span
                      className={
                        status === "connected"
                          ? "text-green-600 font-semibold"
                          : status === "connecting"
                          ? "text-yellow-600 font-semibold"
                          : "text-neutral-400"
                      }
                    >
                      {status === "connected"
                        ? "Terhubung"
                        : status === "connecting"
                        ? "Menghubungkan..."
                        : "Terputus"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Kamera</span>
                    <span className={isReady ? "text-green-600 font-semibold" : "text-neutral-400"}>
                      {isReady ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  {lastResponse?.inference_ms != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Inferensi</span>
                      <span className="font-semibold text-neutral-600">
                        {lastResponse.inference_ms}ms
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}