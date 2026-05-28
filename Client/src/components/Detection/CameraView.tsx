import type {CameraViewProps} from "@/types/detection"

export function CameraView({ videoRef }: CameraViewProps) {
  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      playsInline
      muted
    />
  );
}