# Physical AI & Humanoid Robotics — Essentials Constitution

## Core Principles

### I. Simplicity
Content and implementation must be minimal and focused. Every addition must serve a clear pedagogical purpose. Avoid complexity for its own sake and prioritize clarity over completeness.

### II. Accuracy
All technical content must be factually correct and up-to-date with current industry standards. Technical implementations (Docusaurus, RAG, ROS 2, etc.) must follow best practices and proven methodologies.

### III. Accessibility
The textbook and associated tools must be free-tier friendly and lightweight. No heavy GPU usage or resource-intensive operations that would prevent widespread access to the learning materials.

### IV. Modularity
Each chapter and component must be self-contained and independently learnable/testable. Components (UI, RAG, simulation) must be loosely coupled to enable easy maintenance and updates.

### V. Educational Focus
Every feature must directly contribute to the learning objectives. Tools and technologies should enhance understanding of Physical AI and Humanoid Robotics concepts, not distract from them.

### VI. RAG Integrity
The chatbot must only respond with information derived from the textbook content. No hallucinations or external knowledge injection - the RAG system must be strictly bound to the book's text.

## Additional Constraints

- 6 short chapters covering: Introduction to Physical AI, Basics of Humanoid Robotics, ROS 2 Fundamentals, Digital Twin Simulation (Gazebo + Isaac), Vision-Language-Action Systems, Capstone: Simple AI-Robot Pipeline
- Clean, modern Docusaurus UI optimized for learning
- Free-tier friendly architecture (Qdrant + Neon + FastAPI for RAG)
- Lightweight embeddings with minimal computational overhead
- Optional localization support (Urdu) and personalization features

## Development Workflow

- All content changes must be validated against learning objectives
- Technical implementations must pass performance benchmarks for free-tier usage
- Chapter content must be reviewed by subject matter experts
- RAG accuracy must be verified against source material
- Build processes must complete successfully before merging
- UI changes must maintain responsive design principles

## Governance

This constitution serves as the guiding document for all development decisions. All contributors must ensure their work aligns with these principles. Any proposed changes that conflict with these principles must include compelling justification. Amendments require documentation of impact on learning objectives and technical feasibility.

**Version**: 1.0.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15
