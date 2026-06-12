import LogInForm from './LogInForm'
import styles from './LogIn.module.scss'

export default function LogIn() {
  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>Вход</h1>
      <LogInForm />
    </div>
  )
}
