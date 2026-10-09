"""
RAG chain using google-genai SDK for LLM, langchain-google-genai for embeddings.
Falls back to a direct LLM answer when ChromaDB has no documents or embeddings fail.
"""
import logging

from google import genai
from google.genai import types

from app.config import settings

logger = logging.getLogger("uvicorn.error")

TUTOR_SYSTEM = """You are a friendly, patient tutor for school students in grades 6–10.
Rules:
- Answer ONLY using the curriculum context provided.
- If the answer is not in the context, say: "That's a great question! Let's explore it in our next lesson."
- Never discuss violence, adult content, politics, or anything outside the school curriculum.
- Keep answers encouraging, simple, and under 150 words.
- Adjust explanation depth based on the student's mastery level."""

TUTOR_PROMPT_TMPL = """\
Curriculum context:
{context}

Student mastery level on this topic: {mastery_level} (low/medium/high)

Student question: {question}

Answer:"""

_INVALID_KEY_FRAGMENTS = ("REPLACE", "your_real_key", "PASTE", "example", "placeholder")


def _is_valid_key(key: str) -> bool:
    if not key or len(key) < 35:
        return False
    if "." in key or "-" in key[6:]:
        return False
    key_lower = key.lower()
    return not any(f.lower() in key_lower for f in _INVALID_KEY_FRAGMENTS)


def _get_client() -> genai.Client:
    return genai.Client(api_key=settings.google_api_key)


def _get_chroma():
    """Lazy-load ChromaDB with langchain-google-genai embeddings. Returns None on any failure."""
    try:
        from langchain_community.vectorstores import Chroma  # noqa: PLC0415
        from langchain_google_genai import GoogleGenerativeAIEmbeddings  # noqa: PLC0415

        embeddings = GoogleGenerativeAIEmbeddings(
            model=settings.langchain_embedding_model,
            google_api_key=settings.google_api_key,
        )
        vectorstore = Chroma(
            persist_directory=settings.chroma_db_path,
            embedding_function=embeddings,
        )
        if vectorstore._collection.count() == 0:
            return None
        return vectorstore
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"ChromaDB not available: {exc}")
        return None


def ask_gemini(question: str, topic: str, mastery_level: str) -> str:
    if not _is_valid_key(settings.google_api_key):
        return (
            "The AI tutor is not configured yet. "
            "Please set a valid GOOGLE_API_KEY in backend/.env — "
            "get a free key at https://aistudio.google.com/app/apikey"
        )

    client = _get_client()

    context = ""
    try:
        vectorstore = _get_chroma()
        if vectorstore:
            docs = vectorstore.similarity_search(question, k=4)
            context = "\n\n".join(d.page_content for d in docs)
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"RAG retrieval failed, using fallback: {exc}")

    if not context:
        context = f"Topic: {topic}. Answer from general curriculum knowledge."

    prompt = TUTOR_PROMPT_TMPL.format(
        context=context,
        mastery_level=mastery_level,
        question=question,
    )

    try:
        response = client.models.generate_content(
            model=settings.llm_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=TUTOR_SYSTEM,
                temperature=0.3,
                max_output_tokens=300,
            ),
        )
        return response.text
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Gemini API error: {exc}")
        msg = str(exc)
        if "API_KEY_INVALID" in msg or "API key not valid" in msg:
            return (
                "Invalid API key. Please update GOOGLE_API_KEY in backend/.env "
                "with a valid key from https://aistudio.google.com/app/apikey"
            )
        if "404" in msg or "not found" in msg.lower():
            return (
                f"Model '{settings.llm_model}' not found. "
                "Update LLM_MODEL in backend/.env — try 'gemini-1.5-flash' or 'gemini-2.0-flash'."
            )
        return f"AI service error: {msg}"
