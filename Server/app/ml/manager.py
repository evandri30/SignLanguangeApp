import logging
from typing import Optional
from ultralytics import YOLO
from app.core.config import MODEL_PATH

logger = logging.getLogger(__name__)

class ModelManager:
    _model: Optional[YOLO] = None

    @classmethod
    def load(cls, path:str = MODEL_PATH) -> None:
        if cls._model is None:
            logger.info(f"Loading YOLO model from {path}...")
            cls._model = YOLO(path)
            logger.info("Model loaded successfully.")

    @classmethod
    def get(cls) -> YOLO:
        if cls._model is None:
            raise RuntimeError("Model has not been loaded yet")
        return cls._model