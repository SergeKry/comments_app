import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";
import { createReply } from "../api/replies";
import ReplyDialog from "./ReplyDialog";
import { useAuth } from "../contexts/AuthContext";
import AttachmentsView from "./AttachmentsView";

export default function PostCard({
  post,
  hoverable = false,
  showOpen = false,   // homepage
  showReply = false,  // details page
}) {
  const { user } = useAuth();
  const { id, username, email, created_at, title, text, attachments } = post;
  const formattedDate = new Date(created_at).toLocaleString();
  const sanitizedHtml = DOMPurify.sanitize(text);
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <>
      <Card
        sx={{
          width: "100%",
          my: 1,
          ...(hoverable && {
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": { transform: "translateY(-4px) scale(1.03)", boxShadow: 6 },
          }),
        }}
      >
        <CardHeader
          title={title}
          subheader={`By ${username} • ${email} • ${formattedDate}`}
          sx={{ bgcolor: "#CBC3E3" }}
        />

        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            gutterBottom
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
          {attachments?.length > 0 && (
            <AttachmentsView attachments={attachments} id={id} title={title} />
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", gap: 1, px: 2 }}>
          {showOpen && (
            <Button
              component={RouterLink}
              to={`/posts/${id}`}
              size="small"
              variant="outlined"
            >
              Open
            </Button>
          )}

          {showReply && user && (
            <Button size="small" onClick={() => setReplyOpen(true)}>
              Reply
            </Button>
          )}
        </CardActions>
      </Card>

      {showReply && user && (
        <ReplyDialog
          open={replyOpen}
          onClose={() => setReplyOpen(false)}
          onSubmit={(text, files) =>
            createReply({ post: post.id, text, attachments: files })
          }
          parentCard={<PostCard post={post} hoverable={false} />}
        />
      )}
    </>
  );
}