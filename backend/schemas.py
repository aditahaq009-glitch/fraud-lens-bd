
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class ReportCreate(BaseModel):
    scam_type: str = Field(..., min_length=1, max_length=100)
    platform: str = Field(..., min_length=1, max_length=100)

    incident_date: Optional[str] = None
    suspicious_identifier: Optional[str] = None

    description: str = Field(..., min_length=10)
    amount_bdt: Optional[float] = Field(default=None, ge=0)

    evidence_files: list[str] = Field(default_factory=list)


class ReportResponse(BaseModel):
    id: UUID
    scam_type: str
    platform: str
    incident_date: Optional[str] = None
    suspicious_identifier: Optional[str] = None
    description: str
    amount_bdt: Optional[float] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
