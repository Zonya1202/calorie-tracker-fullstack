import { useRegisterMutation } from '@shared/api/auth/authApi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterForm() {
  const [register] = useRegisterMutation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    } catch (err) {
      setError('Ошибка регистрации. Пожалуйста, попробуйте еще раз.' + (err as Error).message)
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
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Зарегестрироваться</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}
