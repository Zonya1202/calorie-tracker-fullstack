import { useLoginMutation } from '@shared/api/auth/authApi'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@store/authSlice'
import Input from '@components/Input/Input'
import styles from './LogInForm.module.scss'

export default function LogInForm() {
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля формы.')
      return
    }

    try {
      const result = await login({
        email: email,
        password: password,
      }).unwrap()

      dispatch(setCredentials({ token: result.access_token, name: result.name }))
      navigate('/dashboard')
    } catch {
      setError('Неверный email или пароль. Пожалуйста, попробуйте еще раз.')
    }
  }

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          id="email"
          type="email"
          label="Email адрес"
          placeholder="example@mail.ru"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <Input
          id="password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Проверка...' : 'Войти'}
        </button>
      </form>

      <div className={styles.footerLink}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  )
}
