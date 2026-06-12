import { baseApi } from '@shared/api/baseApi'
import type { AuthDto, TokenResponse, UserResponse } from '@types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Мутация регистрации (принимает JSON)
    register: builder.mutation<UserResponse, AuthDto>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),

    // 2. Мутация логина (превращает JSON в строку формы для Python)
    login: builder.mutation<TokenResponse, AuthDto>({
      query: (credentials) => {
        // Конвертируем объект в формат grant_type=password&username=...
        const formData = new URLSearchParams()
        formData.append('username', credentials.email) // В FastAPI поле называется username
        formData.append('password', credentials.password)
        formData.append('name', credentials.name || '')

        return {
          url: 'auth/login',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      },
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation } = authApi
