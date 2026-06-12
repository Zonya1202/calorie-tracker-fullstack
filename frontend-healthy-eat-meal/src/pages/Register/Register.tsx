import RegisterForm from './RegisterForm'
import styles from './Register.module.scss'

export default function Register() {
  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>Регистрация</h1>
      <RegisterForm />
    </div>
  )
}
