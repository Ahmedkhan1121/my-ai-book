from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmbeddingsService:
    """
    Service for generating embeddings from text content
    """
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the embeddings service with a pre-trained model
        """
        self.model = SentenceTransformer(model_name)
        logger.info(f"Embeddings model '{model_name}' loaded successfully")

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate a single embedding for the given text
        """
        try:
            embedding = self.model.encode([text])
            return embedding[0].tolist()  # Convert to list for JSON serialization
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts
        """
        try:
            embeddings = self.model.encode(texts)
            return [embedding.tolist() for embedding in embeddings]
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise

    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """
        Calculate cosine similarity between two embedding vectors
        """
        v1 = np.array(vec1)
        v2 = np.array(vec2)
        similarity = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
        return float(similarity)