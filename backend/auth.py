
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import jwt

from uuid import UUID
from database import get_db
from auth_models import User
from auth_schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# Register a new user
@router.post("/register", response_model=TokenResponse, status_code=201)
def register_user(data: UserRegister, db: Session = Depends(get_db)):

    email = data.email.strip().lower()

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    new_user = User(
        full_name=data.full_name.strip(),
        email=email,
        hashed_password=get_password_hash(data.password),
        role="user"
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    token = create_access_token(str(new_user.id), new_user.role)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }


# Login an existing user
@router.post("/login", response_model=TokenResponse)
def login_user(data: UserLogin, db: Session = Depends(get_db)):

    email = data.email.strip().lower()

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(str(user.id), user.role)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

# OAuth2 login endpoint for Swagger authorization
@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    email = form_data.username.strip().lower()

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(str(user.id), user.role)

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# Get the currently authenticated user
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token."
            )

        user = db.query(User).filter(User.id == UUID(user_id)).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User account not found."
            )

        return user

    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token."
        )


# Get current user profile
@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user
