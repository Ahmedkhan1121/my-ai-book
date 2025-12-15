from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuizQuestion(BaseModel):
    """
    Model for quiz questions based on the API contract
    """
    question_id: str
    question_text: str
    question_type: str  # "multiple-choice", "short-answer", "true-false"
    options: Optional[List[str]] = []
    explanation: Optional[str] = None

class Answer(BaseModel):
    """
    Model for individual answers in quiz submissions
    """
    question_id: str
    answer_text: str

class QuizSubmission(BaseModel):
    """
    Model for quiz submissions based on the API contract
    """
    session_id: str
    answers: List[Answer]

class QuestionResult(BaseModel):
    """
    Model for individual question results
    """
    question_id: str
    is_correct: bool
    correct_answer: str
    user_answer: Optional[str] = None

class QuizResult(BaseModel):
    """
    Model for quiz results based on the API contract
    """
    submission_id: str
    score: float  # 0-100 percentage
    results: List[QuestionResult]