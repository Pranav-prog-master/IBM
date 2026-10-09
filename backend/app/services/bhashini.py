from deep_translator import GoogleTranslator, MyMemoryTranslator
from app.config import settings

# Supported language codes
LANG_CODES = {
    "hindi": "hi", "gujarati": "gu", "marathi": "mr",
    "tamil": "ta", "telugu": "te", "kannada": "kn",
    "bengali": "bn", "punjabi": "pa", "malayalam": "ml",
    "en": "en",
}


async def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate text using deep-translator. No API key required."""
    if source_lang == target_lang:
        return text
    try:
        if settings.translation_provider == "mymemory":
            # MyMemory: 5000 chars/day free, no account needed
            return MyMemoryTranslator(source=source_lang, target=target_lang).translate(text)
        # Default: Google Translate via deep-translator (no key needed)
        return GoogleTranslator(source=source_lang, target=target_lang).translate(text)
    except Exception:
        return text  # graceful fallback: return original text
