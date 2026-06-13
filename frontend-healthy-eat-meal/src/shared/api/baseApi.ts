import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@store/index'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
    validateStatus: (response) => {
      // Treat 401 as success to handle it in Redux
      return response.ok || response.status === 401
    },
  }),
  tagTypes: ['Meals'],
  endpoints: () => ({}),
})
