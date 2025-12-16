from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Optional
import uuid
import logging
from ..models.chapter import Chapter

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VectorService:
    """
    Service for managing vector storage and retrieval using Qdrant
    """
    def __init__(self, host: str = "localhost", port: int = 6333):
        """
        Initialize the vector service with Qdrant connection
        """
        try:
            self.client = QdrantClient(host=host, port=port)
            self.collection_name = "textbook_content"
            self._init_collection()
            logger.info("Connected to Qdrant successfully")
        except Exception as e:
            logger.error(f"Error connecting to Qdrant: {str(e)}")
            # For development, use in-memory storage
            self.client = QdrantClient(":memory:")
            self.collection_name = "textbook_content"
            self._init_collection()
            logger.info("Using in-memory Qdrant for development")

    def _init_collection(self):
        """
        Initialize the Qdrant collection for textbook content
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections().collections
            collection_exists = any(col.name == self.collection_name for col in collections)

            if not collection_exists:
                # Create collection with vector configuration
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=384,  # Size of all-MiniLM-L6-v2 embeddings
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created collection '{self.collection_name}'")
            else:
                logger.info(f"Collection '{self.collection_name}' already exists")
        except Exception as e:
            logger.error(f"Error initializing collection: {str(e)}")
            raise

    def store_content(self, chapter_id: str, content: str, metadata: Dict = None) -> str:
        """
        Store content in the vector database with its embedding
        """
        try:
            from .embeddings_service import EmbeddingsService
            embeddings_service = EmbeddingsService()

            # Generate embedding for the content
            embedding = embeddings_service.generate_embedding(content)

            # Create a unique ID for this content chunk
            point_id = str(uuid.uuid4())

            # Prepare the payload with metadata
            payload = {
                "chapter_id": chapter_id,
                "content": content,
                "metadata": metadata or {}
            }

            # Store in Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    models.PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload=payload
                    )
                ]
            )

            logger.info(f"Stored content for chapter {chapter_id} with point ID {point_id}")
            return point_id

        except Exception as e:
            logger.error(f"Error storing content: {str(e)}")
            raise

    def search_content(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Search for relevant content based on the query
        """
        try:
            from .embeddings_service import EmbeddingsService
            embeddings_service = EmbeddingsService()

            # Generate embedding for the query
            query_embedding = embeddings_service.generate_embedding(query)

            # Search in Qdrant
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=limit
            )

            # Extract relevant information from results
            results = []
            for hit in search_results:
                result = {
                    "id": hit.id,
                    "content": hit.payload["content"],
                    "chapter_id": hit.payload["chapter_id"],
                    "metadata": hit.payload.get("metadata", {}),
                    "score": hit.score
                }
                results.append(result)

            logger.info(f"Found {len(results)} results for query")
            return results

        except Exception as e:
            logger.error(f"Error searching content: {str(e)}")
            raise

    def store_chapter(self, chapter: Chapter, chunk_size: int = 500):
        """
        Store a complete chapter by breaking it into chunks
        """
        try:
            # Split the chapter content into chunks
            content = chapter.content
            chunks = []

            # Simple chunking by character count
            for i in range(0, len(content), chunk_size):
                chunk = content[i:i + chunk_size]
                chunks.append({
                    "text": chunk,
                    "chunk_id": i // chunk_size,
                    "total_chunks": len(content) // chunk_size + (1 if len(content) % chunk_size else 0)
                })

            # Store each chunk
            stored_ids = []
            for chunk_info in chunks:
                metadata = {
                    "title": chapter.title,
                    "chapter_id": chapter.chapter_id,
                    "chunk_id": chunk_info["chunk_id"],
                    "total_chunks": chunk_info["total_chunks"],
                    "author": chapter.author,
                    "created_at": chapter.created_at.isoformat() if chapter.created_at else None
                }

                point_id = self.store_content(
                    chapter_id=chapter.chapter_id,
                    content=chunk_info["text"],
                    metadata=metadata
                )
                stored_ids.append(point_id)

            logger.info(f"Stored chapter {chapter.chapter_id} as {len(stored_ids)} chunks")
            return stored_ids

        except Exception as e:
            logger.error(f"Error storing chapter: {str(e)}")
            raise

    def delete_chapter(self, chapter_id: str):
        """
        Delete all content related to a specific chapter
        """
        try:
            # Search for all points with this chapter_id
            search_results = self.client.scroll(
                collection_name=self.collection_name,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="payload.chapter_id",
                            match=models.MatchValue(value=chapter_id)
                        )
                    ]
                ),
                limit=10000  # Adjust based on expected number of chunks
            )

            # Extract point IDs to delete
            point_ids = [hit.id for hit in search_results[0]]

            if point_ids:
                # Delete the points
                self.client.delete(
                    collection_name=self.collection_name,
                    points_selector=models.PointIdsList(
                        points=point_ids
                    )
                )
                logger.info(f"Deleted {len(point_ids)} chunks for chapter {chapter_id}")
            else:
                logger.info(f"No chunks found for chapter {chapter_id}")

        except Exception as e:
            logger.error(f"Error deleting chapter: {str(e)}")
            raise

    def clear_collection(self):
        """
        Clear all content from the collection (use with caution!)
        """
        try:
            self.client.delete_collection(self.collection_name)
            self._init_collection()
            logger.info(f"Cleared and reinitialized collection '{self.collection_name}'")
        except Exception as e:
            logger.error(f"Error clearing collection: {str(e)}")
            raise