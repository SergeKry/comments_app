import Box from "@mui/material/Box";

export default function AttachmentsView({ attachments, id, title }) {
  return (
    <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
      {attachments.map((att, i) => {
        const url = att.file;
        const ext = url.split("?")[0].split(".").pop().toLowerCase();
        // only apply Lightbox on images
        if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
          return (
            <a
              key={att.id}
              href={url}
              data-lightbox={`post-${id}`}
              data-title={title}
              style={{ display: "inline-block" }}
            >
              <Box
                component="img"
                src={url}
                alt={title}
                sx={{
                  maxWidth: 100,
                  maxHeight: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </a>
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
            {url.split("/").pop().split("?")[0]}
          </a>
        );
      })}
    </Box>
  );
}
