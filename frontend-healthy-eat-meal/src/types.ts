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

// Данные, которые мы отправляем при входе и регистрации
export interface AuthDto {
  email: string
  password: string
  name?: string // Имя нужно только для регистрации, для логина его не будет
}

// То, что возвращает бэкенд при успешном логине
export interface TokenResponse {
  access_token: string
  token_type: string
  name: string
}

// То, что возвращает бэкенд при успешной регистрации
export interface UserResponse {
  id: number
  email: string
  name: string
}
