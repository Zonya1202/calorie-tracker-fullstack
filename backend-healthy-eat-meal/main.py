from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Any, List, cast
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
    meal_type: str


class MealUpdate(BaseModel):
    food_name: str
    calories_per_100g: int
    weight_g: int
    meal_type: str


class MealResponse(BaseModel):
    id: int
    food_name: str
    calories_per_100g: int
    weight_g: int
    total_calories: int
    meal_type: str
    created_at: datetime

    # Включаем ORM-режим, чтобы Pydantic умел читать данные напрямую из объектов SQLAlchemy
    class Config:
        from_attributes = True


# --- ЭНДПОИНТЫ ---


# 1. ПОЛУЧЕНИЕ ДАННЫХ ИЗ БД (GET)
@app.get("/api/meals", response_model=List[MealResponse])
def get_meals(db: Session = Depends(get_db)):
    return db.query(models.MealModel).all()


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
        meal_type=meal.meal_type,
    )

    db.add(db_meal)  # Ложим объект в очередь на добавление
    db.commit()  # Фиксируем изменения в файле базы данных
    db.refresh(
        db_meal
    )  # Обновляем объект, чтобы получить автоматически сгенерированный базой id

    return db_meal


# 3. ИЗМЕНЕНИЕ БЛЮДА (PUT)
@app.put("/api/meals/{meal_id}", response_model=MealResponse)
def update_meal(meal_id: int, updated_meal: MealUpdate, db: Session = Depends(get_db)):
    db_meal = db.query(models.MealModel).filter(models.MealModel.id == meal_id).first()
    if not db_meal:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")

    db_meal = cast(Any, db_meal)

    # Пересчитываем калории на основе новых введенных данных
    total_cals = int((updated_meal.calories_per_100g * updated_meal.weight_g) / 100)

    db_meal.food_name = updated_meal.food_name
    db_meal.calories_per_100g = updated_meal.calories_per_100g
    db_meal.weight_g = updated_meal.weight_g
    db_meal.total_calories = total_cals
    db_meal.meal_type = updated_meal.meal_type

    db.commit()
    db.refresh(db_meal)
    return db_meal


# 4. УДАЛЕНИЕ БЛЮДА (DELETE)
@app.delete("/api/meals/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(meal_id: int, db: Session = Depends(get_db)):
    db_meal = db.query(models.MealModel).filter(models.MealModel.id == meal_id).first()
    if not db_meal:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")

    db.delete(db_meal)
    db.commit()
    return None
