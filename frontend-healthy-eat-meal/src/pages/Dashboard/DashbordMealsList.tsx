import { useState } from 'react'
import { useGetMealsQuery, useDeleteMealMutation, useUpdateMealMutation } from '@shared/api/meals'
import styles from './DashboardMealList.module.scss'
import type { Meal } from '@types'

// Структура для нашего сгруппированного объекта
type GroupedMeals = Record<string, { title: string; items: Meal[] }>

export default function DashboardMealList() {
  const { data: meals = [], isLoading, error } = useGetMealsQuery()
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation()
  const [updateMeal, { isLoading: isUpdating }] = useUpdateMealMutation()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editCalories, setEditCalories] = useState('')
  const [editWeight, setEditWeight] = useState('')
  const [editType, setEditType] = useState('')

  // Создаем заготовку под все 4 группы, чтобы они выводились на экране в красивом порядке
  const groupedMeals: GroupedMeals = {
    breakfast: { title: '🍳 Завтрак', items: [] },
    lunch: { title: '🍲 Обед', items: [] },
    dinner: { title: '🐟 Ужин', items: [] },
    snack: { title: '🍏 Перекусы / Полдник', items: [] },
  }

  // Раскладываем пришедшие с бэкенда блюда по своим корзинам
  meals.forEach((meal) => {
    if (groupedMeals[meal.meal_type]) {
      groupedMeals[meal.meal_type].items.push(meal)
    }
  })

  // Функция расчета суммы калорий для конкретной группы
  const calculateSectionCalories = (items: Meal[]) => {
    return items.reduce((sum, item) => sum + item.total_calories, 0)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await deleteMeal(id).unwrap()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const startEdit = (meal: Meal) => {
    setEditingId(meal.id)
    setEditName(meal.food_name)
    setEditCalories(String(meal.calories_per_100g))
    setEditWeight(String(meal.weight_g))
    setEditType(meal.meal_type)
  }

  const handleSave = async (id: number) => {
    if (!editName || !editCalories || !editWeight) return
    try {
      await updateMeal({
        id,
        body: {
          food_name: editName,
          calories_per_100g: Number(editCalories),
          weight_g: Number(editWeight),
          meal_type: editType,
        },
      }).unwrap()
      setEditingId(null)
    } catch (err) {
      console.error(err)
    }
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
        // Рендерим группы по очереди
        Object.entries(groupedMeals).map(([typeKey, group]) => {
          // Если в категории ничего нет, можем либо скрыть её, либо показать пустой блок.
          // Скроем для чистоты интерфейса, если там пусто.
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
                        <div className={styles.inlineForm}>
                          <input
                            type="text"
                            className={`${styles.inlineInput} ${styles.name}`}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                          <input
                            type="number"
                            className={`${styles.inlineInput} ${styles.number}`}
                            value={editCalories}
                            onChange={(e) => setEditCalories(e.target.value)}
                          />
                          <input
                            type="number"
                            className={`${styles.inlineInput} ${styles.number}`}
                            value={editWeight}
                            onChange={(e) => setEditWeight(e.target.value)}
                          />
                          <div className={styles.actions}>
                            <button
                              onClick={() => handleSave(meal.id)}
                              className={`${styles.btnAction} ${styles.save}`}
                              disabled={isUpdating}
                            >
                              💾
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className={`${styles.btnAction} ${styles.delete}`}
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={styles.info}>
                            <h3 className={styles.foodName}>{meal.food_name}</h3>
                            <div className={styles.meta}>
                              <span>
                                {new Date(meal.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className={styles.weight}>{meal.weight_g} г</span>
                            </div>
                          </div>
                          <div className={styles.cardRight}>
                            <div className={styles.caloriesBadge}>{meal.total_calories} ккал</div>
                            <div className={styles.actions}>
                              <button
                                onClick={() => startEdit(meal)}
                                className={`${styles.btnAction} ${styles.edit}`}
                                disabled={isDeleting || isUpdating}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(meal.id)}
                                className={`${styles.btnAction} ${styles.delete}`}
                                disabled={isDeleting || isUpdating}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </>
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
