import type { WSStatus } from "@/types/detection";
import { motion, AnimatePresence } from "motion/react";


interface StatusBarProps {
  wsStatus: WSStatus;
  inferenceMs: number | null;
  cameraReady: boolean;
}

const STATUS_CONFIG: Record<WSStatus, { label: string; dot: string }> = {
  disconnected: { label: "Cermin terputus", dot: "bg-neutral-300" },
  connecting: { label: "Menghubungkan...", dot: "bg-yellow-400" },
  connected: { label: "Aktif & siap praktik", dot: "bg-green-500" },
  error: { label: "Koneksi bermasalah", dot: "bg-red-400" },
};

export function StatusBar({ wsStatus, cameraReady, inferenceMs }: StatusBarProps) {
  const { label, dot } = STATUS_CONFIG[wsStatus];

  return (
    <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-neutral-200 text-xs text-neutral-500 select-none">
      {/* Status Dot & Label */}
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot} ${wsStatus === "connecting" ? "animate-pulse" : ""}`} />
        
        <AnimatePresence mode="wait">
          <motion.span
            key={wsStatus}
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 3 }}
            transition={{ duration: 0.15 }}
            className="font-medium text-neutral-500"
          >
            {label}
          </motion.span>
        </AnimatePresence>

        {wsStatus === "connected" && inferenceMs !== null && (
          <span className="text-[10px] text-neutral-400 ml-1 font-sans">
            · {inferenceMs}ms
          </span>
        )}
      </div>

      {/* Camera Status */}
      <div className="flex items-center gap-1 text-neutral-400">
        <span className={cameraReady ? "text-neutral-600 font-medium" : ""}>
          Kamera: {cameraReady ? "Aktif" : "Nonaktif"}
        </span>
      </div>
    </div>
  );
}