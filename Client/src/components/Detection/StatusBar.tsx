import type { WSStatus, StatusBarProps } from "@/types/detection";
 
const DOT_CLASS: Record<WSStatus, string> = {
  disconnected: "bg-neutral-300",
  connecting: "bg-yellow-400 animate-pulse",
  connected: "bg-green-500",
  error: "bg-red-400",
};
 
const STATUS_LABEL: Record<WSStatus, string> = {
  disconnected: "Tidak terhubung",
  connecting: "Menghubungkan...",
  connected: "Aktif",
  error: "Koneksi bermasalah",
};
 
export function StatusBar({ wsStatus, cameraReady, inferenceMs }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-neutral-50 border-b border-neutral-100 text-xs text-neutral-400 select-none">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASS[wsStatus]}`} />
        <span className="font-medium text-neutral-500">{STATUS_LABEL[wsStatus]}</span>
        {wsStatus === "connected" && inferenceMs !== null && (
          <span className="text-neutral-300">· {inferenceMs}ms</span>
        )}
      </div>
      <span className={cameraReady ? "text-neutral-500 font-medium" : "text-neutral-300"}>
        Kamera {cameraReady ? "aktif" : "nonaktif"}
      </span>
    </div>
  );
}