import MealsList from '@pages/DiaryPage/MealsList'
import { Link } from 'react-router-dom'

export default function DiaryPage() {
  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Дневник калорий</h1>
        {/* Кнопка перехода на страницу добавления */}
        <Link
          to="/add"
          style={{
            padding: '10px 15px',
            background: '#007bff',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          + Добавить блюдо
        </Link>
      </div>
      <hr />
      <MealsList />
    </div>
  )
}
