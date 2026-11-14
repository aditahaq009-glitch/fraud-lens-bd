import re
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from models import ScamReport

router = APIRouter()

# Mock dataset for demonstration (clearly marked as demo data)
MOCK_DATABASE = [
    {
        "id": "1",
        "query": "01700000000",
        "category": "Mobile Banking Scam",
        "status": "Reported Scam (Demo)",
        "details": "Multiple user reports claiming fake bKash PIN reset requests.",
        "source": "demo",
    },
    {
        "id": "2",
        "query": "fake-lottery.com",
        "category": "Phishing Domain",
        "status": "Flagged (Demo)",
        "details": "Reported URL associated with SMS lottery scam links.",
        "source": "demo",
    },
]


def normalize(value: Optional[str]) -> str:
    """Lowercase and trim text.

    Phone numbers are cleaned too: spaces, dashes and brackets are removed,
    and +880... / 880... is turned into 0..., so these all match:
    01700000000, 017-0000 0000, +8801700000000
    """
    if not value:
        return ""

    text = value.strip().lower()
    compact = re.sub(r"[\s\-()]", "", text)

    if re.fullmatch(r"\+?\d{6,}", compact):
        digits = compact.lstrip("+")
        if digits.startswith("880"):
            digits = "0" + digits[3:]
        return digits

    return text


def matches(query_norm: str, *fields: Optional[str]) -> bool:
    return any(query_norm in normalize(field) for field in fields if field)


@router.get("/search")
def search_registry(
    q: str = "",
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    query_norm = normalize(q)

    # Always return a list, even when the query is empty or nothing matches
    if not query_norm:
        return {"query": q, "results": [], "database_available": True}

    # 1) Demo records
    results: List[Dict[str, Any]] = [
        item
        for item in MOCK_DATABASE
        if matches(query_norm, item["query"], item["category"])
    ]

    # 2) Real community reports from PostgreSQL
    database_available = True
    try:
        reports = (
            db.query(ScamReport)
            .order_by(ScamReport.created_at.desc())
            .all()
        )
    except SQLAlchemyError:
        db.rollback()
        reports = []
        database_available = False

    for report in reports:
        if matches(
            query_norm,
            report.suspicious_identifier,
            report.scam_type,
            report.platform,
            report.description,
        ):
            results.append(
                {
                    "id": str(report.id),
                    "query": report.suspicious_identifier
                    or "No identifier provided",
                    "category": report.scam_type,
                    "status": report.status,
                    "details": report.description,
                    "source": "community",
                    "platform": report.platform,
                    "amount_bdt": report.amount_bdt,
                    "incident_date": report.incident_date,
                    "reported_at": (
                        report.created_at.isoformat()
                        if report.created_at
                        else None
                    ),
                }
            )

    return {
        "query": q,
        "results": results,
        "database_available": database_available,
    }