import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { createPost } from '../api/posts'
import MainTextInput from '../components/MainTextInput'

export default function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createPost({ title, text })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 'none', width: '80vw', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create Post
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Title"
        fullWidth
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <MainTextInput value={text} onChange={setText} />
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  )
}
