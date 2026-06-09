from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


# Таблица пользователей
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Связь: один пользователь может иметь много записей еды
    meals = relationship("MealModel", back_populates="user")


# Таблица блюд (записей еды)
class MealModel(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    food_name = Column(String, nullable=False)
    calories_per_100g = Column(Integer, nullable=False)
    weight_g = Column(Integer, nullable=False)
    total_calories = Column(Integer, nullable=False)
    meal_type = Column(String, default="breakfast", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Привязываем блюдо к пользователю через внешний ключ (ID пользователя)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Обратная связь для SQLAlchemy
    user = relationship("UserModel", back_populates="meals")
