import cv2
from ultralytics import YOLO
from collections import deque, Counter

def main():
    # Panggil model yolo
    MODEL_PATH = '#'
    model = YOLO(MODEL_PATH)

    # nyalain web cam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Tidak dapat membuka kamera")
        return

    print("Kamera berhasil dibuka. Mulai deteksi...")
    print("Tekan 'q' untuk keluar.")

    history = deque(maxlen=10)
    
    last_stable_result = "-"

    while True:
        # Baca frame dari kamera
        success, frame = cap.read()

        if success:
            frame = cv2.flip(frame, 1)

            # model tebak
            results = model.predict(frame, conf=0.50, verbose=False)
            boxes = results[0].boxes
            
            if len(boxes) > 0:
                # Ambil nama kelas tertinggi
                class_id = int(boxes.cls[0].item())
                class_name = model.names[class_id]
                
                # Masukkan ke history
                history.append(class_name)
                
                last_stable_result = Counter(history).most_common(1)[0][0] 

            annotated_frame = results[0].plot()

            cv2.rectangle(annotated_frame, (10, 10), (350, 70), (0, 0, 0), -1)
            
            cv2.putText(annotated_frame, f"Hasil: {last_stable_result}", (20, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

            # tampilkan ke layar
            cv2.imshow("Deteksi Objek", annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            print("Gagal membaca frame dari kamera")
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()