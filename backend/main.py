
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from analysis import router as analysis_router
from search import router as search_router
from uploads import router as uploads_router

from database import get_db, Base, engine
from models import ScamReport
from auth import router as auth_router, get_current_user
from auth_models import User
from schemas import ReportCreate, ReportResponse
from verification import router as verification_router

app = FastAPI(title="Fraud Lens BD API")


# Allow communication with Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register existing routers
app.include_router(analysis_router)
app.include_router(search_router)
app.include_router(uploads_router)
app.include_router(auth_router)
app.include_router(verification_router)
# Create database tables
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


# Health check
@app.get("/")
def home():
    return {"message": "Fraud Lens BD Backend is running!"}


# Create a scam report in PostgreSQL
@app.post("/reports", status_code=201)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_report = ScamReport(
    **report.model_dump(),
    user_id=current_user.id,
    status="Unverified"
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    report_data = ReportResponse.model_validate(
        new_report
    ).model_dump(mode="json")

    return {
        "message": "Report submitted successfully",
        "report": report_data
    }


# Retrieve all scam reports from PostgreSQL
@app.get("/reports")
def get_reports(db: Session = Depends(get_db)):

    reports = (
        db.query(ScamReport)
        .order_by(ScamReport.created_at.desc())
        .all()
    )

    report_data = [
        ReportResponse.model_validate(report).model_dump(mode="json")
        for report in reports
    ]

    return {
        "total": len(report_data),
        "reports": report_data
    }
