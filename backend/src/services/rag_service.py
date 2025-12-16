import asyncio
import uuid
from typing import List, Optional
from datetime import datetime
from ..models.query import QueryRequest, QueryResponse, TextSelectionRequest, Citation
from ..models.chapter import Chapter
from .content_service import ContentService
from .vector_service import VectorService
from .embeddings_service import EmbeddingsService
import logging
import os
from openai import AsyncOpenAI

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGService:
    """
    Service for handling RAG (Retrieval Augmented Generation) queries
    """
    def __init__(self):
        self.content_service = ContentService()
        self.vector_service = VectorService()
        self.embeddings_service = EmbeddingsService()

        # Initialize OpenAI client
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            logger.warning("OPENAI_API_KEY not found in environment variables")
        self.openai_client = AsyncOpenAI(api_key=openai_api_key) if openai_api_key else None

    async def process_query(self, request: QueryRequest) -> QueryResponse:
        """
        Process a user query against textbook content
        """
        logger.info(f"Processing query: {request.query}")

        # Find relevant content based on the query using vector search
        relevant_chunks = await self._find_relevant_content(request.query)

        # Generate response based on relevant content using AI
        response_text = await self._generate_response(request.query, relevant_chunks)

        # Create citations for the response
        citations = self._create_citations(relevant_chunks)

        # Create and return the response
        response = QueryResponse(
            response=response_text,
            citations=citations,
            query_id=str(uuid.uuid4()),
            confidence=0.9  # Placeholder confidence
        )

        logger.info(f"Generated response with {len(citations)} citations")
        return response

    async def process_text_selection_query(self, request: TextSelectionRequest) -> QueryResponse:
        """
        Process a query about selected text
        """
        logger.info(f"Processing text selection query: {request.query}")

        # Combine the selected text with the query for context
        full_query = f"Regarding this text: '{request.selected_text}'. {request.query}"

        # Find relevant content based on the combined query
        relevant_chunks = await self._find_relevant_content(full_query)

        # Generate response based on relevant content
        response_text = await self._generate_response(request.query, relevant_chunks)

        # Create citations for the response
        citations = self._create_citations(relevant_chunks)

        # Create and return the response
        response = QueryResponse(
            response=response_text,
            citations=citations,
            query_id=str(uuid.uuid4()),
            confidence=0.9  # Placeholder confidence
        )

        logger.info(f"Generated response for text selection with {len(citations)} citations")
        return response

    async def _find_relevant_content(self, query: str) -> List[Dict]:
        """
        Find relevant content in the textbook based on the query using vector search
        """
        try:
            # Use vector search to find relevant content
            search_results = self.vector_service.search_content(query, limit=5)

            # Convert search results to the expected format
            relevant_chunks = []
            for result in search_results:
                # Create a temporary Chapter-like object from the search result
                chunk = {
                    "chapter_id": result["chapter_id"],
                    "content": result["content"],
                    "title": result["metadata"].get("title", "Unknown Chapter"),
                    "score": result["score"]  # Add similarity score
                }
                relevant_chunks.append(chunk)

            logger.info(f"Found {len(relevant_chunks)} relevant chunks for query")
            return relevant_chunks
        except Exception as e:
            logger.error(f"Error finding relevant content: {str(e)}")
            # Fallback to content service if vector search fails
            all_chapters = self.content_service.get_all_chapters()
            return [{"chapter_id": ch.chapter_id, "content": ch.content, "title": ch.title, "score": 0.0}
                   for ch in all_chapters[:3]]

    async def _generate_response(self, query: str, relevant_chunks: List[Dict]) -> str:
        """
        Generate a response based on the query and relevant content using AI
        """
        if not relevant_chunks:
            return "I couldn't find relevant content in the textbook to answer your question. The AI assistant can only respond based on information from the textbook content."

        # Build context from relevant chunks
        context = "Relevant textbook content:\n\n"
        for i, chunk in enumerate(relevant_chunks):
            context += f"Section {i+1} ({chunk['title']}):\n{chunk['content']}\n\n"

        # Build the full prompt
        prompt = f"""
        You are an AI assistant for an AI textbook. Answer the user's question based on the provided textbook content.

        Context:
        {context}

        User's question: {query}

        Please provide a comprehensive answer based on the textbook content. If the content doesn't contain enough information to answer the question, say so clearly.
        """

        try:
            if self.openai_client:
                # Use OpenAI API for response generation
                response = await self.openai_client.chat.completions.acreate(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are an AI assistant for an AI textbook. Answer questions based on the provided context. Be helpful, accurate, and cite information when possible."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=500,
                    temperature=0.7
                )
                return response.choices[0].message.content.strip()
            else:
                # Fallback response if OpenAI API is not available
                logger.warning("OpenAI API not available, using fallback response")
                response = f"Based on the textbook content, here's what I found regarding your question '{query}':\n\n"

                # Extract relevant information from chunks
                for chunk in relevant_chunks[:2]:  # Use first 2 chunks
                    content_preview = chunk['content'][:300] + "..." if len(chunk['content']) > 300 else chunk['content']
                    response += f"From '{chunk['title']}': {content_preview}\n\n"

                response += "\nThis information is based on the textbook content as specified."
                return response
        except Exception as e:
            logger.error(f"Error generating response with AI: {str(e)}")
            # Fallback response
            return f"Based on the textbook content: {relevant_chunks[0]['content'][:500]}... This information is from the chapter '{relevant_chunks[0]['title']}'."

    def _create_citations(self, relevant_chunks: List[Dict]) -> List[Citation]:
        """
        Create citations for the response based on relevant content
        """
        citations = []

        for chunk in relevant_chunks:
            citation = Citation(
                chapter_id=chunk["chapter_id"],
                chapter_title=chunk["title"],
                section="Relevant Section",  # More specific section info would come from metadata
                content_preview=chunk["content"][:100] + "..." if len(chunk["content"]) > 100 else chunk["content"]
            )
            citations.append(citation)

        return citations

    def index_all_chapters(self):
        """
        Index all chapters in the content service into the vector database
        """
        try:
            all_chapters = self.content_service.get_all_chapters()
            logger.info(f"Indexing {len(all_chapters)} chapters into vector database")

            for chapter in all_chapters:
                # Delete existing content for this chapter (to update)
                self.vector_service.delete_chapter(chapter.chapter_id)

                # Store the chapter in vector database
                self.vector_service.store_chapter(chapter)

            logger.info(f"Successfully indexed {len(all_chapters)} chapters")
        except Exception as e:
            logger.error(f"Error indexing chapters: {str(e)}")
            raise