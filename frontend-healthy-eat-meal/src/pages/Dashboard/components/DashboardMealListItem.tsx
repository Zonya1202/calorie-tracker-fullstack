import { useDeleteMealMutation } from '@shared/api/meals'
import styles from './DashboardMealListItem.module.scss'
import type { Meal } from '@types'

interface DashboardMealListItemProps {
  meal: Meal
  onStartEdit: () => void
}

export default function DashboardMealListItem({ meal, onStartEdit }: DashboardMealListItemProps) {
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation()

  const handleDelete = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить "${meal.food_name}"?`)) {
      try {
        const mealDate = meal.created_at.split('T')[0]
        await deleteMeal({ id: meal.id, date: mealDate }).unwrap()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const formattedTime = new Date(meal.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <div className={styles.info}>
        <h3 className={styles.foodName}>{meal.food_name}</h3>
        <div className={styles.meta}>
          <span className={styles.time}>{formattedTime}</span>
          <span className={styles.divider}>•</span>
          <span className={styles.weight}>{meal.weight_g} г</span>
        </div>
      </div>

      <div className={styles.cardRight}>
        <div className={styles.caloriesBadge}>{meal.total_calories} ккал</div>
        <div className={styles.actions}>
          <button
            onClick={onStartEdit}
            className={`${styles.btnAction} ${styles.edit}`}
            disabled={isDeleting}
          >
            Ред
          </button>
          <button
            onClick={handleDelete}
            className={`${styles.btnAction} ${styles.delete}`}
            disabled={isDeleting}
          >
            Удал
          </button>
        </div>
      </div>
    </>
  )
}
