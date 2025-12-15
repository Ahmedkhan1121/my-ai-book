from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Citation(BaseModel):
    """
    Model for citations in the API response
    """
    chapter_id: str
    chapter_title: str
    section: str
    content_preview: Optional[str] = None

class QueryRequest(BaseModel):
    """
    Model for query requests based on the API contract
    """
    query: str
    session_id: str
    include_citations: Optional[bool] = True

class QueryResponse(BaseModel):
    """
    Model for query responses based on the API contract
    """
    response: str
    citations: List[Citation]
    query_id: str
    confidence: Optional[float] = 1.0

class TextSelectionRequest(BaseModel):
    """
    Model for text selection requests based on the API contract
    """
    selected_text: str
    query: str
    session_id: str