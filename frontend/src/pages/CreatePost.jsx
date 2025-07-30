import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function CreatePost() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4">Create Post Page</Typography>
      <Typography>Here you can add a form to create new posts.</Typography>
    </Box>
  )
}