from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Получаем URL базы данных из переменной окружения
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./calories.db")

# Создаем движок подключения.
# check_same_thread нужен ТОЛЬКО для SQLite, чтобы FastAPI мог безопасно работать в несколько потоков
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Создаем фабрику сессий — через нее мы будем делать запросы (вызов кнопок "сохранить", "удалить")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс, от которого мы будем наследовать все наши таблицы (модели)
Base = declarative_base()


# Функция-помощник (Dependency Injection) для FastAPI.
# Она открывает сессию БД для каждого запроса с фронтенда и закрывает её, когда запрос выполнен.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
