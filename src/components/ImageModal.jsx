import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ImageModal = ({ open, handleClose, image }) => {
  if (!image) return null;

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
        <Box sx={{ flex: 2, position: "relative" }}>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8, color: "#fff", zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
