import { useState } from 'react'
import { useGetMealsQuery, useDeleteMealMutation, useUpdateMealMutation } from '@shared/api/meals'
import styles from './DashboardMealList.module.scss'
import type { Meal } from '@types'

export default function DashboardMealList() {
  const { data: meals = [], isLoading, error } = useGetMealsQuery()
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation()
  const [updateMeal, { isLoading: isUpdating }] = useUpdateMealMutation()

  // Стейты для инлайн-редактирования
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editCalories, setEditCalories] = useState('')
  const [editWeight, setEditWeight] = useState('')
  const [editType, setEditType] = useState('')

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await deleteMeal(id).unwrap()
      } catch (err) {
        console.error('Ошибка удаления:', err)
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
      setEditingId(null) // Закрываем режим редактирования
    } catch (err) {
      console.error('Ошибка обновления:', err)
    }
  }

  // Перевод системных названий для вывода в мета-данных
  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: 'Завтрак',
      lunch: 'Обед',
      dinner: 'Ужин',
      snack: 'Перекус',
    }
    return labels[type] || type
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
        <ul className={styles.list}>
          {meals.map((meal) => {
            const isCurrentEditing = editingId === meal.id

            return (
              <li key={meal.id} className={styles.card}>
                {isCurrentEditing ? (
                  // --- РЕЖИМ РЕДАКТИРОВАНИЯ (ИНПУТЫ) ---
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
                      placeholder="ккал/100г"
                      value={editCalories}
                      onChange={(e) => setEditCalories(e.target.value)}
                    />
                    <input
                      type="number"
                      className={`${styles.inlineInput} ${styles.number}`}
                      placeholder="грамм"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                    />
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleSave(meal.id)}
                        className={`${styles.btnAction} ${styles.save}`}
                        disabled={isUpdating}
                        title="Сохранить"
                      >
                        💾
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className={`${styles.btnAction} ${styles.delete}`}
                        title="Отмена"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- ОБЫЧНЫЙ РЕЖИМ (ПРОСМОТР) ---
                  <>
                    <div className={styles.info}>
                      <h3 className={styles.foodName}>{meal.food_name}</h3>
                      <div className={styles.meta}>
                        <span>{getMealTypeLabel(meal.meal_type)}</span>
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
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className={`${styles.btnAction} ${styles.delete}`}
                          disabled={isDeleting || isUpdating}
                          title="Удалить"
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
      )}
    </div>
  )
}
