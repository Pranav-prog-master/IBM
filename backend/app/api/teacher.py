from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.db.session import get_db
from app.db.models import teacher_doc
from app.db.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/teacher", tags=["teacher"])


@router.post("/register", status_code=201)
def register_teacher(username: str, password: str):
    db = get_db()
    if db.teachers.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username taken")
    db.teachers.insert_one(teacher_doc(username, hash_password(password)))
    return {"message": "Teacher registered"}


@router.post("/token")
def teacher_login(form: OAuth2PasswordRequestForm = Depends()):
    db = get_db()
    teacher = db.teachers.find_one({"username": form.username})
    if not teacher or not verify_password(form.password, teacher["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token({"sub": teacher["username"], "role": "teacher"}), "token_type": "bearer"}


@router.get("/dashboard/weak-topics")
def weak_topics(grade: str = None):
    db = get_db()
    pipeline = []

    if grade:
        student_ids = [str(s["_id"]) for s in db.students.find({"grade": grade}, {"_id": 1})]
        pipeline.append({"$match": {"student_id": {"$in": student_ids}}})

    pipeline += [
        {"$group": {
            "_id": {"topic": "$topic", "subject": "$subject"},
            "avg_mastery": {"$avg": "$mastery_score"},
            "student_count": {"$sum": 1},
        }},
        {"$match": {"avg_mastery": {"$lt": 0.5}}},
        {"$sort": {"avg_mastery": 1}},
    ]

    results = list(db.mastery_records.aggregate(pipeline))
    return [
        {
            "topic": r["_id"]["topic"],
            "subject": r["_id"]["subject"],
            "avg_mastery": round(r["avg_mastery"], 3),
            "students": r["student_count"],
        }
        for r in results
    ]


@router.get("/dashboard/student/{student_id}")
def student_report(student_id: str):
    db = get_db()
    records = list(db.mastery_records.find({"student_id": student_id}))
    recent = list(db.quiz_attempts.find({"student_id": student_id}).sort("attempted_at", -1).limit(20))
    return {
        "mastery": [{"topic": r["topic"], "subject": r["subject"], "score": round(r["mastery_score"], 3)} for r in records],
        "recent_attempts": [{"topic": a["topic"], "correct": a["is_correct"], "at": a["attempted_at"].isoformat()} for a in recent],
    }
