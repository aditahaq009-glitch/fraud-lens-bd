"""Tests for the Scam Analysis endpoint (issue #5).

Run from the backend folder:
    python -m pytest -v
"""

from fastapi import FastAPI
from fastapi.testclient import TestClient

from analysis import analyze_text, router

# A small test app with only the analysis router.
# This way the tests do not depend on other features.
app = FastAPI()
app.include_router(router)
client = TestClient(app)


# ---------- Rule logic: analyze_text ----------

SCAM_TEXT = (
    "Your bKash account will be blocked. "
    "Send your OTP and PIN immediately: http://bit.ly/verify"
)
SAFE_TEXT = "Hi, the meeting is moved to 5 pm tomorrow. Please bring the notes."


def test_scam_text_is_high_risk():
    result = analyze_text(SCAM_TEXT)
    assert result["risk_level"] == "High"
    assert result["risk_score"] >= 60
    assert result["category"] == "Mobile banking scam"
    assert len(result["indicators"]) > 0


def test_safe_text_is_low_risk():
    result = analyze_text(SAFE_TEXT)
    assert result["risk_score"] == 0
    assert result["risk_level"] == "Low"
    assert result["category"] == "No clear scam pattern"
    assert result["indicators"] == []


def test_score_never_goes_above_100():
    text = (
        "You have won a lottery prize! Send money now, share your OTP and PIN "
        "urgently. Call customer care: http://bit.ly/claim"
    )
    result = analyze_text(text)
    assert result["risk_score"] == 100
    assert result["risk_level"] == "High"


def test_next_steps_are_given_for_every_level():
    for text in (SCAM_TEXT, SAFE_TEXT):
        result = analyze_text(text)
        assert len(result["next_steps"]) > 0


# ---------- Job scam rule (the fix from the teammate review) ----------

def test_bangla_job_word_alone_is_not_flagged():
    # "We have a job opening, send your CV"
    result = analyze_text("আমাদের কোম্পানিতে চাকরি আছে, CV পাঠান")
    assert result["risk_score"] == 0
    assert result["risk_level"] == "Low"
    assert result["indicators"] == []


def test_bangla_job_with_registration_fee_is_flagged():
    # "To get the job, pay a 2000 taka registration fee"
    result = analyze_text("চাকরি পেতে ২০০০ টাকা রেজিস্ট্রেশন ফি দিন")
    assert result["category"] == "Job offer scam"
    assert result["risk_score"] >= 30
    labels = [item["label"] for item in result["indicators"]]
    assert "Job offer asking for a fee or advance payment" in labels


def test_bangla_unrealistic_earnings_is_flagged():
    # "Earn from home, 5000 taka every day"
    result = analyze_text("ঘরে বসে আয় করুন, দৈনিক ৫০০০ টাকা")
    assert result["category"] == "Job offer scam"
    labels = [item["label"] for item in result["indicators"]]
    assert "Job offer with unrealistic earnings" in labels


def test_english_job_with_fee_is_flagged():
    result = analyze_text(
        "Job offer! Pay the registration fee today to get your joining letter."
    )
    assert result["category"] == "Job offer scam"
    assert result["risk_score"] >= 30


def test_fee_without_job_word_is_not_a_job_scam():
    result = analyze_text("Pay the registration fee for your university form.")
    assert result["category"] != "Job offer scam"
    assert result["risk_score"] == 0


# ---------- API endpoint: POST /analysis ----------

def test_endpoint_returns_result_for_scam_text():
    response = client.post("/analysis", json={"text": SCAM_TEXT})
    assert response.status_code == 200
    data = response.json()
    for key in (
        "risk_score",
        "risk_level",
        "category",
        "indicators",
        "explanation",
        "next_steps",
        "method",
    ):
        assert key in data
    assert data["risk_level"] == "High"


def test_endpoint_returns_low_for_safe_text():
    response = client.post("/analysis", json={"text": SAFE_TEXT})
    assert response.status_code == 200
    assert response.json()["risk_score"] == 0


def test_endpoint_works_with_bangla_text():
    response = client.post(
        "/analysis", json={"text": "চাকরি পেতে ২০০০ টাকা রেজিস্ট্রেশন ফি দিন"}
    )
    assert response.status_code == 200
    assert response.json()["category"] == "Job offer scam"


def test_endpoint_rejects_too_short_text():
    response = client.post("/analysis", json={"text": "hi"})
    assert response.status_code == 422


def test_endpoint_rejects_too_long_text():
    response = client.post("/analysis", json={"text": "a" * 5001})
    assert response.status_code == 422


def test_endpoint_rejects_missing_text():
    response = client.post("/analysis", json={})
    assert response.status_code == 422