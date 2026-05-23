from pydantic import BaseModel
from typing import List, Optional

class SibiLetterResponse(BaseModel):
    id: int
    letter: str
    name: str
    description: str
    gesture_steps: Optional[List[str]] = None

    class Config:
        from_attributes = True
