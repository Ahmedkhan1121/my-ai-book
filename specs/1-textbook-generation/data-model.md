# Data Model: AI-Native Textbook with RAG Chatbot

## Core Entities

### Textbook Chapter
- **chapter_id**: string (unique identifier, e.g., "ch1-intro-physical-ai")
- **title**: string (chapter title)
- **content**: string (markdown content of the chapter)
- **chapter_number**: integer (sequential number 1-6)
- **learning_objectives**: array of strings (key concepts students should understand)
- **prerequisites**: array of strings (required knowledge from previous chapters)
- **word_count**: integer (for reading time estimates)
- **created_at**: timestamp
- **updated_at**: timestamp

### Textbook Content Chunk
- **chunk_id**: string (unique identifier for vector storage)
- **chapter_id**: string (foreign key to Textbook Chapter)
- **content**: string (text chunk for embedding)
- **chunk_number**: integer (position within chapter)
- **embedding_vector**: vector (Qdrant vector ID)
- **token_count**: integer (for context management)
- **created_at**: timestamp

### RAG Query
- **query_id**: string (unique identifier)
- **user_id**: string (anonymous user session ID)
- **query_text**: string (original user question)
- **query_timestamp**: timestamp
- **relevant_chunks**: array of chunk_ids (retrieved from vector search)
- **response_text**: string (AI-generated response)
- **response_citations**: array of chapter references (citations to textbook content)
- **response_timestamp**: timestamp
- **accuracy_confirmed**: boolean (whether response was manually verified)
- **user_feedback**: string (optional user feedback on response quality)

### User Session
- **session_id**: string (unique identifier for anonymous session)
- **start_time**: timestamp
- **end_time**: timestamp (null if active)
- **pages_viewed**: array of chapter_ids
- **queries_made**: array of query_ids
- **current_position**: object (current chapter and scroll position)
- **personalization_settings**: object (difficulty level, preferred content type)

### Quiz Question
- **question_id**: string (unique identifier)
- **chapter_id**: string (foreign key to Textbook Chapter)
- **question_text**: string (the quiz question)
- **question_type**: enum ("multiple-choice", "short-answer", "true-false")
- **options**: array of strings (for multiple choice)
- **correct_answer**: string (the correct answer)
- **explanation**: string (explanation of the correct answer)
- **difficulty_level**: enum ("basic", "intermediate", "advanced")
- **created_at**: timestamp

### Quiz Submission
- **submission_id**: string (unique identifier)
- **session_id**: string (foreign key to User Session)
- **question_id**: string (foreign key to Quiz Question)
- **user_answer**: string (user's answer)
- **is_correct**: boolean (whether the answer was correct)
- **submitted_at**: timestamp
- **time_taken_ms**: integer (time taken to answer)

### Textbook Content Reference
- **reference_id**: string (unique identifier)
- **chapter_id**: string (foreign key to Textbook Chapter)
- **section_title**: string (title of the referenced section)
- **start_line**: integer (starting line number in chapter content)
- **end_line**: integer (ending line number in chapter content)
- **content_preview**: string (brief preview of the referenced content)

## Relationships

- Textbook Chapter 1-to-many Textbook Content Chunk (chapters are divided into chunks for vector storage)
- User Session 1-to-many RAG Query (users can make multiple queries in a session)
- RAG Query many-to-many Textbook Content Chunk (queries reference multiple content chunks)
- Textbook Chapter 1-to-many Quiz Question (each chapter has multiple quiz questions)
- User Session 1-to-many Quiz Submission (users can submit multiple quiz answers)
- RAG Query 1-to-many Textbook Content Reference (responses can reference multiple content sections)

## Validation Rules

### Textbook Chapter
- chapter_number must be between 1 and 6
- title must not be empty
- content must be valid markdown
- chapter_id must be unique

### Textbook Content Chunk
- chapter_id must reference an existing chapter
- content must not exceed 1000 tokens
- chunk_number must be positive

### RAG Query
- query_text must not be empty
- response_text must include at least one citation when content exists
- query_timestamp must be before response_timestamp

### User Session
- session_id must be unique
- start_time must be before end_time (if end_time is set)

### Quiz Question
- chapter_id must reference an existing chapter
- question_text must not be empty
- for multiple-choice, options array must have at least 2 items
- correct_answer must be one of the options (for multiple-choice)

## State Transitions

### User Session
- **Active** (default) → **Completed**: When user finishes all chapters or explicitly ends session
- **Active** → **Inactive**: When session expires (after 24 hours of inactivity)