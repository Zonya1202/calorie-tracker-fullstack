from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, List, cast, Optional
from datetime import datetime, date, timedelta
import logging

import models
from database import get_db
from routers.auth import get_current_user
from schemas.meals import MealCreate, MealUpdate, MealResponse

logger = logging.getLogger(__name__)

# Создаем роутер еды с префиксом /api/v1/meals
router = APIRouter(prefix="/api/meals", tags=["Дневник калорий"])

# Meal type order for sorting
MEAL_TYPE_ORDER = {"breakfast": 1, "lunch": 2, "dinner": 3, "snack": 4}


@router.get("", response_model=List[MealResponse])
def get_meals(
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
    # 🌟 ИСПРАВЛЕНО: имя параметра теперь строго date, чтобы совпадать с фронтендом!
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
):
    """
    Get all meals for current user.

    If date parameter is provided, returns only meals from that day.
    Otherwise returns meals from today.
    """
    try:
        # 1. Распознаем пришедшую дату
        if date:
            try:
                filter_date = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                logger.warning(f"Invalid date format: {date}")
                raise HTTPException(
                    status_code=400, detail="Invalid date format. Use YYYY-MM-DD"
                )
        else:
            filter_date = datetime.utcnow().date()

        # 2. 🌟 ИСПРАВЛЕНО: Безопасные границы суток через timedelta без костылей с числами
        start_of_day = datetime.combine(filter_date, datetime.min.time())
        end_of_day = start_of_day + timedelta(days=1)  # Ровно начало следующих суток

        # 3. Запрос к базе данных
        meals = (
            db.query(models.MealModel)
            .filter(
                models.MealModel.user_id == current_user.id,
                models.MealModel.created_at >= start_of_day,
                models.MealModel.created_at < end_of_day,
            )
            .all()
        )

        # 4. Сортировка по типу приема пищи ( breakfast -> lunch -> dinner -> snack )
        meals = sorted(meals, key=lambda m: MEAL_TYPE_ORDER.get(str(m.meal_type), 5))

        logger.info(
            f"User {current_user.email} retrieved {len(meals)} meals for {filter_date}"
        )
        return meals
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving meals for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving meals")


@router.post("", response_model=MealResponse, status_code=201)
def add_meal(
    meal: MealCreate,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
):
    """Add a new meal record for current user."""
    try:
        # Validate meal data
        if meal.calories_per_100g <= 0 or meal.weight_g <= 0:
            raise HTTPException(
                status_code=400, detail="Calories and weight must be positive"
            )

        if meal.calories_per_100g > 900:
            raise HTTPException(
                status_code=400, detail="Calories per 100g cannot exceed 900"
            )

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

        logger.info(
            f"User {current_user.email} added meal: {meal.food_name} ({total_cals} kcal)"
        )
        return db_meal
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding meal for user {current_user.email}: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error adding meal")


@router.put("/{meal_id}", response_model=MealResponse)
def update_meal(
    meal_id: int,
    updated_meal: MealUpdate,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
):
    """Update an existing meal record."""
    try:
        db_meal = (
            db.query(models.MealModel)
            .filter(
                models.MealModel.id == meal_id,
                models.MealModel.user_id == current_user.id,
            )
            .first()
        )
        if not db_meal:
            logger.warning(
                f"User {current_user.email} attempted to update non-existent meal {meal_id}"
            )
            raise HTTPException(status_code=404, detail="Meal not found")

        # Validate new data
        if updated_meal.calories_per_100g <= 0 or updated_meal.weight_g <= 0:
            raise HTTPException(
                status_code=400, detail="Calories and weight must be positive"
            )

        db_meal = cast(Any, db_meal)

        total_cals = int((updated_meal.calories_per_100g * updated_meal.weight_g) / 100)
        db_meal.food_name = updated_meal.food_name
        db_meal.calories_per_100g = updated_meal.calories_per_100g
        db_meal.weight_g = updated_meal.weight_g
        db_meal.total_calories = total_cals
        db_meal.meal_type = updated_meal.meal_type

        db.commit()
        db.refresh(db_meal)

        logger.info(f"User {current_user.email} updated meal {meal_id}")
        return db_meal
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating meal for user {current_user.email}: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error updating meal")


@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(get_current_user),
):
    """Delete a meal record."""
    try:
        db_meal = (
            db.query(models.MealModel)
            .filter(
                models.MealModel.id == meal_id,
                models.MealModel.user_id == current_user.id,
            )
            .first()
        )
        if not db_meal:
            logger.warning(
                f"User {current_user.email} attempted to delete non-existent meal {meal_id}"
            )
            raise HTTPException(status_code=404, detail="Meal not found")

        db.delete(db_meal)
        db.commit()

        logger.info(f"User {current_user.email} deleted meal {meal_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting meal for user {current_user.email}: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting meal")
