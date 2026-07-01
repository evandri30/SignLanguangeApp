# Sign Language Detection Web App

Project ini adalah aplikasi web cerdas untuk mendeteksi bahasa isyarat secara _real-time_ menggunakan kamera.

## 🛠️ Tech Stack

- **Machine Learning:** YOLO (Ultralytics) & OpenCV
- **Backend (Server):** FastAPI (Python)
- **Frontend (Client):** React.js (Typescript)

## 📂 Struktur Direktori

- `AI/` - Berisi _script_ untuk _training_ model YOLO, pengaturan _dataset_, dan _testing_ model lokal.
- `Server/` - Tempat berjalannya sistem _backend_ menggunakan FastAPI sebagai penghubung antara model AI dan _frontend_.
- `Client/` - Tempat _source code_ _frontend_ React untuk antarmuka pengguna.
