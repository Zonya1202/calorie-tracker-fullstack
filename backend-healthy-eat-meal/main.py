# Глобальная Точка Входа (main.py)
# Теперь этот файл выполняет роль Генерального Директора. Он сам ничего не делает, он просто собирает систему воедино:
# 1. Инициализирует сам фреймворк FastAPI.
# 2. Дает команду SQLAlchemy проверить и создать таблицы в базе данных SQLite (models.Base.metadata.create_all).
# 3. Настраивает правила безопасности CORS для фронтенда.
# 4. Регистрирует («подключает») роутеры: app.include_router(auth.router).


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# Импортируем наши новые роутеры
from routers import auth, meals

app = FastAPI(title="Calorie Tracker API", version="1.0.0")

# Автоматически разворачиваем таблицы в базе SQLite
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# МАГИЯ: Подключаем роутеры к приложению
app.include_router(auth.router)
app.include_router(meals.router)
