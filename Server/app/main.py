import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.ml.manager import ModelManager
from app.routers import detection, sibi, quiz
from app.core.database import Base, engine, SessionLocal
from app.models.quiz import SibiQuizQuestion, SibiQuizHistory
from app.services.sibi_seeder import seed_sibi_data
from app.services.quiz_seeder import seed_quiz_questions

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Memulai inisialisasi basis data PostgreSQL...")
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_sibi_data(db)
            seed_quiz_questions(db)
        finally:
            db.close()
    except Exception as e:
        logging.error(f"Gagal menginisialisasi basis data: {e}")
        logging.warning("Melanjutkan startup tanpa koneksi database yang sukses.")

    ModelManager.load()
    yield

app = FastAPI(
    title="Sign Language Detection API",
    version="2.0.0",
    lifespan=lifespan,
)

os.makedirs("images/sibi", exist_ok=True)

app.mount("/images", StaticFiles(directory="images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection.router)
app.include_router(sibi.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")