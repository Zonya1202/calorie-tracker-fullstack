import { Link } from 'react-router-dom'
import AddMealForm from './AddMealForm'
import styles from './AddMeal.module.scss'

export default function AddMealPage() {
  return (
    <div className={styles.container}>
      <Link to="/dashboard" className={styles.backLink}>
        ← Назад в личный кабинет
      </Link>
      <AddMealForm />
    </div>
  )
}
