from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List
from sqlalchemy.orm import Session

# Импортируем наши новые модули базы данных
import models
from database import engine, get_db

app = FastAPI()

# МАГИЯ: Автоматически создаем таблицы в файле calories.db, если их еще нет
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Схемы валидации Pydantic для фронтенда остаются почти такими же
class MealCreate(BaseModel):
    food_name: str
    calories_per_100g: int
    weight_g: int


class MealResponse(BaseModel):
    id: int
    food_name: str
    total_calories: int
    created_at: datetime

    # Включаем ORM-режим, чтобы Pydantic умел читать данные напрямую из объектов SQLAlchemy
    class Config:
        from_attributes = True


# 1. ПОЛУЧЕНИЕ ДАННЫХ ИЗ БД (GET)
@app.get("/api/meals", response_model=List[MealResponse])
def get_meals(db: Session = Depends(get_db)):  # Внедряем сессию БД
    # Делаем запрос к таблице meals и забираем все записи
    meals = db.query(models.MealModel).all()
    return meals


# 2. ДОБАВЛЕНИЕ ДАННЫХ В БД (POST)
@app.post("/api/meals", response_model=MealResponse)
def add_meal(meal: MealCreate, db: Session = Depends(get_db)):
    # Рассчитываем итоговые калории (наша бизнес-логика)
    total_cals = int((meal.calories_per_100g * meal.weight_g) / 100)

    # Создаем объект модели SQLAlchemy для записи в БД
    db_meal = models.MealModel(
        food_name=meal.food_name,
        calories_per_100g=meal.calories_per_100g,
        weight_g=meal.weight_g,
        total_calories=total_cals,
    )

    db.add(db_meal)  # Ложим объект в очередь на добавление
    db.commit()  # Фиксируем изменения в файле базы данных
    db.refresh(
        db_meal
    )  # Обновляем объект, чтобы получить автоматически сгенерированный базой id

    return db_meal
