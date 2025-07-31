import { createContext, useContext, useState, useEffect } from 'react'
import { logoutAPI, me } from '../api/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)

  const login = ({ access, refresh }) => {
    localStorage.setItem('token', access)
    localStorage.setItem('refresh', refresh)
    me()
      .then(data => setUser(data))
      .catch(() => {
        // if me() fails right after login, force logout
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        setUser(null)
      })
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

// On mount, if we have a token, verify it and fetch user details
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      return
    }
    
    me()
      .then(data => setUser(data))
      .catch(err => {
        console.warn('Token invalid or expired:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        setUser(null)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}