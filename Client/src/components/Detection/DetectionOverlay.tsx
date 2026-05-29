import type { DetectionOverlayProps } from "@/types/detection";
import { motion, AnimatePresence } from "motion/react";
import {getConfidenceLabel} from "@/utils/detection"
 
export function DetectionOverlay({ topPrediction }: DetectionOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-start p-5">
      <AnimatePresence mode="wait">
        {!topPrediction ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 backdrop-blur-sm text-neutral-400 text-xs px-3.5 py-2 rounded-lg border border-neutral-200 shadow-sm font-medium"
          >
            Posisikan tangan di depan kamera...
          </motion.div>
        ) : (
          <motion.div
            key={topPrediction.label}
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex flex-col gap-2"
          >
            <div className="bg-white text-neutral-900 text-6xl font-extrabold px-6 py-3.5 rounded-xl shadow-lg border border-neutral-100 leading-none tracking-tight">
              {topPrediction.label.toUpperCase()}
            </div>
            <div className="bg-white/90 backdrop-blur-sm text-neutral-500 text-xs font-medium px-3 py-1.5 rounded-md border border-neutral-200 shadow-sm self-start">
              {getConfidenceLabel(topPrediction.confidence)} · {Math.round(topPrediction.confidence * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}