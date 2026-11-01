
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4
from analysis import router as analysis_router


app = FastAPI(title="Fraud Lens BD API")

# Allow communication with Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(analysis_router)

# Temporary development storage
reports = []


# Report data validation
class ReportCreate(BaseModel):
    scam_type: str
    platform: str
    incident_date: Optional[str] = None
    suspicious_identifier: Optional[str] = None
    description: str
    amount_bdt: Optional[float] = Field(default=None, ge=0)
    evidence_files: list[str] = []


# Health check
@app.get("/")
def home():
    return {"message": "Fraud Lens BD Backend is running!"}


# Create a scam report
@app.post("/reports", status_code=201)
def create_report(report: ReportCreate):

    new_report = {
        "id": str(uuid4()),
        **report.model_dump(),
        "status": "Unverified",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    reports.append(new_report)

    return {
        "message": "Report submitted successfully",
        "report": new_report
    }


# Retrieve all scam reports
@app.get("/reports")
def get_reports():
    return {
        "total": len(reports),
        "reports": reports
    }
