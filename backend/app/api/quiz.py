from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.db.session import get_db
from app.db.models import mastery_doc, quiz_attempt_doc
from app.db.auth import get_current_student
from app.ai.quiz_chain import generate_quiz
from app.ai.bkt import update_mastery, is_mastered

router = APIRouter(prefix="/quiz", tags=["quiz"])


class SubmitAnswerRequest(BaseModel):
    topic: str
    subject: str
    question: str
    student_answer: str
    correct_answer: str
    difficulty: str


@router.get("/generate")
def get_quiz(
    topic: str,
    subject: str = "general",
    count: int = 5,
    student: dict = Depends(get_current_student),
):
    db = get_db()
    record = db.mastery_records.find_one({"student_id": student["_id"], "topic": topic})
    mastery_score = record["mastery_score"] if record else 0.3
    questions = generate_quiz(topic=topic, grade=student["grade"], mastery_score=mastery_score, count=count)
    return {"topic": topic, "mastery_score": round(mastery_score, 3), "questions": questions}


@router.post("/submit")
def submit_answer(req: SubmitAnswerRequest, student: dict = Depends(get_current_student)):
    db = get_db()
    is_correct = req.student_answer.strip().upper() == req.correct_answer.strip().upper()

    record = db.mastery_records.find_one({"student_id": student["_id"], "topic": req.topic})
    current_score = record["mastery_score"] if record else 0.3
    new_score = update_mastery(current_score, is_correct)

    db.mastery_records.update_one(
        {"student_id": student["_id"], "topic": req.topic},
        {"$set": {**mastery_doc(student["_id"], req.topic, req.subject, new_score)}},
        upsert=True,
    )
    db.quiz_attempts.insert_one(
        quiz_attempt_doc(student["_id"], req.topic, req.subject, req.question,
                         req.student_answer, req.correct_answer, is_correct, req.difficulty)
    )

    return {
        "is_correct": is_correct,
        "new_mastery_score": round(new_score, 3),
        "mastered": is_mastered(new_score),
        "feedback": "Great job! Keep it up!" if is_correct else "Not quite — review this topic and try again!",
    }
