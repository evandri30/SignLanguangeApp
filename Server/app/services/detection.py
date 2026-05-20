import asyncio
import base64
import io
import time
from PIL import Image
from app.ml.manager import ModelManager
from app.schemas.detection import DetectionItem, DetectionResponse

def decode_frame(b64_data: str) -> Image.Image:
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    raw = base64.b64decode(b64_data)
    return Image.open(io.BytesIO(raw)).convert("RGB")

def run_inference(image: Image.Image) -> list[DetectionItem]:
    model = ModelManager.get()
    results = model(image, conf=0.50, verbose=False)

    detections = []
    for result in results:
        for box in result.boxes:
            detections.append(DetectionItem(
                label=model.names[int(box.cls)],
                confidence=round(float(box.conf), 4),
                bbox=[round(v,2) for v in box.xyxy[0].tolist()]
            ))
    return detections

async def process_frame(b64_frame: str, frame_id: int | None) -> DetectionResponse:
    """Fungsi utama yang dipanggil router — semua async handling di sini."""
    t0 = time.perf_counter()
    image = await asyncio.to_thread(decode_frame, b64_frame)
    detections = await asyncio.to_thread(run_inference, image)
    elapsed_ms = (time.perf_counter() - t0) * 1000

    top = max(detections, key=lambda d: d.confidence) if detections else None
    return DetectionResponse(
        status="ok",
        frame_id=frame_id,
        inference_ms=round(elapsed_ms, 2),
        detections=detections,
        top_prediction=top,
    )