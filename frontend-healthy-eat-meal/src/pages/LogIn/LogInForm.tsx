import { useLoginMutation } from '@shared/api/auth/authApi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setToken } from '@store/authSlice'

export default function LogInForm() {
  const [login] = useLoginMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля формы.')
      return
    }

    try {
      const result = await login({
        email: email,
        password: password,
      }).unwrap()

      dispatch(setToken(result.access_token))
      navigate('/dashboard')
    } catch (err) {
      setError('Ошибка входа. Пожалуйста, попробуйте еще раз.' + (err as Error).message)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Войти</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}
