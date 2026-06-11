import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@shared/api/baseApi'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    // Подключаем кэш нашего API в общее дерево Redux
    [baseApi.reducerPath]: baseApi.reducer,
    // И наш слайс авторизации, который будет хранить токен и статус аутентификации
    auth: authReducer,
  },

  // Мидлвар нужен RTK Query для кэширования, инвалидации тегов и полилинга
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

// Настоятельно рекомендую сразу выгрузить типы стора (это стандарт для TS)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
