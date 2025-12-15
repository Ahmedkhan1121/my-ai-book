# Research: AI-Native Textbook with RAG Chatbot

## Decision: Technology Stack Selection

**Rationale**: Selected a technology stack that balances functionality with free-tier constraints:
- Docusaurus for frontend textbook presentation: widely adopted, excellent documentation support, plugin ecosystem
- FastAPI for backend services: Python-based, async support, automatic API documentation
- Qdrant for vector storage: efficient similarity search, good Python integration, free-tier available
- Neon for PostgreSQL: serverless Postgres, generous free tier, Postgres compatibility
- OpenAI API or compatible LLM: proven quality for RAG applications

**Alternatives considered**:
- Next.js vs Docusaurus: Docusaurus is specifically designed for documentation sites and has built-in features for textbook-style content
- Express.js vs FastAPI: FastAPI provides better type safety and automatic API documentation
- Pinecone vs Qdrant: Qdrant is open-source and has a more generous free tier
- Supabase vs Neon: Neon offers serverless Postgres with better free-tier economics

## Decision: RAG Implementation Pattern

**Rationale**: Implement a standard RAG pattern with:
- Document chunking: Split textbook content into semantic chunks for vectorization
- Embedding generation: Create vector embeddings of textbook content for retrieval
- Retrieval: Use vector similarity search to find relevant content for queries
- Generation: Use LLM to generate responses based on retrieved content with citations

**Alternatives considered**:
- Pure keyword search: Less effective for semantic understanding
- Complex multi-model approaches: Would exceed free-tier computational limits
- Pre-generated answers: Less flexible than dynamic RAG approach

## Decision: Textbook Content Management

**Rationale**: Use markdown files in Docusaurus with:
- Frontmatter for metadata (chapter number, objectives, etc.)
- Standard markdown for content with occasional MDX for interactive elements
- Auto-generated sidebar from content structure
- Git-based version control for content changes

**Alternatives considered**:
- Database-stored content: More complex but not necessary for static textbook content
- CMS solution: Overkill for this use case, adds complexity and potential costs
- Static content with API: Docusaurus already handles content serving efficiently

## Decision: AI Interaction Model

**Rationale**: Implement a RAG system that:
- Processes user queries against textbook vector embeddings
- Returns answers with citations to specific chapters/sections
- Handles out-of-scope queries by indicating the limitation
- Provides a floating button for text selection queries

**Alternatives considered**:
- General-purpose LLM without constraints: Would violate RAG integrity principle
- Rule-based responses: Less flexible and requires more maintenance
- Multiple LLM providers: Complexity without clear benefit for this use case