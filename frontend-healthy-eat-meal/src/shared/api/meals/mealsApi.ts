import { baseApi } from '@api/baseApi'
import type { Meal } from '@types'

// Описываем типы для параметров (query params), если они нужны
interface GetMealsParams {
  total_calories?: number
  date?: string
}

interface CreateMealDto {
  food_name: string
  calories_per_100g: number
  weight_g: number
}

// Расширяем базовый API эндпоинтами для еды
export const mealsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Аналог твоего getDriverItems
    getMeals: builder.query<Meal[], GetMealsParams | void>({
      query: (params) => ({
        url: 'meals',
        method: 'GET',
        params: params || {}, // Передаем параметры даты, если есть
      }),
      providesTags: ['Meals'],
    }),

    // Запрос на добавление еды (POST)
    addMeal: builder.mutation<Meal, CreateMealDto>({
      query: (body) => ({
        url: 'meals',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Meals'], // Автоматически заставит getMeals перезапуститься!
    }),
  }),
})

// Экспортируем авто-сгенерированные хуки для компонентов
export const { useGetMealsQuery, useAddMealMutation } = mealsApi
