// Описываем структуру приема пищи, которую возвращает наш FastAPI
export interface Meal {
  id: number
  food_name: string
  total_calories: number
  created_at: string // Бэкенд возвращает дату строкой ISO
}
