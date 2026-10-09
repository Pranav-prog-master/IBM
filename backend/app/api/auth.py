from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from app.db.auth import create_access_token, hash_password, verify_password
from app.db.models import student_doc
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    password: str
    grade: str
    language: str = "en"


@router.post("/register", status_code=201)
def register(req: RegisterRequest):
    db = get_db()
    if db.students.find_one({"username": req.username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    db.students.insert_one(student_doc(req.username, hash_password(req.password), req.grade, req.language))
    return {"message": "Registered successfully"}


@router.post("/token")
def login(form: OAuth2PasswordRequestForm = Depends()):
    db = get_db()
    student = db.students.find_one({"username": form.username})
    if not student or not verify_password(form.password, student["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": student["username"], "grade": student["grade"]})
    return {"access_token": token, "token_type": "bearer"}
