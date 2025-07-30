import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'
import { fetchPosts } from '../api/posts'
import PostCard from '../components/PostCard'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)

  const pageSize = 25

  useEffect(() => {
    let isMounted = true
    async function loadPosts() {
      setLoading(true)
      try {
        const data = await fetchPosts({ page, page_size: pageSize })
        if (!isMounted) return
        setPosts(data.results)
        setNext(data.next)
        setPrevious(data.previous)
      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadPosts()
    return () => {
      isMounted = false
    }
  }, [page])

   return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Create Post button for logged-in users */}
      {user && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/create-post"
          >
            + Create Post
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <Typography align="center" sx={{ mt: 4 }}>
          No posts found.
        </Typography>
      )}

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!previous}
        >
          Previous
        </Button>
        <Typography variant="body1">Page {page}</Typography>
        <Button
          variant="contained"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!next}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}
