import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import Dashboard from './pages/dashboard/dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { ThemeProvider } from './components/theme-provider'
import Candidates from './pages/candidates/Candidates'
import TemplatesPage from './pages/Templates/Templates'
import Offers from './pages/Offers/offers'
import NewOffer from './pages/Offers/NewOffer'
import OfferDetail from './pages/Offers/offerDetail'
import OfferHistory from './pages/Offers/offerHistory'
import OfferStatus from './pages/Offers/offerStatus'
import SettingsPage from './pages/settings/Settings'
import SearchPage from './pages/search/Search'
import HelpPage from './pages/help/Help'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute><TemplatesPage /></ProtectedRoute>
        } />
        <Route path="/candidates" element={
          <ProtectedRoute><Candidates /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute><SearchPage /></ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute><HelpPage /></ProtectedRoute>
        } />

        {/* Offers — specific routes MUST come before /:id */}
        <Route path="/offers" element={
          <ProtectedRoute><Offers /></ProtectedRoute>
        } />
        <Route path="/offers/new" element={
          <ProtectedRoute><NewOffer /></ProtectedRoute>
        } />

        {/* ✅ Redirect bad sidebar link /offers/history → /offers */}
        <Route path="/offers/history" element={
          <Navigate to="/offers" replace />
        } />

        <Route path="/offers/:id/history" element={
          <ProtectedRoute><OfferHistory /></ProtectedRoute>
        } />
        <Route path="/offers/:id/status" element={
          <ProtectedRoute><OfferStatus /></ProtectedRoute>
        } />

        {/* /:id MUST be last */}
        <Route path="/offers/:id" element={
          <ProtectedRoute><OfferDetail /></ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App