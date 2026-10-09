import tempfile, os
from faster_whisper import WhisperModel

_model = None


def _get_model():
    global _model
    if _model is None:
        _model = WhisperModel("small", device="cpu", compute_type="int8")
    return _model


def transcribe_audio(audio_bytes: bytes, language: str = "en") -> str:
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    try:
        segments, _ = _get_model().transcribe(tmp_path, language=language)
        return " ".join(s.text for s in segments).strip()
    finally:
        os.unlink(tmp_path)
