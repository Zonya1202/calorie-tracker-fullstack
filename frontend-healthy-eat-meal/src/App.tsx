import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from '@pages/Dashboard/Dashboard'
import AddMeal from '@pages/AddMeal/AddMeal'
import Layout from '@components/Layout/Layout'
import Register from '@pages/Register/Register'
import LogIn from '@pages/LogIn/LogIn'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              // затычка
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h1>Добро пожаловать в Калории2026!</h1>
                <p>Это крутой fullstack трекер еды.</p>
                <Link
                  to={isAuthenticated ? '/dashboard' : '/login'}
                  style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#28a745',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '5px',
                  }}
                >
                  Перейти в личный кабинет (Dashboard)
                </Link>
              </div>
            }
          />
          {/* Главная страница — список калорий */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Страница формы добавления */}
          <Route path="/add" element={<AddMeal />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />

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
