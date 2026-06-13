import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@store/index'
import { setSelectedDate } from '@store/dateSlice'
import styles from './DashboardDatePicker.module.scss'

const TODAY_STRING = new Date().toISOString().split('T')[0]
const YESTERDAY_STRING = new Date(Date.now() - 86400000).toISOString().split('T')[0]

export default function DatePicker() {
  const dispatch = useDispatch()
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate)

  const changeDate = (daysOffset: number) => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + daysOffset)

    const dateString = currentDate.toISOString().split('T')[0]
    dispatch(setSelectedDate(dateString))
  }

  const formatDisplayDate = () => {
    if (selectedDate === TODAY_STRING) return 'Сегодня'
    if (selectedDate === YESTERDAY_STRING) return 'Вчера'

    return new Date(selectedDate).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className={styles.datePickerWrapper}>
      <button onClick={() => changeDate(-1)} className={styles.arrowBtn} title="День назад">
        ←
      </button>
      <span className={styles.dateLabel}>{formatDisplayDate()}</span>
      <button onClick={() => changeDate(1)} className={styles.arrowBtn} title="День вперед">
        →
      </button>
    </div>
  )
}
