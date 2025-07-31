import { useRef } from 'react'
import { Box, Button, Stack, TextField } from '@mui/material'

export default function MainTextInput({ value, onChange }) {
  const textareaRef = useRef(null)

  // helper to wrap selected text with HTML tag or custom template
  const wrapSelection = (before, after = '') => {
    const textarea = textareaRef.current
    const { selectionStart: start, selectionEnd: end } = textarea
    const selected = value.slice(start, end)
    const newText =
      value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(newText)
    // restore cursor after inserted text
    const cursorPos = end + before.length + after.length
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(cursorPos, cursorPos)
    }, 0)
  }

  const handleLink = () => {
    const url = window.prompt('Enter URL:', 'https://')
    if (!url) return
    const title = window.prompt('Enter link title (optional):', '')
    const before = `<a href=\"${url}\"${title ? ` title=\"${title}\"` : ''}>`
    wrapSelection(before, '</a>')
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} mb={1}>
        <Button variant="outlined" size="small" onClick={handleLink}>
          Link
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => wrapSelection('<code>', '</code>')}
        >
          Code
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => wrapSelection('<i>', '</i>')}
        >
          Italic
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => wrapSelection('<strong>', '</strong>')}
        >
          Bold
        </Button>
      </Stack>
      <TextField
        inputRef={textareaRef}
        multiline
        minRows={6}
        fullWidth
        variant="outlined"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter your text..."
      />
    </Box>
  )
}