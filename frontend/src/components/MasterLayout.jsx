import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import NavBar from './NavBar'

export default function MasterLayout({ children }) {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <NavBar />
      <Box 
        component="main" 
        sx={{
            flexGrow: 1,
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
