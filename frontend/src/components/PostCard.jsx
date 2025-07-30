import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'

export default function PostCard({ post }) {
  const { id, username, email, created_at, title, text } = post
  const formattedDate = new Date(created_at).toLocaleString()
  const sanitizedHtml = DOMPurify.sanitize(text)

  return (
    <Card
      sx={{
        width: '80vw',
        my: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/posts/${id}`}
        sx={{ display: 'block' }}
      >
        <CardHeader
          title={title}
          subheader={`By ${username} • ${email} • ${formattedDate}`}
          sx={{ bgcolor: '#CBC3E3' }}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}