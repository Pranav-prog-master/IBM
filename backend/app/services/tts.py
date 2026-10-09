import io
from gtts import gTTS

# gTTS language codes that overlap with Bhashini codes
GTTS_LANG_MAP = {
    "hi": "hi", "gu": "gu", "mr": "mr", "ta": "ta",
    "te": "te", "kn": "kn", "bn": "bn", "pa": "pa",
    "ml": "ml", "en": "en",
}


def text_to_speech(text: str, language: str = "en") -> bytes:
    """Convert text to MP3 audio bytes using gTTS."""
    lang_code = GTTS_LANG_MAP.get(language, "en")
    tts = gTTS(text=text, lang=lang_code, slow=False)
    buf = io.BytesIO()
    tts.write_to_fp(buf)
    return buf.getvalue()
