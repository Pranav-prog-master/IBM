from unittest.mock import patch

from app.ai.rag_chain import _is_valid_key, ask_gemini


def test_invalid_key_placeholder():
    assert _is_valid_key("PASTE_YOUR_KEY_HERE") is False


def test_invalid_key_empty():
    assert _is_valid_key("") is False


def test_invalid_key_short():
    assert _is_valid_key("AIzaShort") is False


def test_invalid_key_with_dot():
    assert _is_valid_key("AIzaSyAQ.Ab8RN6LDhuTSW6AoR") is False


def test_ask_gemini_returns_message_for_invalid_key():
    with patch("app.ai.rag_chain.settings") as mock_settings:
        mock_settings.google_api_key = "PASTE_YOUR_KEY_HERE"
        result = ask_gemini("What is photosynthesis?", "Science", "low")
    assert "GOOGLE_API_KEY" in result or "not configured" in result
