import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DiaryPage from '@pages/DiaryPage/DiaryPage'
import AddMealPage from '@pages/AddMealPage/AddMealPage'

function App() {
  return (
    <Router>
      <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <Routes>
          {/* Главная страница — список калорий */}
          <Route path="/" element={<DiaryPage />} />

          {/* Страница формы добавления */}
          <Route path="/add" element={<AddMealPage />} />

          {/* Роут-заглушка на случай, если пользователь введет несуществующий URL */}
          <Route path="*" element={<div>Страница не найдена (404)</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
