import { useGetMealsQuery } from '@shared/api/meals/mealsApi'

export default function MealsList() {
  // Передаем параметры (params) внутрь хука.
  // Хук сам управляет состояниями isLoading, error, data!
  const {
    data: meals = [],
    isLoading,
    isFetching, // true, если запрос перезапрашивается в фоне
    error,
  } = useGetMealsQuery() // Сюда можно передать { date: '2026-06-04' }

  if (isLoading) return <div>Загрузка (isLoading)...</div>

  // Обработка ошибок в стиле твоего handleSwaggerErrors
  if (error) {
    if ('status' in error) {
      // Ошибка от бэкенда (например, 400, 500)
      return <div style={{ color: 'red' }}>Ошибка сервера: {error.status}</div>
    }
    return <div style={{ color: 'red' }}>Ошибка сети</div>
  }

  return (
    <div>
      <h2>Дневник калорий {isFetching && '🔄 Обновление...'}</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            {meal.food_name} — {meal.total_calories} ккал {new Date(meal.created_at).getDate()}{' '}
            {new Date(meal.created_at).toLocaleTimeString().slice(0, 5)}
          </li>
        ))}
      </ul>
    </div>
  )
}
