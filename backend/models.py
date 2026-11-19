
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Text, Float, DateTime, JSON,
    ForeignKey, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID

from database import Base


class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(
    UUID(as_uuid=True),
    ForeignKey("users.id"),
    nullable=True
)
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


class VerificationVote(Base):
    __tablename__ = "verification_votes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    report_id = Column(
        UUID(as_uuid=True),
        ForeignKey("scam_reports.id"),
        nullable=False
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    vote_type = Column(String(20), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "report_id",
            "user_id",
            name="unique_user_report_vote"
        ),
    )
