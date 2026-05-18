import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import Dashboard from './pages/dashboard/dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { ThemeProvider } from './components/theme-provider'
import Candidates from './pages/candidates/Candidates'
import TemplatesPage from './pages/Templates/Templates'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <TemplatesPage />
          </ProtectedRoute>
        } />
        <Route path="/candidates" element={
              <ProtectedRoute>
             <Candidates />
            </ProtectedRoute>
          } />
        <Route path="/offers" element={
          <ProtectedRoute>
            <div>Offers Page Coming Soon</div>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App