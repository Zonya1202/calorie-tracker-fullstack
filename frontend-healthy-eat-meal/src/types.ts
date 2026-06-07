// Описываем структуру приема пищи, которую возвращает наш FastAPI
export interface Meal {
  id: number
  food_name: string
  calories_per_100g: number
  weight_g: number
  total_calories: number
  meal_type: string
  created_at: string
}
