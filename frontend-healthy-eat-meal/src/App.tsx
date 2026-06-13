import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from '@pages/Dashboard/Dashboard'
import AddMeal from '@pages/AddMeal/AddMeal'
import Layout from '@components/Layout/Layout'
import Register from '@pages/Register/Register'
import LogIn from '@pages/LogIn/LogIn'
import ProtectedRoute from '@components/ProtectedRoute/ProtectedRoute'
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
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h1>Welcome to Calorie Tracker 2026!</h1>
                <p>A powerful fullstack app to track your daily calories.</p>
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
                  Go to Dashboard
                </Link>
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddMeal />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route
            path="*"
            element={
              <div style={{ padding: '20px', textAlign: 'center' }}>Page not found (404)</div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
