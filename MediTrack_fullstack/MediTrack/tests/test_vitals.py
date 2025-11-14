
import os
import json
import pytest
from app import create_app
from app.models import db

@pytest.fixture
def client():
    os.environ["DATABASE_URL"] = "sqlite:///:memory:"
    os.environ["SECRET_KEY"] = "test"
    app = create_app()
    app.config.update(TESTING=True)
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def register_and_login(client):
    client.post("/auth/register", json={"email": "a@a.com", "password": "x"})
    res = client.post("/auth/login", json={"email": "a@a.com", "password": "x"})
    token = res.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_flow(client):
    headers = register_and_login(client)
    # create patient
    r = client.post("/patients", json={"name": "Alex", "age": 30, "gender": "Male"}, headers=headers)
    pid = r.get_json()["id"]

    # add vitals
    v = client.post("/vitals", json={"patient_id": pid, "heart_rate": 78, "systolic": 120, "diastolic": 80, "temperature": 36.9}, headers=headers)
    assert v.status_code == 201

    # list vitals
    lv = client.get(f"/vitals/{pid}", headers=headers)
    assert lv.status_code == 200
    assert len(lv.get_json()) == 1

    # summary
    s = client.get(f"/vitals/summary/{pid}", headers=headers)
    js = s.get_json()
    assert "averages" in js and "last_reading" in js
