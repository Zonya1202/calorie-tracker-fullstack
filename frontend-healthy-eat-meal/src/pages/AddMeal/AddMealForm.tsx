import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddMealMutation } from '@shared/api/meals'
import styles from './AddMealForm.module.scss'

export default function AddMealForm() {
  const [addMeal, { isLoading }] = useAddMealMutation()
  const navigate = useNavigate()

  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [weight, setWeight] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!foodName || !calories || !weight) {
      setError('Пожалуйста, заполните все поля формы.')
      return
    }

    if (Number(calories) <= 0 || Number(weight) <= 0) {
      setError('Калорийность и вес должны быть больше нуля.')
      return
    }

    try {
      await addMeal({
        food_name: foodName,
        calories_per_100g: Number(calories),
        weight_g: Number(weight),
      }).unwrap()

      navigate('/dashboard') // Возвращаемся в личный кабинет
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении данных.')
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Что вы съели?</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="foodName">Название продукта</label>
          <input
            id="foodName"
            type="text"
            className={styles.input}
            placeholder="Например: Куриное филе"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="calories">Калорийность (на 100г)</label>
          <input
            id="calories"
            type="number"
            className={styles.input}
            placeholder="Например: 113"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="weight">Вес порции (в граммах)</label>
          <input
            id="weight"
            type="number"
            className={styles.input}
            placeholder="Например: 200"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Записать в дневник'}
        </button>
      </form>
    </div>
  )
}
