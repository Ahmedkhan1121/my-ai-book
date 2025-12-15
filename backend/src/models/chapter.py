from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TextbookChapter(BaseModel):
    """
    Model for a textbook chapter based on the data model specification
    """
    chapter_id: str
    title: str
    content: str
    chapter_number: int
    learning_objectives: Optional[List[str]] = []
    prerequisites: Optional[List[str]] = []
    word_count: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class Chapter(BaseModel):
    """
    Model for the API response based on the contract specification
    """
    chapter_id: str
    title: str
    chapter_number: int
    content: str
    learning_objectives: Optional[List[str]] = []
    word_count: Optional[int] = 0