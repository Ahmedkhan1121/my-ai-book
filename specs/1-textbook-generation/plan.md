# Implementation Plan: AI-Native Textbook with RAG Chatbot

**Branch**: `1-textbook-generation` | **Date**: 2025-12-15 | **Spec**: [link to spec.md](../spec.md)
**Input**: Feature specification from `/specs/1-textbook-generation/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a Docusaurus-based interactive textbook with 6 chapters covering Physical AI and Humanoid Robotics topics, integrated with a RAG (Retrieval Augmented Generation) chatbot that uses Qdrant and Neon for vector storage and retrieval. The system will provide textbook content with navigation, AI-powered Q&A functionality that cites specific textbook content, end-of-chapter quizzes, and basic personalization features while operating within free-tier resource limits.

## Technical Context

**Language/Version**: JavaScript/TypeScript, Python 3.11+ for backend services
**Primary Dependencies**: Docusaurus, FastAPI, Qdrant, Neon, OpenAI API or compatible LLM
**Storage**: Neon (PostgreSQL), Qdrant (vector database), Git-based content storage
**Testing**: pytest for backend, Jest for frontend components
**Target Platform**: Web application (client-server architecture)
**Project Type**: Web application with frontend (Docusaurus) and backend (FastAPI)
**Performance Goals**: <3s page load, <5s AI response time, 95% accuracy on textbook-based queries
**Constraints**: Free-tier resource limits, no heavy GPU usage, must cite textbook content with references
**Scale/Scope**: Single textbook application, multiple concurrent users, 6 chapters of content

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the project constitution, this implementation plan adheres to:
- Simplicity: Using established frameworks (Docusaurus, FastAPI) rather than custom solutions
- Accuracy: RAG system will be constrained to textbook content only with citations
- Accessibility: Free-tier architecture using Neon and Qdrant
- Modularity: Separate frontend (Docusaurus) and backend (FastAPI) components
- Educational Focus: All features directly support learning objectives
- RAG Integrity: System will only respond with information from textbook content

## Project Structure

### Documentation (this feature)

```text
specs/1-textbook-generation/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   ├── api/
│   └── main.py
└── tests/

frontend/
├── docs/                 # Textbook content in markdown
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── docusaurus.config.js
├── sidebars.js
└── package.json

api/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/
```

**Structure Decision**: Web application with separate frontend (Docusaurus) and backend (FastAPI) components to maintain modularity and enable independent development/deployment. The frontend handles textbook presentation and user interface, while the backend manages the RAG system and API services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |