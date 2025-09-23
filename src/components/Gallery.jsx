import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../Context";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import GetAppIcon from "@mui/icons-material/GetApp";
import ImageModal from "./ImageModal";

const Gallery = () => {
  const { search, filters } = useGlobalContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const handleDownload = async (url, id) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `unsplash-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: search,
        per_page: 12,
      });

      if (filters.orientation) params.append("orientation", filters.orientation);
      if (filters.color) params.append("color", filters.color);

      const res = await axios.get(
        `https://api.unsplash.com/search/photos?client_id=${
          import.meta.env.VITE_PHOTO_KEY
        }&${params.toString()}`
      );

      setData(res.data.results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (search) fetchImages();
  }, [search, filters]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(9)).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : data.length > 0 ? (
        <Grid container spacing={3}>
          {data.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img.id}>
              <Card
                sx={{
                  position: "relative",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                  overflow: "hidden",
                }}
              >
                {/* Download icon */}
                <IconButton
                  onClick={() => handleDownload(img.urls.full, img.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                    zIndex: 2,
                  }}
                  size="small"
                >
                  <GetAppIcon />
                </IconButton>

                {/* Click image opens modal */}
                <CardMedia
                  component="img"
                  image={img.urls.small}
                  alt={img.alt_description || "Unsplash Image"}
                  sx={{
                    height: 300,
                    width: "100%",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenModal(img)}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          No images found. Try searching something else!
        </Typography>
      )}

      {/* Image preview modal */}
      <ImageModal open={openModal} handleClose={handleCloseModal} image={selectedImage} />
    </Box>
  );
};

export default Gallery;
