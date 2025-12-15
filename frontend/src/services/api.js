// API service for communicating with the backend
class ApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  }

  async getChapters() {
    try {
      const response = await fetch(`${this.baseUrl}/api/chapters`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  }

  async getChapter(chapterId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chapters/${chapterId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching chapter ${chapterId}:`, error);
      throw error;
    }
  }

  async submitQuery(query, sessionId, includeCitations = true) {
    try {
      const response = await fetch(`${this.baseUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          session_id: sessionId,
          include_citations: includeCitations
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting query:', error);
      throw error;
    }
  }

  async submitTextSelectionQuery(selectedText, query, sessionId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/query/text-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_text: selectedText,
          query: query,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting text selection query:', error);
      throw error;
    }
  }

  async getQuizQuestions(chapterId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/quizzes/${chapterId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching quiz questions for chapter ${chapterId}:`, error);
      throw error;
    }
  }

  async submitQuizAnswers(sessionId, answers) {
    try {
      const response = await fetch(`${this.baseUrl}/api/quizzes/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          answers: answers
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new ApiService();