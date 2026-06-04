from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Указываем, где будет лежать файл нашей базы данных SQLite
DATABASE_URL = "sqlite:///./calories.db"

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
