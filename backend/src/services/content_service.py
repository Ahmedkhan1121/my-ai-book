import os
import json
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..models.chapter import TextbookChapter, Chapter

class ContentService:
    """
    Service for managing textbook content
    """
    def __init__(self):
        # In a real implementation, this would connect to a database
        # For now, we'll simulate content loading from files
        self.chapters = self._load_chapters()

    def _load_chapters(self) -> Dict[str, TextbookChapter]:
        """
        Load chapters from markdown files in the frontend docs directory
        """
        chapters = {}

        # Define the chapters that were created in the frontend
        chapter_files = [
            ("ch1-introduction-to-physical-ai.md", 1, "Introduction to Physical AI"),
            ("ch2-basics-of-humanoid-robotics.md", 2, "Basics of Humanoid Robotics"),
            ("ch3-ros-2-fundamentals.md", 3, "ROS 2 Fundamentals"),
            ("ch4-digital-twin-simulation.md", 4, "Digital Twin Simulation (Gazebo + Isaac)"),
            ("ch5-vision-language-action-systems.md", 5, "Vision-Language-Action Systems"),
            ("ch6-capstone-simple-ai-robot-pipeline.md", 6, "Capstone: Simple AI-Robot Pipeline")
        ]

        for filename, chapter_num, title in chapter_files:
            try:
                # Read the markdown file content
                file_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "docs", filename)
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()

                    # Extract frontmatter and content
                    lines = content.split('\n')
                    frontmatter_start = -1
                    frontmatter_end = -1

                    for i, line in enumerate(lines):
                        if line.strip() == '---':
                            if frontmatter_start == -1:
                                frontmatter_start = i
                            else:
                                frontmatter_end = i
                                break

                    if frontmatter_start != -1 and frontmatter_end != -1:
                        frontmatter_content = '\n'.join(lines[frontmatter_start+1:frontmatter_end])
                        main_content = '\n'.join(lines[frontmatter_end+1:])

                        # Parse frontmatter (simplified - in a real app, use a proper YAML parser)
                        chapter_id = f"ch{chapter_num}-" + title.lower().replace(' ', '-').replace('--', '-').replace(':', '')

                        # Create a TextbookChapter object
                        chapter = TextbookChapter(
                            chapter_id=chapter_id,
                            title=title,
                            content=main_content,
                            chapter_number=chapter_num,
                            learning_objectives=["Placeholder objectives - would be parsed from frontmatter"],
                            word_count=len(main_content.split()),
                            created_at=datetime.now(),
                            updated_at=datetime.now()
                        )

                        chapters[chapter_id] = chapter
            except FileNotFoundError:
                print(f"Chapter file not found: {filename}")
                continue
            except Exception as e:
                print(f"Error loading chapter {filename}: {str(e)}")
                continue

        return chapters

    def get_all_chapters(self) -> List[Chapter]:
        """
        Get all textbook chapters
        """
        return [
            Chapter(
                chapter_id=chapter.chapter_id,
                title=chapter.title,
                chapter_number=chapter.chapter_number,
                content=chapter.content[:500] + "..." if len(chapter.content) > 500 else chapter.content,  # Truncate for API
                learning_objectives=chapter.learning_objectives,
                word_count=chapter.word_count
            )
            for chapter in self.chapters.values()
        ]

    def get_chapter_by_id(self, chapter_id: str) -> Optional[Chapter]:
        """
        Get a specific chapter by ID
        """
        chapter = self.chapters.get(chapter_id)
        if chapter:
            return Chapter(
                chapter_id=chapter.chapter_id,
                title=chapter.title,
                chapter_number=chapter.chapter_number,
                content=chapter.content,
                learning_objectives=chapter.learning_objectives,
                word_count=chapter.word_count
            )
        return None

    def get_chapter_content(self, chapter_id: str) -> Optional[str]:
        """
        Get the content of a specific chapter
        """
        chapter = self.chapters.get(chapter_id)
        return chapter.content if chapter else None