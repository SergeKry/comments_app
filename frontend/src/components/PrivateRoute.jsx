import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Redirect to login, but save current location so you can come back
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}