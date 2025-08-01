import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useRequireAuth() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  return token
}