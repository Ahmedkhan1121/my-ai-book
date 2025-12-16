from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import asyncio
import logging
from datetime import datetime
import os
from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

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
from .services.auth_service import AuthService, AuthCredentials, AuthTokens, User, auth_service

# Initialize services
content_service = ContentService()
quiz_service = QuizService()
session_service = SessionService()
rag_service = RAGService()

# Index all chapters in the vector database
try:
    rag_service.index_all_chapters()
    print("Successfully indexed all textbook chapters in vector database")
except Exception as e:
    print(f"Error indexing chapters: {str(e)}")
    print("Continuing without vector indexing...")

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

# Security scheme
security = HTTPBearer()

# Authentication routes
@app.post("/api/auth/register", response_model=AuthTokens)
async def register(credentials: AuthCredentials):
    """
    Register a new user
    """
    try:
        user = auth_service.create_user(
            username=credentials.username,
            email=credentials.username,  # For simplicity, using username as email
            password=credentials.password
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        tokens = auth_service.create_auth_tokens(user)
        logger.info(f"User registered: {credentials.username}")
        return tokens
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@app.post("/api/auth/login", response_model=AuthTokens)
async def login(credentials: AuthCredentials):
    """
    Authenticate user and return tokens
    """
    try:
        user = await auth_service.authenticate_user(
            credentials.username,
            credentials.password
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        tokens = auth_service.create_auth_tokens(user)
        logger.info(f"User logged in: {credentials.username}")
        return tokens
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@app.post("/api/auth/refresh")
async def refresh_token(request: Request):
    """
    Refresh access token using refresh token
    """
    try:
        # Get refresh token from request body
        body = await request.json()
        refresh_token = body.get("refresh_token")

        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Refresh token required"
            )

        new_tokens = auth_service.refresh_access_token(refresh_token)
        if not new_tokens:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        logger.info("Access token refreshed")
        return new_tokens
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

@app.post("/api/auth/logout")
async def logout(token: HTTPAuthorizationCredentials = Depends(security)):
    """
    Logout user (client-side token removal is sufficient for JWT)
    """
    # In a real implementation, you might want to add tokens to a blacklist
    # For now, we just return a success message
    logger.info("User logged out")
    return {"message": "Successfully logged out"}

# Protected route example
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Dependency to get current user from token
    """
    user = await auth_service.get_current_user(token.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.get("/api/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user info
    """
    return current_user

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