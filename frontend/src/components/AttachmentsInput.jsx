import { useRef, useState } from 'react'
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CloseIcon from '@mui/icons-material/Close'

const ALLOWED_EXT = ['jpg','jpeg','gif','png','txt']
const MAX_FILES = 3

export default function AttachmentsInput({ files, setFiles }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')

  const handleAddClick = () => {
    setError('')
    inputRef.current.click()
  }

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files)
    // filter by extension
    const valid = selected.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase()
      return ALLOWED_EXT.includes(ext)
    })
    if (valid.length !== selected.length) {
      setError('Some files were skipped: unsupported format.')
    }
    if (files.length + valid.length > MAX_FILES) {
      setError(`You can only attach up to ${MAX_FILES} files.`)
      // only take as many as will fit
      valid.splice(MAX_FILES - files.length)
    }
    setFiles([...files, ...valid])
    e.target.value = ''         // reset input so same file can be re‐selected if removed
  }

  const handleRemove = (idx) => {
    const copy = [...files]
    copy.splice(idx, 1)
    setFiles(copy)
    setError('')
  }

  return (
    <Box sx={{ my: 2 }}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.txt"
        style={{ display: 'none' }}
        onChange={handleFiles}
      />
      <Button
        variant="outlined"
        startIcon={<UploadFileIcon />}
        onClick={handleAddClick}
      >
        Add Attachment
      </Button>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <List dense sx={{ mt: 1 }}>
        {files.map((file, i) => (
          <ListItem
            key={`${file.name}-${i}`}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemove(i)}>
                <CloseIcon />
              </IconButton>
            }
          >
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}