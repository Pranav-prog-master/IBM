from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

_analyzer = AnalyzerEngine()
_anonymizer = AnonymizerEngine()


def scrub_pii(text: str, language: str = "en") -> str:
    """Remove PII (names, phone numbers, emails) before sending to LLM."""
    # Presidio only supports 'en' natively; for other languages fall back to en
    lang = language if language == "en" else "en"
    results = _analyzer.analyze(text=text, language=lang)
    if not results:
        return text
    return _anonymizer.anonymize(text=text, analyzer_results=results).text
