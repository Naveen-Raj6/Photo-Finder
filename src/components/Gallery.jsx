import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../Context";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const Gallery = () => {
  const { search } = useGlobalContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?client_id=${
          import.meta.env.VITE_PHOTO_KEY
        }&query=${search}&per_page=6`
      );
      setData(res.data.results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (search) fetchImages();
  }, [search]);

  // Function to handle download
  const handleDownload = (url, id) => {
    const link = document.createElement("a");
    link.href = url; // Unsplash provides raw/full urls
    link.download = `unsplash-${id}.jpg`; // suggest a file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : data.length > 0 ? (
        <Grid container spacing={3}>
          {data.map((img) => (
            <Grid item xs={12} md={4} key={img.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardMedia
                  component="img"
                  image={img.urls.small}
                  alt={img.alt_description || "Unsplash Image"}
                  sx={{
                    height: 300,
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() => handleDownload(img.urls.full, img.id)}
                  >
                    Download
                  </Button>
                </CardActions>
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
    </Box>
  );
};

export default Gallery;
