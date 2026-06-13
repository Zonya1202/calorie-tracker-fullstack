from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import jwt
import logging

import models
from database import get_db
from security import (
    get_password_hash,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
from schemas.auth import UserRegister, UserResponse, TokenResponse

logger = logging.getLogger(__name__)

# Создаем роутер авторизации с префиксом /api/auth
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.UserModel:
    """Extract and validate JWT token from request header."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise credentials_exception
    except jwt.PyJWTError as e:
        logger.warning(f"JWT validation error: {str(e)}")
        raise credentials_exception

    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if user is None:
        logger.warning(f"User not found for email: {email}")
        raise credentials_exception
    return user


@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user with email and password."""
    try:
        # Check if user already exists
        existing_user = (
            db.query(models.UserModel)
            .filter(models.UserModel.email == user_data.email)
            .first()
        )
        if existing_user:
            logger.warning(
                f"Registration attempt with existing email: {user_data.email}"
            )
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create new user
        hashed_pwd = get_password_hash(user_data.password)
        new_user = models.UserModel(
            email=user_data.email, hashed_password=hashed_pwd, name=user_data.name
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info(f"New user registered: {user_data.email}")
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Registration error")


@router.post("/login", response_model=TokenResponse)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Login user and return JWT token."""
    try:
        user = (
            db.query(models.UserModel)
            .filter(models.UserModel.email == form_data.username)
            .first()
        )
        if not user or not verify_password(
            form_data.password, user.hashed_password.strip()
        ):
            logger.warning(f"Failed login attempt for email: {form_data.username}")
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token(data={"sub": user.email})
        logger.info(f"User logged in: {user.email}")
        return {"access_token": token, "token_type": "bearer", "name": user.name}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Login error")
