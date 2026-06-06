import { useGetMealsQuery } from '@shared/api/meals'
import styles from './DashboardMealList.module.scss'

export default function DashboardMealList() {
  const { data: meals = [], isLoading, error } = useGetMealsQuery()

  if (isLoading) return <div className={styles.emptyState}>Загрузка дневника калорий...</div>
  if (error)
    return (
      <div className={styles.emptyState} style={{ color: 'red' }}>
        Ошибка при получении данных с сервера.
      </div>
    )

  return (
    <div className={styles.container}>
      {meals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Вы еще ничего не съели за сегодня.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {meals.map((meal) => (
            <li key={meal.id} className={styles.card}>
              <div className={styles.info}>
                <h3 className={styles.foodName}>{meal.food_name}</h3>
                <div className={styles.meta}>
                  <span>
                    Время:{' '}
                    {new Date(meal.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {/* Теперь выводим и вес, раз у нас есть полноценные карточки */}
                  {/* <span className={styles.weight}>{meal.weight_g} г</span> */}
                </div>
              </div>
              <div className={styles.caloriesBadge}>{meal.total_calories} ккал</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
