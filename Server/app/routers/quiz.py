import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Cookie, Response, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.core.database import get_db
from app.models.quiz import SibiQuizQuestion, SibiQuizHistory
from app.schemas.quiz import (
    SibiQuizQuestionResponse,
    SibiQuizSubmitRequest,
    SibiQuizHistoryResponse,
)

router = APIRouter(prefix="/quiz", tags=["SIBI Quiz"])

COOKIE_NAME = "quiz_session"

def get_or_create_session(response: Response, quiz_session: Optional[str] = Cookie(None)) -> str:
    """Mengambil session ID yang ada di cookie, atau membuat yang baru jika belum ada."""
    if quiz_session:
        return quiz_session

    new_session_id = str(uuid.uuid4())
    response.set_cookie(
        key=COOKIE_NAME,
        value=new_session_id,
        httponly=True,
        samesite="lax",
        max_age=31536000,
        path="/",
    )
    return new_session_id

@router.get("/questions", response_model=List[SibiQuizQuestionResponse])
def get_quiz_questions(
    response: Response,
    db: Session = Depends(get_db),
    quiz_session: Optional[str] = Cookie(None)
):
    """Mengambil 10 pertanyaan pilihan ganda SIBI acak dari database dan menempelkan Cookie Sesi jika belum ada."""
    get_or_create_session(response, quiz_session)
    questions = db.query(SibiQuizQuestion).order_by(func.random()).limit(10).all()
    return questions

@router.post("/submit", response_model=SibiQuizHistoryResponse, status_code=status.HTTP_201_CREATED)
def submit_quiz_score(
    payload: SibiQuizSubmitRequest,
    response: Response,
    db: Session = Depends(get_db),
    quiz_session: Optional[str] = Cookie(None)
):
    """Menyimpan skor hasil sesi kuis pengguna ke database PostgreSQL berdasarkan Cookie Sesi."""
    session_id = get_or_create_session(response, quiz_session)
    
    new_history = SibiQuizHistory(
        session_id=session_id,
        score=payload.score,
        correct_answers=payload.correct_answers,
        total_questions=payload.total_questions
    )
    
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@router.get("/history", response_model=List[SibiQuizHistoryResponse])
def get_quiz_history(
    db: Session = Depends(get_db),
    quiz_session: Optional[str] = Cookie(None)
):
    """Mengambil riwayat skor kuis khusus untuk pengguna aktif berdasarkan Cookie Sesi."""
    if not quiz_session:
        return []
    history = (
        db.query(SibiQuizHistory)
        .filter(SibiQuizHistory.session_id == quiz_session)
        .order_by(SibiQuizHistory.created_at.desc())
        .all()
    )
    return history
