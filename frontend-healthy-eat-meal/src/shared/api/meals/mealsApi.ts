import { baseApi } from '@api/baseApi'
import type { Meal } from '@types' // Импортируем твой базовый тип Meal

export const mealsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. ЗАПРОС: Берем еду за конкретную дату
    getMeals: builder.query<Meal[], string>({
      query: (date) => `meals?date=${date}`,
      providesTags: (_result, _error, date) => [{ type: 'Meals', id: date }],
    }),

    // 2. ДОБАВЛЕНИЕ: Передаем объект еды (с опциональным полем date)
    addMeal: builder.mutation<
      Meal,
      Omit<Meal, 'id' | 'created_at' | 'user_id' | 'total_calories'> & { date?: string }
    >({
      query: (body) => ({
        url: 'meals',
        method: 'POST',
        body,
      }),
      // Если бэкенд вернул успешный результат, берем дату из ответа, чтобы сбросить кэш
      invalidatesTags: (result) => [
        { type: 'Meals', id: result ? result.created_at.split('T')[0] : 'today' },
      ],
    }),

    // 3. УДАЛЕНИЕ: Принимает ID и строку даты
    deleteMeal: builder.mutation<void, { id: number; date: string }>({
      query: ({ id }) => ({
        url: `meals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { date }) => [{ type: 'Meals', id: date }],
    }),

    // 4. РЕДАКТИРОВАНИЕ: Принимает ID, дату и измененные поля
    updateMeal: builder.mutation<
      Meal,
      {
        id: number
        date: string
        body: Omit<Meal, 'id' | 'created_at' | 'user_id' | 'total_calories'>
      }
    >({
      query: ({ id, body }) => ({
        url: `meals/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { date }) => [{ type: 'Meals', id: date }],
    }),
  }),
})

export const {
  useGetMealsQuery,
  useAddMealMutation,
  useDeleteMealMutation,
  useUpdateMealMutation,
} = mealsApi
