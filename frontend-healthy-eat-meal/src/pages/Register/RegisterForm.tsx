import Input from '@components/Input/Input'
import { useRegisterMutation } from '@shared/api/auth/authApi'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './RegisterForm.module.scss'

export default function RegisterForm() {
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !name) {
      setError('Пожалуйста, заполните все поля формы.')
      return
    }

    try {
      await register({
        email: email,
        password: password,
        name: name,
      }).unwrap()
      navigate('/login')
    } catch {
      setError('Ошибка регистрации. Такой Email уже занят.')
    }
  }

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          id="name"
          type="text"
          label="Ваше имя"
          placeholder="Иван"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
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
          {isLoading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className={styles.footerLink}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </div>
  )
}
