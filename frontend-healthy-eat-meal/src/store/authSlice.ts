import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  name: string | null
}

// При старте приложения проверяем, нет ли уже сохраненного токена в браузере
const tokenFromStorage = localStorage.getItem('token')

const initialState: AuthState = {
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage, // true, если токен есть
  name: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Экшен для сохранения токена (вызовется при успешном логине)
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload) // Сохраняем намертво в браузер
    },
    // Экшен для выхода из аккаунта
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token') // Стираем из браузера
    },
  },
})

export const { setToken, logout } = authSlice.actions
export default authSlice.reducer
