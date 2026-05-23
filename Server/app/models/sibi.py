from sqlalchemy import Column, Integer, String, Text, JSON
from app.core.database import Base

class SibiLetter(Base):
    __tablename__ = "sibi_letters"

    id = Column(Integer, primary_key=True, index=True)
    letter = Column(String(1), unique=True, index=True, nullable=False)  
    name = Column(String(50), nullable=False)                           
    description = Column(Text, nullable=False)                        
    gesture_steps = Column(JSON, nullable=True)
