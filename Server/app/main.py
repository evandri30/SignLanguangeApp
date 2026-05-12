# Import Library
import asyncio
import base64
import io
import json
import logging
import time
from contextlib import asynccontextmanager
from typing import Optional
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("sign-language-api")

# Model Singleton
class ModelManager:
    _model: Optional[YOLO] = None

    @classmethod
    def load(cls, path:str = "model/best.pt") -> None:
        if cls._model is None:
            logger.info(f"Loading YOLO model from {path}...")
            cls._model = YOLO(path)
            logger.info("Model loaded successfully.")

    @classmethod
    def get(cls) -> YOLO:
        if cls._model is None:
            raise RuntimeError("Model has not been loaded yet")
        return cls._model

# Lifespan Events
@asynccontextmanager
async def lifespan(app: FastAPI):
    ModelManager.load()
    yield
    logger.info("Shutting down server...")

# App
app = FastAPI(
    title="Sign Language Detection API",
    description="Real-time sign language detection via WebSocket + YOLO.",
    version="2.0.0",
    lifespan=lifespan,
)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connection Manager
class ConnectionManager:
    def __init__(self) -> None:
        self._active: dict[str, WebSocket] = {}

    async def connect(self, client_id: str, ws: WebSocket) -> None:
        await ws.accept()
        self._active[client_id] = ws
        logger.info(f"Client {client_id} connected. Total clients: {len(self._active)}")

    def disconnect(self, client_id: str) -> None:
        self._active.pop(client_id, None)
        logger.info(f"Client disconnected → {client_id}  (total: {len(self._active)})")

    @property
    def count(self) -> int:
        return len(self._active)

manager = ConnectionManager()

# Helper
def decode_frame(b64_data: str) -> Image.Image:
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    raw = base64.b64decode(b64_data)
    return Image.open(io.BytesIO(raw)).convert("RGB")

def run_inference(image: Image.Image) -> list[dict]:
    model = ModelManager.get()
    results = model(image, verbose=False)

    detections: list[dict] = []
    for result in results:
        for box in result.boxes:
            detections.append(
                {
                    "label": model.names[int(box.cls)],
                    "confidence": round(float(box.conf), 4),
                    "bbox": [round(v,2) for v in box.xyxy[0].tolist()]
                }
            )
    return detections

def build_response(
        detections: list[dict],
        inference_ms: float,
        frame_id: Optional[int] = None,
) -> dict:
    top = max(detections, key=lambda d: d["confidence"]) if detections else None
    return {
        "status" : "ok",
        "frame_id" : frame_id,
        "inference_ms" : round(inference_ms, 2),
        "detections" : detections,
        "top_prediction" : top,
    }

# Routes
@app.get("/", tags=["Health"])
def health_check():
    return {
        "message" : "Sign Language Detection API is running.",
        "Active_connections" : manager.count,
    }

@app.get("/model-info", tags=["Health"])
def model_info():
    model = ModelManager.get()
    return {
        "classes" : model.names,
        "num_classes" : len(model.names),
    }

@app.websocket('/ws/detect/{client_id}')
async def websocket_detect(ws: WebSocket, client_id: str):
    await manager.connect(client_id, ws)
    try:
        while True:
            # Receive 
            raw = await ws.receive_text()

            try:
                payloaad = json.loads(raw)
            except json.JSONDecodeError:
                await ws.send_json({"status": "error", "message": "Invalid JSON payload"})
                continue

            b64_frame = payloaad.get("frame")
            frame_id = payloaad.get("frame_id")

            if not b64_frame:
                await ws.send_json({"status": "error", "message": "Missing 'frame' in payload"})
                continue

            # decode frame
            try:
                t0 = time.perf_counter()
                image = await asyncio.to_thread(decode_frame, b64_frame)
                detections = await asyncio.to_thread(run_inference, image)
                elapsed_ms = (time.perf_counter() - t0) * 1000
            except Exception as exc:
                logger.warning(f"Interference error for client {client_id}: {exc}")
                await ws.send_json({"status": "error", "message": str(exc)})
                continue

            # Response
            response = build_response(detections, elapsed_ms, frame_id)
            await ws.send_json(response)
 
            logger.debug(
                f"{client_id} | frame={frame_id} | "
                f"{len(detections)} detection(s) | {elapsed_ms:.1f} ms"
            )
    
    except WebSocketDisconnect:
        pass
    except Exception as exc:
        logger.error(f"Unexpected error for client {client_id}: {exc}")
    finally:
        manager.disconnect(client_id)