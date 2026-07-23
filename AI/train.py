from ultralytics import YOLO

def train_model():
    # load model
    model = YOLO('yolov8n.pt') 

    # train model
    print("Mulai Proses Training....")
    results = model.train(
        data="datasets/data.yaml",
        epochs=100,
        imgsz=640,
        plots=True,
        device=0
    )

if __name__ == "__main__":
    train_model()