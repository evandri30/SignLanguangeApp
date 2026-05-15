from pydantic import BaseModel
from typing import Optional

class DetectionItem(BaseModel):
    label: str
    confidence: float
    bbox: list[float]

class DetectionResponse(BaseModel):
    status: str
    frame_id: Optional[int]
    inference_ms: float
    detections: list[DetectionItem]
    top_prediction: Optional[DetectionItem]