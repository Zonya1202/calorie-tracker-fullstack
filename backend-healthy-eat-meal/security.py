from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

# Указываем алгоритм хэширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# СЕКРЕТНЫЙ КЛЮЧ. В реальном проекте он прячется, но для простоты напишем строку.
# С его помощью сервер подписывает пропуска. Если изменить хоть одну букву, токен станет невалидным.
SECRET_KEY = "SUPER_SECRET_KEY_FOR_CALORIE_TRACKER_2026"
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
