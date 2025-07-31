import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";
import { createReply } from "../api/replies";
import ReplyDialog from "./ReplyDialog";
import { useAuth } from "../contexts/AuthContext";

export default function PostCard({ post, hoverable = false, preview = false }) {
  const { user } = useAuth();

  const { id, username, email, created_at, title, text } = post;
  const formattedDate = new Date(created_at).toLocaleString();
  const sanitizedHtml = DOMPurify.sanitize(text);

  const cardSx = {
    width: "100%",
    my: 1,
    // only add hover/transform if hoverable
    ...(hoverable && {
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px) scale(1.03)",
        boxShadow: 6,
      },
    }),
  };

  const actionSx = {
    display: "block",
    // show pointer only when hoverable
    cursor: hoverable ? "pointer" : "default",
    // disable any hover highlight when not hoverable
    ...(!hoverable && {
      "&:hover": {
        backgroundColor: "transparent",
      },
    }),
  };

  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <>
      <Card sx={cardSx}>
        <CardActionArea
          component={RouterLink}
          to={`/posts/${id}`}
          sx={actionSx}
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
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
            {/* —————— attachments —————— */}
            {post.attachments?.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {post.attachments.map((att, i) => {
                  const url = att.file;
                  const ext = url.split("?")[0].split(".").pop().toLowerCase();
                  // if it's an image, render <img>
                  if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                    return (
                      <Box
                        key={att.id}
                        component="img"
                        src={url}
                        alt={`attachment-${att.id}`}
                        sx={{
                          maxWidth: 150,
                          maxHeight: 120,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    );
                  }
                  // render text files as download links
                  return (
                    <a
                      key={att.id}
                      href={url}
                      download
                      style={{ marginRight: 8, color: "primary.main" }}
                    >
                      {url.split('/').pop().split('?')[0]}
                    </a>
                  );
                })}
              </Box>
            )}
          </CardContent>
        </CardActionArea>
        {/* Reply button below the card */}
        {!preview && user && (
          <Box sx={{ p: 1, textAlign: "right" }}>
            <Button size="small" onClick={() => setReplyOpen(true)}>
              Reply
            </Button>
          </Box>
        )}
      </Card>

      {user && (
        <ReplyDialog
          open={replyOpen}
          onClose={() => setReplyOpen(false)}
          onSubmit={(text) => createReply({ post: post.id, text })}
          parentCard={<PostCard post={post} hoverable={false} preview />}
        />
      )}
    </>
  );
}
