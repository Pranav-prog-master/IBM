from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "tutordb"
    redis_url: str = "redis://localhost:6379/0"

    # AI
    google_api_key: str = ""
    chroma_db_path: str = "./data/chroma_db"
    embedding_model: str = "gemini-embedding-001"
    langchain_embedding_model: str = "models/text-embedding-004"
    llm_model: str = "gemini-2.0-flash"

    # Auth
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 8

    # Translation
    translation_provider: str = "google"

    class Config:
        env_file = ".env"


settings = Settings()
