from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import jwt

import models
from database import get_db
from security import (
    get_password_hash,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
from schemas.auth import UserRegister, UserResponse, TokenResponse  # Наш элиас схем

# Создаем роутер авторизации с префиксом /api/auth
router = APIRouter(prefix="/api/auth", tags=["Авторизация"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# Функция-защитник
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Токен неверный или истек",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.UserModel)
        .filter(models.UserModel.email == user_data.email)
        .first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    hashed_pwd = get_password_hash(user_data.password)
    new_user = models.UserModel(
        email=user_data.email, hashed_password=hashed_pwd, name=user_data.name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=TokenResponse)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = (
        db.query(models.UserModel)
        .filter(models.UserModel.email == form_data.username)
        .first()
    )
    if not user or not verify_password(
        form_data.password, user.hashed_password.strip()
    ):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "name": user.name}
