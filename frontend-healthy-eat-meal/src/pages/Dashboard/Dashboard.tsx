import DashboardMealsList from '@pages/Dashboard/components/DashboardMealList'
import { Link } from 'react-router-dom'
import styles from './Dashboard.module.scss'
import { useGetMealsQuery } from '@shared/api/meals'
import { useSelector } from 'react-redux'
import type { RootState } from '@store/index'
import DashboardDatePicker from './components/DashboardDatePicker'

export default function Dashboard() {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate)

  const { data: meals = [] } = useGetMealsQuery(selectedDate)

  const totalTodayCalories = meals.reduce((sum, meal) => sum + meal.total_calories, 0)

  const dailyGoal = 2000

  const progressPercentage = Math.min((totalTodayCalories / dailyGoal) * 100, 100)

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Дневник калорий</h1>
        <div className={styles.controls}>
          <DashboardDatePicker />
          <Link to="/add" className={styles.addBtn}>
            + Добавить блюдо
          </Link>
        </div>
      </div>
      <hr className={styles.divider} />

      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <span className={styles.summaryLabel}>Съедено за выбранный день</span>
          <div className={styles.summaryValue}>
            {totalTodayCalories} <span>/ {dailyGoal} ккал</span>
          </div>
        </div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <DashboardMealsList selectedDate={selectedDate} />
    </div>
  )
}
