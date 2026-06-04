import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@shared/api/baseApi' // Используем твой элиас!

export const store = configureStore({
  reducer: {
    // Подключаем кэш нашего API в общее дерево Redux
    [baseApi.reducerPath]: baseApi.reducer,

    // Если в будущем появятся обычные слайсы (например, для темы или профиля),
    // они будут добавляться сюда:
    // theme: themeReducer,
  },

  // Мидлвар нужен RTK Query для кэширования, инвалидации тегов и полилинга
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

// Настоятельно рекомендую сразу выгрузить типы стора (это стандарт для TS)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
