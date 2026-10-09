from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.db.auth import get_current_student
from app.services.bhashini import translate_text

router = APIRouter(prefix="/translate", tags=["translation"])


class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "hi"


@router.post("")
async def translate(
    req: TranslateRequest,
    student: dict = Depends(get_current_student),
):
    translated = await translate_text(req.text, req.source_lang, req.target_lang)
    return {"original": req.text, "translated": translated, "target_lang": req.target_lang}
