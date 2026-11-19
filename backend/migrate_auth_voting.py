
from sqlalchemy import text
from database import engine, Base
from models import ScamReport, VerificationVote
from auth_models import User


def migrate():
    # Create any missing tables
    Base.metadata.create_all(bind=engine)

    # Add user_id to existing scam_reports table
    with engine.begin() as connection:
        connection.execute(text("""
            ALTER TABLE scam_reports
            ADD COLUMN IF NOT EXISTS user_id UUID
            REFERENCES users(id)
        """))

    print("Database migration completed successfully.")


if __name__ == "__main__":
    migrate()
