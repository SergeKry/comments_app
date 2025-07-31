import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MainTextInput from './MainTextInput'

export default function ReplyDialog({
  open,
  parentCard,      // React node to display (PostCard or ReplyCard)
  onClose,
  onSubmit,        // async function(text) => {...}
}) {
  const [text, setText]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState('')

  // reset when opening/closing
  useEffect(() => {
    if (!open) {
      setText('')
      setError('')
      setSubmitting(false)
    }
  }, [open])

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(text)
      onClose()
    } catch (err) {
      setError(err.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Reply</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          {/* Show the card you’re replying to */}
          {parentCard}
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        {/* Your reusable text input */}
        <MainTextInput value={text} onChange={setText} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
        >
          {submitting ? 'Sending…' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}