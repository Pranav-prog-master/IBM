from deep_translator import GoogleTranslator, MyMemoryTranslator

from app.config import settings

LANG_CODES = {
    "hindi": "hi", "gujarati": "gu", "marathi": "mr",
    "tamil": "ta", "telugu": "te", "kannada": "kn",
    "bengali": "bn", "punjabi": "pa", "malayalam": "ml",
    "en": "en",
}


async def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    if source_lang == target_lang:
        return text
    try:
        if settings.translation_provider == "mymemory":
            return MyMemoryTranslator(source=source_lang, target=target_lang).translate(text)
        return GoogleTranslator(source=source_lang, target=target_lang).translate(text)
    except Exception:  # noqa: BLE001
        return text
