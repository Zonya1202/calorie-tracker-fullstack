import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span>&copy; 2026 Fullstack-Приложение</span>
        <span>Сделано с React + FastAPI</span>
      </div>
    </footer>
  )
}
