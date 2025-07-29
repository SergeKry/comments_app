import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'

export default function MasterLayout({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem('token'))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <AppBar position="static">
        <Toolbar>Logo</Toolbar>
      </AppBar>
      <Container sx={{ flexGrow: 1 }}>{children}</Container>
    </Box>
  )
}
