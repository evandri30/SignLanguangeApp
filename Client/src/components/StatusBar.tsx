import type { WSStatus } from "@/types/detection";

interface StatusBarProps {
  wsStatus: WSStatus;
  inferenceMs: number | null;
  cameraReady: boolean;
}
 
const STATUS_CONFIG: Record<WSStatus, { label: string; color: string }> = {
  disconnected: { label: "Terputus", color: "bg-gray-500" },
  connecting:   { label: "Menghubungkan...", color: "bg-yellow-500 animate-pulse" },
  connected:    { label: "Terhubung", color: "bg-green-500" },
  error:        { label: "Error Koneksi", color: "bg-red-500" },
};
 
export function StatusBar({ wsStatus, inferenceMs, cameraReady }: StatusBarProps) {
  const { label, color } = STATUS_CONFIG[wsStatus];
 
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-900 text-sm font-mono text-white">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span>WS: {label}</span>
      </div>
 
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${cameraReady ? "bg-green-500" : "bg-gray-500"}`} />
        <span>Cam: {cameraReady ? "Aktif" : "Mati"}</span>
      </div>
 
      {inferenceMs !== null && (
        <span className="ml-auto text-gray-400">
          ⚡ {inferenceMs.toFixed(1)} ms
        </span>
      )}
    </div>
  );
}