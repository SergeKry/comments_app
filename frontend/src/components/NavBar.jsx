import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function NavBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box component="nav" sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Comments App
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ ml: 2 }}
          >
            Home
          </Button>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Auth action */}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
            >
              Log In
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}