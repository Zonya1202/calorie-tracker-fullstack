from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base  # Импортируем наш базовый класс


# Описываем таблицу на языке Python. SQLAlchemy сама превратит этот класс в SQL-код таблицы.
class MealModel(Base):
    __tablename__ = "meals"  # Имя таблицы в файле базы данных

    id = Column(Integer, primary_key=True, index=True)
    food_name = Column(String, nullable=False)
    calories_per_100g = Column(Integer, nullable=False)
    weight_g = Column(Integer, nullable=False)
    total_calories = Column(Integer, nullable=False)
    meal_type = Column(String, default="breakfast", nullable=False)
    created_at = Column(DateTime, default=datetime.now)  # Время добавится автоматически
