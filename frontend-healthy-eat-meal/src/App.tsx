import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DiaryPage from '@pages/DiaryPage/DiaryPage'
import AddMealPage from '@pages/AddMealPage/AddMealPage'
import Layout from '@components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Главная страница — список калорий */}
          <Route path="/" element={<DiaryPage />} />

          {/* Страница формы добавления */}
          <Route path="/add" element={<AddMealPage />} />

          {/* Роут-заглушка на случай, если пользователь введет несуществующий URL */}
          <Route
            path="*"
            element={
              <div style={{ padding: '20px', textAlign: 'center' }}>Страница не найдена (404)</div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
