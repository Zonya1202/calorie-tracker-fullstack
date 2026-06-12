import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@store/index'
import { logout } from '@store/authSlice'
import styles from './Header.module.scss'
import { baseApi } from '@shared/api/baseApi'

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Вытаскиваем имя пользователя и статус авторизации из стора Redux
  const { name, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(baseApi.util.resetApiState())
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <Link to={isAuthenticated ? '/dashboard' : '/'} className={styles.logo}>
          🍏 Калории2026
        </Link>
        <nav className={styles.nav}>
          {isAuthenticated ? (
            // --- Интерфейс для авторизованного пользователя ---
            <>
              <Link to="/dashboard" className={styles.link}>
                Дневник
              </Link>
              <Link to="/add" className={styles.link}>
                Добавить
              </Link>
              <span className={styles.userName}>👤 {name}</span>
              <button onClick={() => handleLogout()} className={styles.logoutBtn}>
                Выйти
              </button>
            </>
          ) : (
            // --- Интерфейс для гостя ---
            <>
              <Link to="/login" className={styles.link}>
                Войти
              </Link>
              <Link to="/register" className={styles.link}>
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
