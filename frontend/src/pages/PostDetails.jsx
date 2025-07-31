import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { fetchPost } from "../api/posts";
import { fetchReplies } from "../api/replies";
import PostCard from "../components/PostCard";
import ReplyCard from "../components/ReplyCard";

const WS_URL = import.meta.env.VITE_WS_URL

// Helper function to insert replies in the correct place in the tree
function mergeReplies(tree, newReply) {
  // If it's a top-level reply, just prepend
  if (newReply.parent === null) {
    return [newReply, ...tree];
  }
  // Otherwise recurse
  return tree.map((node) => {
    // Found the parent: insert into its children
    if (node.id === newReply.parent) {
      return {
        ...node,
        children: [newReply, ...node.children],
      };
    }
    // Otherwise, dive into children
    return {
      ...node,
      children: mergeReplies(node.children, newReply),
    };
  });
}

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [repliesError, setRepliesError] = useState("");

  // Fetch post details
  useEffect(() => {
    let isMounted = true;
    async function loadPost() {
      setLoading(true);
      try {
        const data = await fetchPost(id);
        if (!isMounted) return;
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load post");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPost();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Fetch replies for the post
  useEffect(() => {
    let isMounted = true;
    async function loadReplies() {
      setRepliesLoading(true);
      try {
        const data = await fetchReplies({ post: id });
        if (!isMounted) return;
        setReplies(data);
      } catch (err) {
        console.error("Error fetching replies:", err);
        setRepliesError(err.message || "Failed to load replies");
      } finally {
        if (isMounted) setRepliesLoading(false);
      }
    }
    loadReplies();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // WebSocket to receive new replies
  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}/ws/posts/${id}/`)

    socket.onmessage = (e) => {
      const newReply = JSON.parse(e.data);
      setReplies(prev => mergeReplies(prev, newReply))
    };
    socket.onclose = () => console.log("WebSocket closed");

    return () => {
      socket.close();
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "90%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          mb: 2,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button component={RouterLink} to="/" variant="outlined">
          ← Back
        </Button>
      </Box>
      <PostCard post={post} />

      {/* Replies section */}
      <Box sx={{ width: "95%", mt: 1 }}>
        {repliesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : repliesError ? (
          <Typography color="error" sx={{ mt: 1 }}>
            {repliesError}
          </Typography>
        ) : (
          // render each top-level reply
          replies.map((reply) => (
            <ReplyCard key={reply.id} reply={reply} />
          ))
        )}
      </Box>
    </Box>
  );
}
