interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

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