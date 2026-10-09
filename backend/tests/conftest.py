import os
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Set env vars before importing app
os.environ.setdefault("MONGODB_URL", "mongodb://localhost:27017")
os.environ.setdefault("MONGODB_DB", "tutordb_test")
os.environ.setdefault("GOOGLE_API_KEY", "AIzaSy_test_dummy_key_for_ci_only")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-ci-minimum-32-chars")


@pytest.fixture(scope="session")
def client():
    with patch("app.db.session.create_indexes"):
        from app.main import app
        with TestClient(app) as c:
            yield c


@pytest.fixture
def mock_db():
    with patch("app.db.session.get_db") as mock:
        db = MagicMock()
        mock.return_value = db
        yield db
