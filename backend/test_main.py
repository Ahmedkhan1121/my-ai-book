"""
Basic tests for the Textbook RAG API
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "Textbook RAG API is running" in response.json()["message"]

def test_get_all_chapters():
    """Test getting all chapters"""
    response = client.get("/api/chapters")
    assert response.status_code == 200
    chapters = response.json()
    assert isinstance(chapters, list)
    assert len(chapters) > 0  # Should have at least one chapter

def test_get_specific_chapter():
    """Test getting a specific chapter"""
    # First get all chapters to find a valid ID
    chapters_response = client.get("/api/chapters")
    assert chapters_response.status_code == 200

    chapters = chapters_response.json()
    if chapters:
        chapter_id = chapters[0]["chapter_id"]
        response = client.get(f"/api/chapters/{chapter_id}")
        assert response.status_code == 200
        chapter = response.json()
        assert chapter["chapter_id"] == chapter_id

def test_query_endpoint():
    """Test the query endpoint with a simple query"""
    query_data = {
        "query": "What is Physical AI?",
        "session_id": "test_session_123",
        "include_citations": True
    }

    response = client.post("/api/query", json=query_data)
    assert response.status_code == 200

    result = response.json()
    assert "response" in result
    assert "citations" in result
    assert "query_id" in result
    assert isinstance(result["citations"], list)

def test_text_selection_query():
    """Test the text selection query endpoint"""
    query_data = {
        "selected_text": "Physical AI represents the intersection of artificial intelligence and physical systems",
        "query": "Explain this concept",
        "session_id": "test_session_123"
    }

    response = client.post("/api/query/text-selection", json=query_data)
    assert response.status_code == 200

    result = response.json()
    assert "response" in result
    assert "citations" in result
    assert "query_id" in result

def test_quiz_endpoints():
    """Test quiz-related endpoints"""
    # First get all chapters to find a valid chapter ID
    chapters_response = client.get("/api/chapters")
    assert chapters_response.status_code == 200

    chapters = chapters_response.json()
    if chapters:
        chapter_id = chapters[0]["chapter_id"]

        # Test getting quiz questions
        quiz_response = client.get(f"/api/quizzes/{chapter_id}")
        assert quiz_response.status_code in [200, 404]  # 404 if no questions for this chapter

        if quiz_response.status_code == 200:
            questions = quiz_response.json()
            assert isinstance(questions, list)

if __name__ == "__main__":
    pytest.main([__file__])