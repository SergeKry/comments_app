import { createContext, useContext, useState, useEffect } from 'react'

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

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    setUser(null)
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