import type { DetectionItem } from "@/types/detection";

interface DetectionOverlayProps {
  topPrediction: DetectionItem | null;
  allDetections: DetectionItem[];
}

export function DetectionOverlay({ topPrediction, allDetections }: DetectionOverlayProps) {
  if (!topPrediction) {
    return (
      <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
        <div className="bg-black/50 text-white text-sm px-4 py-2 rounded-full font-mono">
          Arahkan tangan ke kamera...
        </div>
      </div>
    );
  }
 
  const confidencePct = Math.round(topPrediction.confidence * 100);
 
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="bg-indigo-600/90 text-white text-4xl font-bold px-6 py-3 rounded-2xl shadow-xl tracking-widest">
          {topPrediction.label}
        </div>
        <div className="bg-black/60 text-white text-xs px-3 py-1 rounded-full font-mono">
          {confidencePct}% confidence
        </div>
      </div>
 
      {allDetections.length > 1 && (
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          {allDetections.map((d, i) => (
            <div
              key={i}
              className="bg-black/60 text-white text-xs px-2 py-1 rounded font-mono flex justify-between gap-3"
            >
              <span>{d.label}</span>
              <span className="text-indigo-300">{Math.round(d.confidence * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}