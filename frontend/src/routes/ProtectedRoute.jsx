import { Navigate } from 'react-router-dom'
import { ADMIN_LOGIN_PATH } from '../config/adminRoutes'
import { isAuthenticated } from '../services/authService'

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace />
  }

  return children
}

export default ProtectedRoute