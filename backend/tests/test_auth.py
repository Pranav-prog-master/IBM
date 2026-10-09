from unittest.mock import MagicMock, patch


def test_register_success(client):
    mock_db = MagicMock()
    mock_db.students.find_one.return_value = None
    mock_db.students.insert_one.return_value = MagicMock()

    with patch("app.api.auth.get_db", return_value=mock_db):
        r = client.post("/auth/register", json={
            "username": "testuser",
            "password": "pass1234",
            "grade": "7",
            "language": "en",
        })
    assert r.status_code == 201
    assert r.json()["message"] == "Registered successfully"


def test_register_duplicate(client):
    mock_db = MagicMock()
    mock_db.students.find_one.return_value = {"username": "testuser"}

    with patch("app.api.auth.get_db", return_value=mock_db):
        r = client.post("/auth/register", json={
            "username": "testuser",
            "password": "pass1234",
            "grade": "7",
            "language": "en",
        })
    assert r.status_code == 400


def test_login_invalid(client):
    mock_db = MagicMock()
    mock_db.students.find_one.return_value = None

    with patch("app.api.auth.get_db", return_value=mock_db):
        r = client.post("/auth/token", data={
            "username": "nobody",
            "password": "wrong",
        })
    assert r.status_code == 401
