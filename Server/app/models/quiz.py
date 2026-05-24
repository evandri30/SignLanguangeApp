from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class SibiQuizQuestion(Base):
    __tablename__ = "sibi_quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String(500), nullable=False)
    image_path = Column(String(250), nullable=True) 
    options = Column(JSON, nullable=False)          
    correct_answer = Column(String(10), nullable=False) 

class SibiQuizHistory(Base):
    __tablename__ = "sibi_quiz_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=False, index=True) 
    score = Column(Integer, nullable=False)            
    correct_answers = Column(Integer, nullable=False)  
    total_questions = Column(Integer, nullable=False)  
    created_at = Column(DateTime, default=func.now())
