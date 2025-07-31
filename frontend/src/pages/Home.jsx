import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useAuth } from "../contexts/AuthContext";
import { fetchPosts } from "../api/posts";
import { fetchAuthors } from "../api/auth";
import PostCard from "../components/PostCard";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const pageSize = 25;

  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [sortOrder, setSortOrder] = useState("-created_at");

  useEffect(() => {
    let active = true;
    setAuthorsLoading(true);
    fetchAuthors()
      .then((data) => {
        if (active) setAuthors(data);
      })
      .catch((err) => console.error("Error fetching authors:", err))
      .finally(() => active && setAuthorsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    // build filter options
    const opts = {
      page,
      page_size: pageSize,
      ordering: sortOrder,
      ...(selectedAuthor && { username: selectedAuthor.username }),
      ...(selectedEmail && { email: selectedEmail.email }),
    };

    fetchPosts(opts)
      .then((data) => {
        if (!active) return;
        setPosts(data.results);
        setNext(data.next);
        setPrevious(data.previous);
      })
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [page, selectedAuthor, selectedEmail, sortOrder]);

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
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          alignSelf: "flex-start",
        }}
      >
        New topics
      </Typography>

      {/* Filter row + Create button */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Autocomplete
            sx={{ width: 200 }}
            options={authors}
            getOptionLabel={(opt) => opt.username}
            value={selectedAuthor}
            onChange={(e, v) => {
              setPage(1);
              setSelectedAuthor(v);
            }}
            loading={authorsLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by author"
                size="small"
                variant="outlined"
              />
            )}
          />

          <Autocomplete
            sx={{ width: 200 }}
            options={authors}
            getOptionLabel={(opt) => opt.email}
            value={selectedEmail}
            onChange={(e, v) => {
              setPage(1);
              setSelectedEmail(v);
            }}
            loading={authorsLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by email"
                size="small"
                variant="outlined"
              />
            )}
          />

          {/* Sort dropdown */}
          <FormControl size="small" sx={{ width: 180 }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              value={sortOrder}
              label="Sort"
              onChange={(e) => {
                setPage(1);
                setSortOrder(e.target.value);
              }}
            >
              <MenuItem value="-created_at">New to old</MenuItem>
              <MenuItem value="created_at">Old to new</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Create Post button for logged-in users */}
        {user && (
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/create-post"
          >
            + Create Post
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} hoverable />)
      ) : (
        <Typography align="center" sx={{ mt: 4 }}>
          No posts found.
        </Typography>
      )}

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          gap: 2,
        }}
      >
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
  );
}
