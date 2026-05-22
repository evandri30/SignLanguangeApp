from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.sibi import SibiLetter
from app.schemas.sibi import SibiLetterResponse
from app.services.sibi_seeder import seed_sibi_data
from typing import List

router = APIRouter(prefix="/sibi", tags=["SIBI Info"])

@router.get("/", response_model=List[SibiLetterResponse])
def get_all_sibi_letters(db: Session = Depends(get_db)):
    """Mendapatkan daftar semua huruf SIBI A-Z berurutan secara alfabetis."""
    letters = db.query(SibiLetter).order_by(SibiLetter.letter.asc()).all()
    return letters

@router.get("/{letter}", response_model=SibiLetterResponse)
def get_sibi_letter_detail(letter: str, db: Session = Depends(get_db)):
    """Mendapatkan informasi detail dan langkah-langkah isyarat untuk huruf tertentu."""
    if len(letter) != 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Parameter letter harus berupa satu karakter tunggal."
        )
    
    char = letter.lower()
    db_letter = db.query(SibiLetter).filter(SibiLetter.letter == char).first()
    if not db_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Informasi SIBI untuk huruf '{letter}' tidak ditemukan."
        )
    return db_letter

@router.post("/seed", status_code=status.HTTP_201_CREATED)
def trigger_seeding(db: Session = Depends(get_db)):
    """Memicu seeding data SIBI A-Z ke database secara manual."""
    seed_sibi_data(db)
    return {"message": "Proses seeding data SIBI berhasil dipicu."}
