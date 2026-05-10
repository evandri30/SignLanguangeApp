from fastapi import FastAPI, UploadFile, File 
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io 

app = FastAPI()

# Setup Cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Mode
model = YOLO("model/best.pt")

# Route awal
@app.get("/")
def read_post():
    return {"message" : "Backend Sign Languange Ready"}

# Route untuk deteksi 
@app.post("/predict/")
async def predict_sign(file: UploadFile = File(...) ):
    try:
        # Baca file gambar
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Prediksi yolo
        results = model(image)

        # Ambil hasil
        detections = []
        for result in results:
            for box in result.boxes:
                detections.append({
                    "label": model.names[int(box.cls)],
                    "confidence" : float(box.conf),
                    "bbox" : box.xyxy[0].tolist()
                })

        return {"filename" : file.filename, "detections" : detections}
    except Exception as e:
        return {"error" : str(e)}