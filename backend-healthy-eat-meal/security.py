from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()

# Указываем алгоритм хэширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Загружаем СЕКРЕТНЫЙ КЛЮЧ из переменной окружения
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY not found in environment variables. "
        "Please create a .env file with SECRET_KEY or set it as an environment variable."
    )
ALGORITHM = "HS256"


# Функция 1: Превращает чистый пароль в шифр для базы данных
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# Функция 2: Проверяет, совпадает ли введенный пароль с шифром из базы
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Функция 3: Выдает электронный пропуск (JWT-токен) на 1 день
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    # Ставим срок действия пропуска — 24 часа
    expire = datetime.now() + timedelta(hours=24)
    to_encode.update({"exp": expire})

    # Кодируем данные пользователя (например, его email) в строку-токен
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
