import DashboardMealsList from '@pages/Dashboard/DashbordMealsList'
import { Link } from 'react-router-dom'
import styles from './Dashboard.module.scss'

export default function Dashboard() {
  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Дневник калорий</h1>
        {/* Кнопка перехода на страницу добавления */}
        <Link to="/add" className={styles.addBtn}>
          + Добавить блюдо
        </Link>
      </div>
      <hr className={styles.divider} />
      <DashboardMealsList />
    </div>
  )
}
