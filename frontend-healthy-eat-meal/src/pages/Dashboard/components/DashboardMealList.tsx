import { useState } from 'react'
import { useGetMealsQuery } from '@shared/api/meals'
import DashboardMealListItem from './DashboardMealListItem'
import DashboardMealListItemEdit from './DashboardMealListItemEdit'
import styles from './DashboardMealList.module.scss'
import type { Meal } from '@types'

type GroupedMeals = Record<string, { title: string; items: Meal[] }>

export default function DashboardMealList() {
  const { data: meals = [], isLoading, error } = useGetMealsQuery()

  const [editingId, setEditingId] = useState<number | null>(null)

  const groupedMeals: GroupedMeals = {
    breakfast: { title: '🍳 Завтрак', items: [] },
    lunch: { title: '🍲 Обед', items: [] },
    dinner: { title: '🐟 Ужин', items: [] },
    snack: { title: '🍏 Перекусы / Полдник', items: [] },
  }

  meals.forEach((meal) => {
    if (groupedMeals[meal.meal_type]) {
      groupedMeals[meal.meal_type].items.push(meal)
    }
  })

  const calculateSectionCalories = (items: Meal[]) => {
    return items.reduce((sum, item) => sum + item.total_calories, 0)
  }

  if (isLoading) return <div className={styles.emptyState}>Загрузка дневника калорий...</div>
  if (error)
    return (
      <div className={styles.emptyState} style={{ color: 'red' }}>
        Ошибка сервера.
      </div>
    )

  return (
    <div className={styles.container}>
      {meals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Вы еще ничего не съели за сегодня.</p>
        </div>
      ) : (
        Object.entries(groupedMeals).map(([typeKey, group]) => {
          if (group.items.length === 0) return null

          return (
            <div key={typeKey} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{group.title}</h2>
                <span className={styles.sectionCalories}>
                  {calculateSectionCalories(group.items)} ккал
                </span>
              </div>

              <ul className={styles.list}>
                {group.items.map((meal) => {
                  const isCurrentEditing = editingId === meal.id

                  return (
                    <li key={meal.id} className={styles.card}>
                      {isCurrentEditing ? (
                        <DashboardMealListItemEdit
                          meal={meal}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <DashboardMealListItem
                          meal={meal}
                          onStartEdit={() => setEditingId(meal.id)}
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })
      )}
    </div>
  )
}
