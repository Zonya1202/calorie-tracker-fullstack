# Глобальная Точка Входа (main.py)
# Инициализирует FastAPI, настраивает безопасность, логирование и подключает роутеры

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
import logging
import os
from dotenv import load_dotenv

# Импортируем наши новые роутеры
from routers import auth, meals

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

app = FastAPI(title="Calorie Tracker API", version="1.0.0")


def init_db():
    """Initialize database tables."""
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized")


# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    # Настройка CORS из переменных окружения
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    cors_origins = [origin.strip() for origin in cors_origins]
    logger.info(f"CORS configured for origins: {cors_origins}")


# Настройка CORS из переменных окружения
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
cors_origins = [origin.strip() for origin in cors_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры к приложению
app.include_router(auth.router)
app.include_router(meals.router)
