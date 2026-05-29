export function getConfidenceLabel(conf: number): string {
  if (conf >= 0.9) return "Sangat yakin";
  if (conf >= 0.7) return "Yakin";
  return "Mendekati";
}