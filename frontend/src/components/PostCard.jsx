import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import { createReply } from '../api/replies'
import ReplyDialog from './ReplyDialog'

export default function PostCard({ post, hoverable = false }) {
  const { id, username, email, created_at, title, text } = post
  const formattedDate = new Date(created_at).toLocaleString()
  const sanitizedHtml = DOMPurify.sanitize(text)

  const cardSx = {
    width: '100%',
    my: 1,
    // only add hover/transform if hoverable
    ...(hoverable && {
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px) scale(1.03)',
        boxShadow: 6,
      },
    }),
  }

  const actionSx = {
    display: 'block',
    // show pointer only when hoverable
    cursor: hoverable ? 'pointer' : 'default',
    // disable any hover highlight when not hoverable
    ...(!hoverable && {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    }),
  }

  const [replyOpen, setReplyOpen] = useState(false)

  return (
    <>
    <Card
      sx={cardSx}
    >
      <CardActionArea component={RouterLink} to={`/posts/${id}`}
        sx={actionSx}
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
      {/* Reply button below the card */}
       <Box sx={{ p: 1, textAlign: 'right' }}>
         <Button size="small" onClick={() => setReplyOpen(true)}>
           Reply
         </Button>
       </Box>
    </Card>

    <ReplyDialog
       open={replyOpen}
       parentCard={<PostCard post={post} hoverable={false} />}
       onClose={() => setReplyOpen(false)}
      onSubmit={text =>
         createReply({ post: post.id, text })
       }
    />
  </>
  )
}