import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.ml.manager import ModelManager
from app.routers import detection, sibi
from app.core.database import Base, engine, SessionLocal
from app.services.sibi_seeder import seed_sibi_data

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Memulai inisialisasi basis data PostgreSQL...")
    try:
        # Membuat tabel database otomatis jika belum ada
        Base.metadata.create_all(bind=engine)
        
        # Menjalankan database seeder otomatis untuk SIBI A-Z
        db = SessionLocal()
        try:
            seed_sibi_data(db)
        finally:
            db.close()
    except Exception as e:
        logging.error(f"Gagal menginisialisasi basis data: {e}")
        logging.warning("Melanjutkan startup tanpa koneksi database yang sukses.")

    # Memuat model YOLO
    ModelManager.load()
    yield

app = FastAPI(
    title="Sign Language Detection API",
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

app.include_router(detection.router)
app.include_router(sibi.router, prefix="/api")