import { createContext, useContext, useState, useEffect } from 'react'
import { logoutAPI } from '../api/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    localStorage.getItem('token') ? { token: true } : null
  )

  const login = ({ access, refresh }) => {
    localStorage.setItem('token', access)
    localStorage.setItem('refresh', refresh)
    setUser({ token: true })
  }

  const logout = async () => {
    try {
      await logoutAPI()
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}