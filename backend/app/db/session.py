from pymongo import MongoClient, ASCENDING
from pymongo.database import Database
from app.config import settings

_client: MongoClient = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        # serverSelectionTimeoutMS prevents hanging forever when Mongo is down
        _client = MongoClient(
            settings.mongodb_url,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=3000,
        )
    return _client


def get_db() -> Database:
    return get_client()[settings.mongodb_db]


def create_indexes():
    db = get_db()
    db.students.create_index([("username", ASCENDING)], unique=True)
    db.teachers.create_index([("username", ASCENDING)], unique=True)
    db.mastery_records.create_index([("student_id", ASCENDING), ("topic", ASCENDING)], unique=True)
    db.quiz_attempts.create_index([("student_id", ASCENDING), ("attempted_at", ASCENDING)])
