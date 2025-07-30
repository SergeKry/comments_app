import { Box } from '@mui/material'
import NavBar from './NavBar'

export default function MasterLayout({ children }) {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', height: '100vh', width: '100vw' }}>
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
