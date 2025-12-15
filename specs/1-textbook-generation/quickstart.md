# Quickstart: AI-Native Textbook with RAG Chatbot

## Prerequisites

- Node.js 18+ for Docusaurus frontend
- Python 3.11+ for backend services
- Docker (for local Qdrant instance)
- Access to an LLM API (OpenAI, Azure OpenAI, or compatible)

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create `.env` files in both frontend and backend directories:

   **Backend (.env):**
   ```env
   QDRANT_URL=http://localhost:6333
   QDRANT_API_KEY=your_qdrant_api_key
   LLM_API_KEY=your_llm_api_key
   LLM_API_BASE_URL=https://api.openai.com/v1  # or your compatible endpoint
   LLM_MODEL_NAME=gpt-4-turbo  # or your preferred model
   NEON_DATABASE_URL=your_neon_db_url
   ```

   **Frontend (.env):**
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

## Local Development

1. **Start Qdrant vector database**
   ```bash
   docker run -p 6333:6333 --name qdrant-container qdrant/qdrant
   ```

2. **Start backend API server**
   ```bash
   cd backend
   uvicorn src.main:app --reload --port 8000
   ```

3. **Start frontend development server**
   ```bash
   cd frontend
   npm start
   ```

## Initial Content Setup

1. **Add textbook chapters**
   - Place markdown files in `frontend/docs/` directory
   - Follow the naming convention: `ch1-introduction-to-physical-ai.md`
   - Include frontmatter with metadata:

   ```markdown
   ---
   id: ch1-introduction-to-physical-ai
   title: Introduction to Physical AI
   sidebar_label: Chapter 1
   chapter_number: 1
   learning_objectives:
     - Understand the basics of Physical AI
     - Learn about key concepts and applications
   ---

   # Introduction to Physical AI

   Physical AI represents the intersection of artificial intelligence and physical systems...
   ```

2. **Update sidebar configuration**
   Edit `frontend/sidebars.js` to include new chapters in navigation:

   ```javascript
   module.exports = {
     textbook: [
       'ch1-introduction-to-physical-ai',
       'ch2-basics-of-humanoid-robotics',
       'ch3-ros-2-fundamentals',
       // ... add other chapters
     ],
   };
   ```

## Loading Content into RAG System

1. **Process textbook content into vector database**
   ```bash
   cd backend
   python -m src.scripts.load_textbook_content
   ```

2. **Verify content loading**
   Check that textbook chapters are properly chunked and stored in Qdrant with embeddings.

## Running Tests

1. **Backend tests**
   ```bash
   cd backend
   pytest
   ```

2. **Frontend tests**
   ```bash
   cd frontend
   npm test
   ```

## Production Deployment

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy backend API**
   - Deploy to a cloud platform (AWS, GCP, Azure, or Vercel/Netlify)
   - Ensure environment variables are configured
   - Set up SSL certificates if needed

3. **Configure domain and CDN**
   - Point your domain to the deployed frontend
   - Configure API endpoint in frontend environment