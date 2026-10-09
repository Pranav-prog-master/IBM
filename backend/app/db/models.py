from datetime import datetime, timezone
from bson import ObjectId


def student_doc(username: str, hashed_password: str, grade: str, language: str = "en") -> dict:
    return {
        "username": username,
        "hashed_password": hashed_password,
        "grade": grade,
        "language": language,
        "created_at": datetime.now(timezone.utc),
    }


def mastery_doc(student_id: str, topic: str, subject: str, mastery_score: float = 0.3) -> dict:
    return {
        "student_id": student_id,
        "topic": topic,
        "subject": subject,
        "mastery_score": mastery_score,
        "updated_at": datetime.now(timezone.utc),
    }


def quiz_attempt_doc(student_id: str, topic: str, subject: str, question: str,
                     student_answer: str, correct_answer: str, is_correct: bool, difficulty: str) -> dict:
    return {
        "student_id": student_id,
        "topic": topic,
        "subject": subject,
        "question": question,
        "student_answer": student_answer,
        "correct_answer": correct_answer,
        "is_correct": is_correct,
        "difficulty": difficulty,
        "attempted_at": datetime.now(timezone.utc),
    }


def teacher_doc(username: str, hashed_password: str) -> dict:
    return {
        "username": username,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc),
    }
