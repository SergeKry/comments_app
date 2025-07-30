import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { fetchPost } from '../api/posts'
import PostCard from '../components/PostCard'

export default function PostDetails() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    async function loadPost() {
      setLoading(true)
      try {
        const data = await fetchPost(id)
        if (!isMounted) return
        setPost(data)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err.message || 'Failed to load post')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadPost()
    return () => { isMounted = false }
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    )
  }

  if (!post) {
    return null
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', height: '100%' }}>
      <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
        >
          ← Back
        </Button>
      </Box>
      <PostCard post={post} />
    </Box>
  )
}
