import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@shared/api/baseApi'
import authReducer from './authSlice'
import dateReducer from './dateSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    date: dateReducer,
  },

  // Мидлвар нужен RTK Query для кэширования, инвалидации тегов и полилинга
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

// Настоятельно рекомендую сразу выгрузить типы стора (это стандарт для TS)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
