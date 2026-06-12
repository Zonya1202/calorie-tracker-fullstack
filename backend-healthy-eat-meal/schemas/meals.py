from pydantic import BaseModel, PositiveInt
from datetime import datetime


class MealCreate(BaseModel):
    food_name: str
    calories_per_100g: PositiveInt
    weight_g: PositiveInt
    meal_type: str


class MealUpdate(BaseModel):
    food_name: str
    calories_per_100g: PositiveInt
    weight_g: PositiveInt
    meal_type: str


class MealResponse(BaseModel):
    id: int
    food_name: str
    calories_per_100g: int
    weight_g: int
    total_calories: int
    meal_type: str
    created_at: datetime
    user_id: int

    # Включаем ORM-режим, чтобы Pydantic умел читать данные напрямую из объектов SQLAlchemy
    class Config:
        from_attributes = True
