"""
LangChain-compatible embeddings using the new google-genai SDK.
Used by ChromaDB for document storage and retrieval.
"""
from google import genai
from google.genai import types
from langchain_core.embeddings import Embeddings

from app.config import settings


class GeminiEmbeddings(Embeddings):
    """Wraps google-genai embed_content for use with LangChain / ChromaDB."""

    def __init__(self):
        self._client = genai.Client(api_key=settings.google_api_key)

    def _embed(self, texts: list[str]) -> list[list[float]]:
        result = self._client.models.embed_content(
            model=settings.embedding_model,
            contents=texts,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
        )
        return [e.values for e in result.embeddings]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self._embed(texts)

    def embed_query(self, text: str) -> list[float]:
        result = self._client.models.embed_content(
            model=settings.embedding_model,
            contents=[text],
            config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY"),
        )
        return result.embeddings[0].values
