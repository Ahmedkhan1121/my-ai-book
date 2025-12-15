from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import asyncio
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models and services
from .models.chapter import Chapter, TextbookChapter
from .models.query import QueryRequest, QueryResponse, TextSelectionRequest, Citation
from .models.quiz import QuizQuestion, QuizSubmission, QuizResult, Answer, QuestionResult
from .services.rag_service import RAGService
from .services.content_service import ContentService
from .services.quiz_service import QuizService
from .services.session_service import SessionService

# Initialize services
rag_service = RAGService()
content_service = ContentService()
quiz_service = QuizService()
session_service = SessionService()

# Initialize FastAPI app
app = FastAPI(
    title="Textbook RAG API",
    description="API for the AI-Native Textbook with RAG Chatbot",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
async def root():
    return {"message": "Textbook RAG API is running"}

@app.get("/api/chapters")
async def get_all_chapters():
    """
    Retrieve a list of all textbook chapters with basic information
    """
    try:
        chapters = content_service.get_all_chapters()
        return chapters
    except Exception as e:
        logger.error(f"Error retrieving chapters: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/chapters/{chapter_id}")
async def get_chapter(chapter_id: str):
    """
    Retrieve the content and details of a specific textbook chapter
    """
    try:
        chapter = content_service.get_chapter_by_id(chapter_id)
        if not chapter:
            raise HTTPException(status_code=404, detail="Chapter not found")
        return chapter
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving chapter {chapter_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/query")
async def submit_query(request: QueryRequest):
    """
    Submit a user question and get an AI response based on textbook content
    """
    try:
        # Process the query through the RAG service
        response = await rag_service.process_query(request)
        return response
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing query")

@app.post("/api/query/text-selection")
async def query_text_selection(request: TextSelectionRequest):
    """
    Submit a query about selected text content
    """
    try:
        # Process the text selection query through the RAG service
        response = await rag_service.process_text_selection_query(request)
        return response
    except Exception as e:
        logger.error(f"Error processing text selection query: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing query")

@app.get("/api/quizzes/{chapter_id}")
async def get_quiz_questions(chapter_id: str):
    """
    Retrieve quiz questions for a specific chapter
    """
    try:
        questions = quiz_service.get_questions_by_chapter(chapter_id)
        if not questions:
            raise HTTPException(status_code=404, detail="Chapter not found or no questions available")
        return questions
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving quiz questions for chapter {chapter_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/quizzes/submit")
async def submit_quiz_answers(submission: QuizSubmission):
    """
    Submit answers to quiz questions
    """
    try:
        result = quiz_service.submit_answers(submission)
        return result
    except Exception as e:
        logger.error(f"Error submitting quiz answers: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing quiz submission")

# WebSocket endpoint for real-time communication
@app.websocket("/ws/session/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await session_service.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Process the received data
            await session_service.process_message(websocket, session_id, data)
    except WebSocketDisconnect:
        session_service.disconnect(websocket, session_id)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        session_service.disconnect(websocket, session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )