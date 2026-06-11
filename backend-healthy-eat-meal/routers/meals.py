from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List, cast

import models
from database import get_db
from routers.auth import (
    get_current_user,
)  # Импортируем защитника из соседнего роутера
from schemas.meals import MealCreate, MealUpdate, MealResponse

# Создаем роутер еды с префиксом /api/meals
router = APIRouter(prefix="/api/meals", tags=["Дневник калорий"])


@router.get("", response_model=List[MealResponse])
def get_meals(
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
):
    return (
        db.query(models.MealModel)
        .filter(models.MealModel.user_id == current_user.id)
        .all()
    )


@router.post("", response_model=MealResponse)
def add_meal(
    meal: MealCreate,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
):
    total_cals = int((meal.calories_per_100g * meal.weight_g) / 100)
    db_meal = models.MealModel(
        food_name=meal.food_name,
        calories_per_100g=meal.calories_per_100g,
        weight_g=meal.weight_g,
        total_calories=total_cals,
        meal_type=meal.meal_type,
        user_id=current_user.id,
    )
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal


@router.put("/{meal_id}", response_model=MealResponse)
def update_meal(
    meal_id: int,
    updated_meal: MealUpdate,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
):
    db_meal = (
        db.query(models.MealModel)
        .filter(
            models.MealModel.id == meal_id, models.MealModel.user_id == current_user.id
        )
        .first()
    )
    if not db_meal:
        raise HTTPException(status_code=404, detail="Блюдо не найдено или нет прав")

    db_meal = cast(Any, db_meal)

    total_cals = int((updated_meal.calories_per_100g * updated_meal.weight_g) / 100)
    db_meal.food_name = updated_meal.food_name
    db_meal.calories_per_100g = updated_meal.calories_per_100g
    db_meal.weight_g = updated_meal.weight_g
    db_meal.total_calories = total_cals
    db_meal.meal_type = updated_meal.meal_type

    db.commit()
    db.refresh(db_meal)
    return db_meal


@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
):
    db_meal = (
        db.query(models.MealModel)
        .filter(
            models.MealModel.id == meal_id, models.MealModel.user_id == current_user.id
        )
        .first()
    )
    if not db_meal:
        raise HTTPException(status_code=404, detail="Блюдо не найдено или нет прав")

    db.delete(db_meal)
    db.commit()
    return None
