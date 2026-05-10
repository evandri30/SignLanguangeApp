from ultralytics import YOLO

def latih_model():
    # Panggil yolo
    model = YOLO('yolov8n.pt') 

    # Mulai belajar
    print("Mulai Proses Training....")
    results = model.train(
        data="datasets/data.yaml",
        epochs=100,
        imgsz=640,
        plots=True,
        device=0
    )

if __name__ == "__main__":
    latih_model()