import { Box } from '@mui/material'
import NavBar from './NavBar'

export default function MasterLayout({ children }) {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', minHeight:"100vh", width: '100vw' }}>
      <NavBar />
      <Box 
        component="main" 
        sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
