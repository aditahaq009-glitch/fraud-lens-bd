
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db
from models import ScamReport, VerificationVote
from auth_models import User
from auth import get_current_user
from schemas import VoteCreate, VoteResponse, VoteSummary


router = APIRouter(
    prefix="/reports",
    tags=["Community Verification"]
)


@router.post(
    "/{report_id}/vote",
    response_model=VoteResponse,
    status_code=201
)
def submit_vote(
    report_id: UUID,
    vote: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(ScamReport).filter(
        ScamReport.id == report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found."
        )

    if report.user_id == current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot vote on your own report."
        )

    existing_vote = db.query(VerificationVote).filter(
        VerificationVote.report_id == report_id,
        VerificationVote.user_id == current_user.id
    ).first()

    if existing_vote:
        raise HTTPException(
            status_code=409,
            detail="You have already voted on this report."
        )

    new_vote = VerificationVote(
        report_id=report_id,
        user_id=current_user.id,
        vote_type=vote.vote_type
    )

    try:
        db.add(new_vote)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Vote could not be saved due to a conflict."
        )

    db.refresh(new_vote)

    return new_vote


@router.get(
    "/{report_id}/votes",
    response_model=VoteSummary
)
def get_vote_summary(
    report_id: UUID,
    db: Session = Depends(get_db)
):
    report = db.query(ScamReport).filter(
        ScamReport.id == report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found."
        )

    credible = db.query(VerificationVote).filter(
        VerificationVote.report_id == report_id,
        VerificationVote.vote_type == "credible"
    ).count()

    suspicious = db.query(VerificationVote).filter(
        VerificationVote.report_id == report_id,
        VerificationVote.vote_type == "suspicious"
    ).count()

    return VoteSummary(
        report_id=report_id,
        credible_votes=credible,
        suspicious_votes=suspicious,
        total_votes=credible + suspicious
    )
