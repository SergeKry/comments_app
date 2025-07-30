import { useState } from 'react'
import Box from "@mui/material/Box";
import Button from '@mui/material/Button'
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";
import { createReply } from "../api/replies";
import ReplyDialog from './ReplyDialog'

export default function ReplyCard({ reply, level = 0 }) {
  const { id, username, email, created_at, text, children } = reply;
  const formattedDate = new Date(created_at).toLocaleString();
  const sanitizedHtml = DOMPurify.sanitize(text);

  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <>
      <Box sx={{ ml: level * 4, my: 1 }}>
        <Card variant="outlined">
          <CardHeader
            title={`${username} (${email})`}
            subheader={formattedDate}
            sx={{ bgcolor: "#f1eff8ff", py: 0.5 }}
          />
          <CardContent sx={{ py: 1 }}>
            <Typography
              variant="body2"
              component="div"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </CardContent>
           <Box sx={{ ml: level * 4 + 2, my: 0.5, textAlign: "right" }}>
          <Button size="small" onClick={() => setReplyOpen(true)}>
            Reply
          </Button>
        </Box>
        </Card>

        {/* Recursively render children, increasing the indent */}
        {children?.map((child) => (
          <ReplyCard key={child.id} reply={child} level={level + 1} />
        ))}
      </Box>
      {/* Reply modal, nesting under this reply */}
      <ReplyDialog
        open={replyOpen}
        parentCard={<ReplyCard reply={reply} level={level} />}
        onClose={() => setReplyOpen(false)}
        onSubmit={(text) =>
          createReply({ post: reply.post, parent: reply.id, text })
        }
      />
    </>
  );
}
