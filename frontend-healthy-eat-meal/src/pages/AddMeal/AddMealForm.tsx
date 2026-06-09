import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddMealMutation } from '@shared/api/meals'
import Input from '@components/Input/Input'
import styles from './AddMealForm.module.scss'

export default function AddMealForm() {
  const [addMeal, { isLoading }] = useAddMealMutation()
  const navigate = useNavigate()

  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [weight, setWeight] = useState('')
  const [mealType, setMealType] = useState('breakfast')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!foodName || !calories || !weight || !mealType) {
      setError('Пожалуйста, заполните все поля формы.')
      return
    }

    try {
      await addMeal({
        food_name: foodName,
        calories_per_100g: Number(calories),
        weight_g: Number(weight),
        meal_type: mealType,
      }).unwrap()
      navigate('/dashboard')
    } catch (err) {
      setError('Не удалось сохранить запись.' + (err as Error).message)
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Что вы съели?</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="mealType">Прием пищи</label>
          <select
            id="mealType"
            className={styles.select}
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            disabled={isLoading}
          >
            <option value="breakfast">Завтрак</option>
            <option value="lunch">Обед</option>
            <option value="dinner">Ужин</option>
            <option value="snack">Перекус / Полдник</option>
          </select>
        </div>

        <Input
          id="foodName"
          label="Название продукта"
          type="text"
          placeholder="Например: Куриное филе"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          disabled={isLoading}
        />

        <Input
          id="calories"
          label="Калорийность (на 100г)"
          type="number"
          placeholder="Например: 113"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          disabled={isLoading}
        />

        <Input
          id="weight"
          label="Вес порции (в граммах)"
          type="number"
          placeholder="Например: 200"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Записать в дневник'}
        </button>
      </form>
    </div>
  )
}
