import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAddMealMutation } from '@shared/api/meals/mealsApi'

export default function AddMealPage() {
  const [addMeal, { isLoading, isError }] = useAddMealMutation()
  const navigate = useNavigate() // Хук для программного редиректа

  const [form, setForm] = useState({
    foodName: '',
    calories: '',
    weight: '',
  })

  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.foodName || !form.calories || !form.weight) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    if (Number(form.calories) <= 0 || Number(form.weight) <= 0) {
      setError('Калорийность и вес должны быть положительными числами')
      return
    }

    try {
      // Отправляем POST запрос в FastAPI
      await addMeal({
        food_name: form.foodName,
        calories_per_100g: Number(form.calories),
        weight_g: Number(form.weight),
      }).unwrap()

      // Если бэк ответил 200 OK, перекидываем пользователя на главную страницу, если нет, то unwrap() выбросит ошибку, которую мы поймаем в catch
      navigate('/')
    } catch (err) {
      console.error('Ошибка при сохранении:', err)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/">← Назад в дневник</Link>
      </div>

      <h2>Что вы съели?</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <input
          type="text"
          placeholder="Название еды (например, Яблоко)"
          value={form.foodName}
          onChange={(e) => setForm({ ...form, foodName: e.target.value })}
          disabled={isLoading}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="number"
          placeholder="Калорийность на 100г"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
          disabled={isLoading}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="number"
          placeholder="Вес порции в граммах"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          disabled={isLoading}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Сохранение...' : 'Записать в дневник'}
        </button>

        {isError && <p style={{ color: 'red' }}>Не удалось связаться с сервером.</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
