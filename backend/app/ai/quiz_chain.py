import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from app.config import settings
from app.ai.bkt import get_difficulty

QUIZ_PROMPT = PromptTemplate.from_template(
    """Generate exactly {count} multiple-choice questions about "{topic}" for a grade {grade} student.
Difficulty level: {difficulty}.

Return ONLY a JSON array. Each element must have:
  "question"       : string
  "options"        : array of 4 strings (A, B, C, D)
  "correct_answer" : one of "A", "B", "C", "D"
  "explanation"    : one sentence explaining the correct answer

No extra text outside the JSON array."""
)


def generate_quiz(topic: str, grade: str, mastery_score: float, count: int = 5) -> list[dict]:
    _key = settings.google_api_key
    if not _key or _key in ("PASTE_YOUR_KEY_HERE", "PASTE_YOUR_AIzaSy_KEY_HERE") or "REPLACE" in _key:
        raise ValueError(
            "Invalid GOOGLE_API_KEY. Get a free key at https://aistudio.google.com/app/apikey "
            "and set it in backend/.env"
        )
    difficulty = get_difficulty(mastery_score)
    llm = ChatGoogleGenerativeAI(
        model=settings.llm_model,
        google_api_key=settings.google_api_key,
        temperature=0.7,
    )
    prompt = QUIZ_PROMPT.format(topic=topic, grade=grade, difficulty=difficulty, count=count)
    response = llm.invoke(prompt)

    raw = response.content.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
    questions = json.loads(raw)
    for q in questions:
        q["difficulty"] = difficulty
    return questions
