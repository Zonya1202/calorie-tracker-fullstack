import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  name: string | null
}

// При старте приложения проверяем, нет ли уже сохраненного токена в браузере
const tokenFromStorage = localStorage.getItem('token')
const nameFromStorage = localStorage.getItem('name')

const initialState: AuthState = {
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage, // true, если токен есть
  name: nameFromStorage,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Экшен для сохранения токена (вызовется при успешном логине)
    setCredentials: (state, action: PayloadAction<{ token: string; name: string }>) => {
      state.token = action.payload.token
      state.isAuthenticated = true
      state.name = action.payload.name
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('name', action.payload.name)
    },
    // Экшен для выхода из аккаунта
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      state.name = null
      localStorage.removeItem('token') // Стираем из браузера
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
