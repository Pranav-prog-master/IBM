from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from app.db.session import get_db
from app.db.auth import get_current_student
from app.ai.rag_chain import ask_gemini
from app.ai.guardrails import scrub_pii
from app.services.whisper_stt import transcribe_audio
from app.services.tts import text_to_speech
import base64

router = APIRouter(prefix="/tutor", tags=["tutor"])


def _get_mastery_level(mastery_score: float) -> str:
    if mastery_score < 0.4:   return "low"
    if mastery_score < 0.75:  return "medium"
    return "high"


@router.post("/ask")
async def ask_tutor(
    question: str = Form(None),
    topic: str = Form("general"),
    subject: str = Form("general"),
    audio: UploadFile = File(None),
    include_audio_response: bool = Form(False),
    student: dict = Depends(get_current_student),
):
    if audio:
        audio_bytes = await audio.read()
        question = transcribe_audio(audio_bytes, language=student["language"])

    if not question:
        return JSONResponse(status_code=400, content={"detail": "No question provided"})

    clean_question = scrub_pii(question)

    db = get_db()
    record = db.mastery_records.find_one({"student_id": student["_id"], "topic": topic})
    mastery_score = record["mastery_score"] if record else 0.3
    mastery_level = _get_mastery_level(mastery_score)

    try:
        answer_text = ask_gemini(clean_question, topic, mastery_level)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=503, detail="AI service unavailable. Please try again shortly.")

    response = {"question": question, "answer": answer_text, "mastery_level": mastery_level}

    if include_audio_response:
        audio_bytes = text_to_speech(answer_text, language=student["language"])
        response["audio_base64"] = base64.b64encode(audio_bytes).decode()

    return response
