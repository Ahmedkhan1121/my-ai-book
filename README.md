# Physical AI & Humanoid Robotics — Essentials

A short, clean, professional AI-Native textbook with RAG chatbot for learning Physical AI and Humanoid Robotics concepts.

## Overview

This project implements an interactive textbook with 6 chapters covering:
1. Introduction to Physical AI
2. Basics of Humanoid Robotics
3. ROS 2 Fundamentals
4. Digital Twin Simulation (Gazebo + Isaac)
5. Vision-Language-Action Systems
6. Capstone: Simple AI-Robot Pipeline

The textbook features:
- Docusaurus-based frontend with clean UI
- AI-powered Q&A system that only responds with textbook content
- Auto-generated navigation sidebar
- End-of-chapter quizzes
- Text selection feature to ask AI about specific content
- Optional personalization and multi-language support

## Architecture

The system uses a web application architecture with:
- **Frontend**: Docusaurus for textbook content and UI
- **Backend**: FastAPI for AI processing and API services
- **Vector Database**: Qdrant for RAG system
- **Relational Database**: Neon (PostgreSQL) for structured data
- **AI Model**: Integration with OpenAI-compatible LLMs

## Getting Started

### Prerequisites

- Node.js 18+ for frontend
- Python 3.11+ for backend
- Docker for local development (for Qdrant)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-ai-book
   ```

2. **Set up frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create `.env` files in both frontend and backend directories based on the examples provided.

5. **Start Qdrant vector database**
   ```bash
   docker-compose up -d
   ```

6. **Start backend server**
   ```bash
   cd backend
   uvicorn src.main:app --reload --port 8000
   ```

7. **Start frontend development server**
   ```bash
   cd frontend
   npm start
   ```

## Features

### Textbook Content
- 6 comprehensive chapters covering Physical AI and Humanoid Robotics
- Interactive navigation with auto-generated sidebar
- Learning objectives for each chapter
- Responsive design for all devices

### AI Assistant
- RAG (Retrieval Augmented Generation) system
- Only responds with information from textbook content
- Citations to specific chapters/sections
- Text selection feature to ask questions about highlighted content

### Assessment
- End-of-chapter quizzes
- Automatic grading with explanations
- Progress tracking

### Personalization
- Difficulty level adjustment
- Multi-language support (Urdu translation)
- Reading progress tracking

## API Endpoints

### Chapter Endpoints
- `GET /api/chapters` - Get all textbook chapters
- `GET /api/chapters/{chapterId}` - Get a specific chapter

### AI Query Endpoints
- `POST /api/query` - Submit a query to the RAG system
- `POST /api/query/text-selection` - Query about selected text

### Quiz Endpoints
- `GET /api/quizzes/{chapterId}` - Get quiz questions for a chapter
- `POST /api/quizzes/submit` - Submit quiz answers

## Development

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

### Project Structure

```
my-ai-book/
├── backend/              # FastAPI backend
│   ├── src/
│   │   ├── models/       # Pydantic models
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt
│   └── .env
├── frontend/             # Docusaurus frontend
│   ├── docs/             # Textbook content
│   ├── src/              # Custom components
│   ├── docusaurus.config.js
│   └── sidebars.js
├── docker-compose.yml    # Docker configuration
└── specs/                # Specification files
    └── 1-textbook-generation/
```

## Deployment

For production deployment:
1. Build the frontend: `npm run build`
2. Deploy the backend as a FastAPI application
3. Set up proper environment variables
4. Configure the reverse proxy to serve both frontend and backend

## Contributing

This project follows the Spec-Driven Development approach. All changes should be made through the specification, planning, and task system in the `specs/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Docusaurus for the documentation framework
- FastAPI for the web framework
- Qdrant for vector database capabilities
- OpenAI for language model integration