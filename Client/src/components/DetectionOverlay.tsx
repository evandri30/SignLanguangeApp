import type { DetectionItem } from "@/types/detection";
import { motion, AnimatePresence } from "motion/react";

interface DetectionOverlayProps {
  topPrediction: DetectionItem | null;
  allDetections: DetectionItem[];
}

export function DetectionOverlay({ topPrediction }: DetectionOverlayProps) {
  const getConfidenceLabel = (conf: number) => {
    if (conf >= 0.90) return "Sangat yakin";
    if (conf >= 0.70) return "Yakin";
    return "Mendekati";
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-6">
      <AnimatePresence mode="wait">
        {!topPrediction ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 text-neutral-500 text-xs px-4 py-2 rounded-md border border-neutral-200 shadow-sm font-medium backdrop-blur-sm"
          >
            Posisikan tangan di depan kamera...
          </motion.div>
        ) : (
          <motion.div
            key={topPrediction.label}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="bg-white text-neutral-900 text-6xl font-semibold px-8 py-4 rounded-xl shadow-lg border border-neutral-200 tracking-tight">
              {topPrediction.label.toUpperCase()}
            </div>
            <div className="bg-white/90 text-neutral-500 text-xs font-medium px-3 py-1.5 rounded-md border border-neutral-200 shadow-sm backdrop-blur-sm">
              {getConfidenceLabel(topPrediction.confidence)} · {Math.round(topPrediction.confidence * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}