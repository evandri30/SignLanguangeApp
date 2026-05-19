interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
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