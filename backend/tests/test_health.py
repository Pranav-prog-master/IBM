def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_docs(client):
    r = client.get("/docs")
    assert r.status_code == 200


def test_root_redirects(client):
    r = client.get("/", follow_redirects=False)
    assert r.status_code in (307, 308)
