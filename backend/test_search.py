"""Tests for the Universal Search endpoint.

Run from the backend folder:
    python -m pytest -v
"""

import os
from datetime import datetime, timezone
from types import SimpleNamespace

# Dummy values so these tests do not need a real .env or database.
for _key, _value in {
    "DB_USER": "test",
    "DB_PASSWORD": "test",
    "DB_HOST": "localhost",
    "DB_PORT": "5432",
    "DB_NAME": "test",
}.items():
    os.environ.setdefault(_key, _value)

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError

from database import get_db
from search import normalize, router


def make_report(**overrides):
    data = {
        "id": "11111111-1111-1111-1111-111111111111",
        "scam_type": "Fake online shopping / E-commerce",
        "platform": "Facebook",
        "suspicious_identifier": "01911-222333",
        "description": "Paid in advance but never received the product.",
        "amount_bdt": 1500.0,
        "incident_date": "2026-11-01",
        "status": "Unverified",
        "created_at": datetime(2026, 11, 2, tzinfo=timezone.utc),
    }
    data.update(overrides)
    return SimpleNamespace(**data)


class FakeQuery:
    def __init__(self, reports, fail=False):
        self.reports = reports
        self.fail = fail

    def order_by(self, *args):
        return self

    def all(self):
        if self.fail:
            raise SQLAlchemyError("database is down")
        return self.reports


class FakeSession:
    def __init__(self, reports=None, fail=False):
        self.reports = reports or []
        self.fail = fail

    def query(self, *args):
        return FakeQuery(self.reports, self.fail)

    def rollback(self):
        pass


def make_client(reports=None, fail=False):
    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_db] = lambda: FakeSession(reports, fail)
    return TestClient(app)


# ---------- normalize ----------

def test_normalize_phone_formats_match():
    assert normalize("01700000000") == "01700000000"
    assert normalize("017-0000 0000") == "01700000000"
    assert normalize("+8801700000000") == "01700000000"


def test_normalize_text_is_lowercase():
    assert normalize("  Fake-Lottery.COM ") == "fake-lottery.com"


def test_normalize_empty_values():
    assert normalize("") == ""
    assert normalize(None) == ""


# ---------- /search endpoint ----------

def test_empty_query_returns_empty_list():
    data = make_client().get("/search?q=").json()
    assert data["results"] == []


def test_demo_record_found_with_international_format():
    data = make_client().get("/search?q=%2B8801700000000").json()
    assert len(data["results"]) == 1
    assert data["results"][0]["source"] == "demo"


def test_community_report_found_by_formatted_number():
    client = make_client([make_report()])
    data = client.get("/search?q=01911222333").json()
    assert len(data["results"]) == 1
    result = data["results"][0]
    assert result["source"] == "community"
    assert result["status"] == "Unverified"
    assert result["platform"] == "Facebook"


def test_no_match_returns_empty_list():
    data = make_client([make_report()]).get("/search?q=nothing-here").json()
    assert data["results"] == []


def test_database_error_still_returns_demo_results():
    data = make_client(fail=True).get("/search?q=fake-lottery").json()
    assert data["database_available"] is False
    assert len(data["results"]) == 1