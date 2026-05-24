from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SibiQuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    image_path: Optional[str] = None
    options: List[str]
    correct_answer: str

    class Config:
        from_attributes = True

class SibiQuizSubmitRequest(BaseModel):
    score: int
    correct_answers: int
    total_questions: int

class SibiQuizHistoryResponse(BaseModel):
    id: int
    score: int
    correct_answers: int
    total_questions: int
    created_at: datetime

    class Config:
        from_attributes = True
