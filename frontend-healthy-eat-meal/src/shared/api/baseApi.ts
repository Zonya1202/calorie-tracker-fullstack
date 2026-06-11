import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@store/index' // Импортируем тип стора для типизации

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    // МАГИЯ: Автоматически добавляем токен авторизации ко всем запросам
    prepareHeaders: (headers, { getState }) => {
      // Вытаскиваем токен прямо из нашего Redux-состояния auth
      const token = (getState() as RootState).auth.token

      if (token) {
        // Если токен есть в памяти — прикрепляем его по стандарту Bearer
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ['Meals'],
  endpoints: () => ({}),
})
