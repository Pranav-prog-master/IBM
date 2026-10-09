from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from pydantic import BaseModel
from app.db.session import get_db
from app.db.models import student_doc
from app.db.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    password: str
    grade: str
    language: str = "en"


@router.post("/register", status_code=201)
def register(req: RegisterRequest):
    db = get_db()
    existing = db.students.find_one({"username": req.username})
    if existing:
        # Username taken — verify password and return token so UI can proceed
        if not verify_password(req.password, existing["hashed_password"]):
            raise HTTPException(status_code=400, detail="Username already taken")
        token = create_access_token({"sub": existing["username"], "grade": existing["grade"]})
        return {"message": "Already registered, signed in", "access_token": token, "token_type": "bearer"}
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
