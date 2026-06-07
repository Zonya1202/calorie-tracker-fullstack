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
  meal_type: string
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
    // Метод удаления (DELETE)
    deleteMeal: builder.mutation<void, number>({
      query: (id) => ({
        url: `meals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Meals'], // Сбросит кэш и перерисует список на экране
    }),
    // Метод изменения (PUT)
    updateMeal: builder.mutation<Meal, { id: number; body: CreateMealDto }>({
      query: ({ id, body }) => ({
        url: `meals/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Meals'],
    }),
  }),
})

// Экспортируем авто-сгенерированные хуки для компонентов
export const {
  useGetMealsQuery,
  useAddMealMutation,
  useDeleteMealMutation,
  useUpdateMealMutation,
} = mealsApi
