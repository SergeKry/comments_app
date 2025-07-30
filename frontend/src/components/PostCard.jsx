import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'

export default function PostCard({ post }) {
  const { username, email, created_at, title, text } = post
  // Format timestamp nicely
  const formattedDate = new Date(created_at).toLocaleString()

  // Sanitize HTML content before rendering
  const sanitizedHtml = DOMPurify.sanitize(text)
  

  return (
    <Card sx={{ width: '80vw', my: 2 }}>
      <CardHeader
        title={username}
        subheader={`${email} • ${formattedDate}`}
        sx={{
          bgcolor: '#CBC3E3',
        }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </CardContent>
    </Card>
  )
}