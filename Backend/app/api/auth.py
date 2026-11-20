from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    AuthResponse
)
from app.services.auth_service import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    result = register_user(
        db,
        request.email,
        request.password
    )

    if result is None:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    return result


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    result = login_user(
        db,
        request.email,
        request.password
    )

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password."
        )

    return result