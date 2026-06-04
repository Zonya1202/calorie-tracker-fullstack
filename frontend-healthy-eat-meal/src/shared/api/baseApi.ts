import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  // Аналог твоего базового конфига request
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    // Здесь можно глобально прикрепить заголовки, например, токены авторизации
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Meals'], // Список сущностей для авто-обновления кэша
  endpoints: () => ({}), // Оставляем пустым, сущности будут внедрять свои эндпоинты сами
})
