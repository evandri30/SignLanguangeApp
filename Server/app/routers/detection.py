import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.detection import process_frame
from app.ml.manager import ModelManager

logger = logging.getLogger(__name__)
router = APIRouter()

# Connection Manager 
class ConnectionManager:
    def __init__(self):
        self._active: dict[str, WebSocket] = {}

    async def connect(self, client_id: str, ws: WebSocket):
        await ws.accept()
        self._active[client_id] = ws
        logger.info(f"Client {client_id} connected. Total: {len(self._active)}")

    def disconnect(self, client_id: str):
        self._active.pop(client_id, None)
        logger.info(f"Client {client_id} disconnected.")

    @property
    def count(self):
        return len(self._active)

manager = ConnectionManager()

@router.get("/", tags=["Health"])
def health_check():
    return {"message": "API is running.", "active_connections": manager.count}

@router.get("/model-info", tags=["Health"])
def model_info():
    model = ModelManager.get()
    return {"classes": model.names, "num_classes": len(model.names)}

@router.websocket("/ws/detect/{client_id}")
async def websocket_detect(ws: WebSocket, client_id: str):
    await manager.connect(client_id, ws)
    try:
        while True:
            raw = await ws.receive_text()

            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                await ws.send_json({"status": "error", "message": "Invalid JSON"})
                continue

            b64_frame = payload.get("frame")
            frame_id = payload.get("frame_id")

            if not b64_frame:
                await ws.send_json({"status": "error", "message": "Missing 'frame'"})
                continue

            try:
                response = await process_frame(b64_frame, frame_id)
                await ws.send_json(response.model_dump())
            except WebSocketDisconnect:
                raise
            except Exception as exc:
                logger.warning(f"Error for client {client_id}: {exc}")
                try:
                    await ws.send_json({"status": "error", "message": str(exc)})
                except Exception:
                    pass

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(client_id)