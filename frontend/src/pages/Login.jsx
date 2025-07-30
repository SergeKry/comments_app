import { useState } from 'react'
import { TextField, Button, Container, Typography, Box } from '@mui/material'
import { login } from '../api/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { access, refresh } = await login(form)
      localStorage.setItem('token', access)
      localStorage.setItem('refresh', refresh)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box 
    sx={{
        maxWidth: 400,
        height: 'auto',
        mx: 'auto',
        p: 4,
        boxShadow: 3,
        bgcolor: 'background.paper',
        }}
    >
        <Typography variant="h5" align="center" gutterBottom>
            Sign In
        </Typography>

    {error && <Typography color="error">{error}</Typography>}

    <form onSubmit={handleSubmit}>
        <TextField
        name="username"
        label="Username"
        fullWidth
        margin="normal"
        value={form.username}
        onChange={handleChange}
        required
        />
        <TextField
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={handleChange}
        required
        />
        <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        >
        Log In
        </Button>
    </form>

    <Box mt={2} textAlign="center">
        <Link to="/register">Create an account</Link>
    </Box>
    </Box>
  )
}