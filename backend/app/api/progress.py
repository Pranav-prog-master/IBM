from fastapi import APIRouter, Depends

from app.db.auth import get_current_student
from app.db.session import get_db

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/mastery")
def get_mastery(student: dict = Depends(get_current_student)):
    db = get_db()
    records = list(db.mastery_records.find({"student_id": student["_id"]}))
    return {
        "student_id": student["_id"],
        "grade": student["grade"],
        "mastery": [
            {
                "topic": r["topic"],
                "subject": r["subject"],
                "mastery_score": round(r["mastery_score"], 3),
                "mastered": r["mastery_score"] >= 0.75,
            }
            for r in records
        ],
    }


@router.get("/history")
def get_history(topic: str | None = None, limit: int = 50, student: dict = Depends(get_current_student)):
    db = get_db()
    query = {"student_id": student["_id"]}
    if topic:
        query["topic"] = topic
    attempts = list(db.quiz_attempts.find(query).sort("attempted_at", -1).limit(limit))
    return [
        {
            "topic": a["topic"],
            "subject": a["subject"],
            "is_correct": a["is_correct"],
            "difficulty": a["difficulty"],
            "attempted_at": a["attempted_at"].isoformat(),
        }
        for a in attempts
    ]
