import uuid
from typing import List, Dict, Any
from datetime import datetime
from ..models.quiz import QuizQuestion, QuizSubmission, QuizResult, Answer, QuestionResult

class QuizService:
    """
    Service for managing quiz questions and submissions
    """
    def __init__(self):
        # In a real implementation, this would connect to a database
        # For now, we'll define sample questions for each chapter
        self.questions = self._load_sample_questions()

    def _load_sample_questions(self) -> Dict[str, List[QuizQuestion]]:
        """
        Load sample quiz questions for each chapter
        """
        return {
            "ch1-introduction-to-physical-ai": [
                QuizQuestion(
                    question_id="q1-ch1",
                    question_text="What does Physical AI represent?",
                    question_type="multiple-choice",
                    options=[
                        "AI that operates only in digital spaces",
                        "AI that operates in the physical world with perception, reasoning, and action",
                        "AI used only in manufacturing",
                        "AI that simulates human emotions"
                    ],
                    explanation="Physical AI represents the intersection of artificial intelligence and physical systems, encompassing systems that can perceive, reason, and act in the physical world."
                ),
                QuizQuestion(
                    question_id="q2-ch1",
                    question_text="What are the three main components of Physical AI systems?",
                    question_type="short-answer",
                    explanation="The three main components are perception and sensing, reasoning and planning, and control and actuation."
                )
            ],
            "ch2-basics-of-humanoid-robotics": [
                QuizQuestion(
                    question_id="q1-ch2",
                    question_text="What is the primary purpose of humanoid robots?",
                    question_type="multiple-choice",
                    options=[
                        "To replace humans in all tasks",
                        "To work alongside humans in shared environments",
                        "To look exactly like humans",
                        "To be more expensive than regular robots"
                    ],
                    explanation="The primary purpose of humanoid robots is to work alongside humans in shared environments, perform tasks that are dangerous or repetitive for humans, and assist in research and development of human-robot interaction."
                )
            ],
            "ch3-ros-2-fundamentals": [
                QuizQuestion(
                    question_id="q1-ch3",
                    question_text="What does DDS stand for in ROS 2?",
                    question_type="short-answer",
                    explanation="DDS stands for Data Distribution Service, which is the underlying communication middleware that ROS 2 uses."
                )
            ],
            "ch4-digital-twin-simulation": [
                QuizQuestion(
                    question_id="q1-ch4",
                    question_text="What are the key components of a digital twin?",
                    question_type="short-answer",
                    explanation="The key components of a digital twin include physical model, behavioral model, environmental model, sensor model, and control model."
                )
            ],
            "ch5-vision-language-action-systems": [
                QuizQuestion(
                    question_id="q1-ch5",
                    question_text="What does VLA stand for in robotics?",
                    question_type="short-answer",
                    explanation="VLA stands for Vision-Language-Action systems, which combine visual perception, natural language understanding, and physical action in a unified framework."
                )
            ],
            "ch6-capstone-simple-ai-robot-pipeline": [
                QuizQuestion(
                    question_id="q1-ch6",
                    question_text="What are the main components of the AI-robot pipeline?",
                    question_type="short-answer",
                    explanation="The main components include user interface, AI processing, ROS 2 bridge, robot control, and simulation layers."
                )
            ]
        }

    def get_questions_by_chapter(self, chapter_id: str) -> List[QuizQuestion]:
        """
        Get quiz questions for a specific chapter
        """
        return self.questions.get(chapter_id, [])

    def submit_answers(self, submission: QuizSubmission) -> QuizResult:
        """
        Process quiz submission and return results
        """
        # In a real implementation, this would connect to a database to get correct answers
        # For now, we'll use a simple matching approach

        # Define correct answers for our sample questions
        correct_answers = {
            "q1-ch1": "AI that operates in the physical world with perception, reasoning, and action",
            "q2-ch1": "perception and sensing, reasoning and planning, and control and actuation",
            "q1-ch2": "To work alongside humans in shared environments",
            "q1-ch3": "Data Distribution Service",
            "q1-ch4": "physical model, behavioral model, environmental model, sensor model, and control model",
            "q1-ch5": "Vision-Language-Action systems",
            "q1-ch6": "user interface, AI processing, ROS 2 bridge, robot control, and simulation layers"
        }

        results = []
        correct_count = 0

        for answer in submission.answers:
            question_id = answer.question_id
            user_answer = answer.answer_text.lower().strip()
            correct_answer = correct_answers.get(question_id, "").lower().strip()

            is_correct = False
            if correct_answer:
                # Simple string matching (in a real implementation, use more sophisticated NLP)
                if user_answer == correct_answer or correct_answer in user_answer or user_answer in correct_answer:
                    is_correct = True

            if is_correct:
                correct_count += 1

            result = QuestionResult(
                question_id=question_id,
                is_correct=is_correct,
                correct_answer=correct_answers.get(question_id, "Not available"),
                user_answer=user_answer
            )
            results.append(result)

        # Calculate score as percentage
        total_questions = len(submission.answers)
        score = (correct_count / total_questions * 100) if total_questions > 0 else 0

        # Create and return the result
        result = QuizResult(
            submission_id=str(uuid.uuid4()),
            score=score,
            results=results
        )

        return result