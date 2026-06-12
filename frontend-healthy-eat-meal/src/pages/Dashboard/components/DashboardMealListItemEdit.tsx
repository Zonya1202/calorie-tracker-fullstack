import { useState } from 'react'
import { useUpdateMealMutation } from '@shared/api/meals'
import Input from '@components/Input/Input'
import styles from './DashboardMealListItemEdit.module.scss'
import type { Meal } from '@types'

interface DashboardMealListItemEditProps {
  meal: Meal
  onCancel: () => void
}

export default function DashboardMealListItemEdit({
  meal,
  onCancel,
}: DashboardMealListItemEditProps) {
  const [updateMeal, { isLoading: isUpdating }] = useUpdateMealMutation()

  const [editName, setEditName] = useState(meal.food_name)
  const [editCalories, setEditCalories] = useState(String(meal.calories_per_100g))
  const [editWeight, setEditWeight] = useState(String(meal.weight_g))

  const handleSave = async () => {
    if (!editName.trim() || !editCalories || !editWeight) return

    if (Number(editCalories) <= 0 || Number(editWeight) <= 0) {
      alert('Значения калорий и веса должны быть больше нуля!')
      return
    }

    try {
      await updateMeal({
        id: meal.id,
        body: {
          food_name: editName.trim(),
          calories_per_100g: Number(editCalories),
          weight_g: Number(editWeight),
          meal_type: meal.meal_type,
        },
      }).unwrap()
      onCancel()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.inlineForm}>
      <div className={styles.inputsGrid}>
        <Input
          id={`edit-name-${meal.id}`}
          label="Продукт"
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          disabled={isUpdating}
        />
        <Input
          id={`edit-cals-${meal.id}`}
          label="ккал/100г"
          type="number"
          value={editCalories}
          onChange={(e) => setEditCalories(e.target.value)}
          disabled={isUpdating}
        />
        <Input
          id={`edit-weight-${meal.id}`}
          label="Вес (г)"
          type="number"
          value={editWeight}
          onChange={(e) => setEditWeight(e.target.value)}
          disabled={isUpdating}
        />
      </div>

      <div className={styles.formActions}>
        <button
          onClick={handleSave}
          className={`${styles.btnAction} ${styles.save}`}
          disabled={isUpdating}
        >
          Сохр
        </button>
        <button onClick={onCancel} className={styles.btnAction} disabled={isUpdating}>
          Отмена
        </button>
      </div>
    </div>
  )
}
