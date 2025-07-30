import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline     from '@mui/material/CssBaseline'
import { AuthProvider } from './contexts/AuthContext.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',    // light grey
      paper:   '#ffffff',    // white for cards/panels
    },
  },
  typography: {
    body2: {
      fontSize: '1.1rem',  
    },
  },
  components: {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        },
        title: {
          fontSize: '1rem',
        },
        subheader: {
          fontSize: '0.8rem',
          opacity: 0.8, 
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)