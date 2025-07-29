import { useRequireAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import {Box} from '@mui/material'

export default function Home() {
  const token = useRequireAuth()
  const [me, setMe] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/auth/me/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setMe)
  }, [token])

  if (!me) return <div>Loading…</div>
  return (
    <Box>
      <h1>Welcome, {me.username}!</h1>
      <p>Email: {me.email}</p>
      <p>Homepage: <a href={me.homepage}>{me.homepage}</a></p>
    </Box>
  )
}