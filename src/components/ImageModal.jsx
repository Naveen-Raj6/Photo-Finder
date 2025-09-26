import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

const ImageModal = ({ open, handleClose, image }) => {
  if (!image) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(image.urls.full);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `unsplash-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(image.urls.full)
      .catch((err) => console.error("Failed to copy URL", err));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        {/* Image side */}
        <Box sx={{ flex: 2 }}>
          <img
            src={image.urls.regular}
            alt={image.alt_description || "Unsplash Image"}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>

        {/* Info side */}
        <Box sx={{ flex: 1, mt: { xs: 2, md: 0 } }}>
          <Typography variant="h6">Photographer:</Typography>
          <Typography variant="subtitle1">{image.user.name}</Typography>

          <Typography variant="body2" gutterBottom>
            Username: {image.user.username}
          </Typography>

          {image.alt_description && (
            <Typography variant="body1" gutterBottom>
              Description: {image.alt_description}
            </Typography>
          )}

          <Typography variant="body2" gutterBottom>
            Likes: {image.likes}
          </Typography>

          {/* Tags */}
          {image.tags && image.tags.length > 0 ? (
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {image.tags.map((tag) => (
                <Chip key={tag.title} label={tag.title} size="small" />
              ))}
            </Box>
          ) : (
            <Typography variant="caption">No tags available</Typography>
          )}

          {/* Action buttons */}
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Download Image
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCopyURL}>
              Copy Image URL
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
