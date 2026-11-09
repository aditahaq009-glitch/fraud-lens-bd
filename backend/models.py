
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, Float, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID

from database import Base


class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    scam_type = Column(String(100), nullable=False)
    platform = Column(String(100), nullable=False)

    incident_date = Column(String(50), nullable=True)
    suspicious_identifier = Column(String(255), nullable=True)

    description = Column(Text, nullable=False)
    amount_bdt = Column(Float, nullable=True)

    evidence_files = Column(JSON, nullable=False, default=list)

    status = Column(String(30), default="Unverified", nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
