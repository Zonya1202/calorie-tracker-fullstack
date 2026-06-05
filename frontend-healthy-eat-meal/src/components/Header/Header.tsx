import { Link } from 'react-router-dom'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🍏 Калории2026
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Дневник
          </Link>
          <Link to="/add" className={styles.link}>
            Добавить
          </Link>
        </nav>
      </div>
    </header>
  )
}
