import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../Context";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import GetAppIcon from "@mui/icons-material/GetApp";
import ImageModal from "./ImageModal";

const Gallery = () => {
  const { search, filters } = useGlobalContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const sentinelRef = useRef(null);
  const abortControllerRef = useRef(null);

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

  const fetchImages = async (pageNum = 1, reset = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: search,
          per_page: 12,
          page: pageNum,
          orientation: filters.orientation || undefined,
          color: filters.color || undefined,
        },
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_PHOTO_KEY}`,
        },
        signal: controller.signal,
      });

      const newResults = res.data.results || [];

      if (reset) {
        setData(newResults);
      } else {
        setData((prev) => [...prev, ...newResults]);
      }

      setHasMore(newResults.length > 0);
    } catch (error) {
      if (axios.isCancel?.(error) || error?.name === "CanceledError") {
        // request was cancelled
      } else {
        console.error("Fetch images error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset when search/filters change
  useEffect(() => {
    if (!search) {
      setData([]);
      setHasMore(false);
      setPage(1);
      return;
    }
    setPage(1);
    setHasMore(true);
    fetchImages(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters]);

  // Observe sentinel for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  // Load next page
  useEffect(() => {
    if (page === 1) return;
    fetchImages(page, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Masonry-style layout using CSS columns */}
      {data.length > 0 ? (
        <Box
          sx={{
            columnCount: { xs: 1, sm: 2, md: 4 },
            columnGap: 2,
          }}
        >
          {data.map((img) => (
            <Card
              key={img.id}
              sx={{
                display: "inline-block",
                width: "100%",
                mb: 2,
                position: "relative",
                boxShadow: 3,
                transition: "0.16s",
                "&:hover": { transform: "translateY(-4px)" },
                breakInside: "avoid",
                WebkitColumnBreakInside: "avoid",
                MozColumnBreakInside: "avoid",
              }}
            >
              {/* Download icon */}
              <IconButton
                onClick={() => handleDownload(img.urls.full, img.id)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "#00bcd4",
                  "&:hover": { backgroundColor: "#ff4081" },
                  zIndex: 2,
                }}
                size="small"
              >
                <GetAppIcon />
              </IconButton>

              {/* Image */}
              <CardMedia
                component="img"
                image={img.urls.small}
                alt={img.alt_description || "Unsplash Image"}
                loading="lazy"
                onClick={() => handleOpenModal(img)}
                sx={{
                  width: "100%",
                  display: "block",
                  cursor: "pointer",
                }}
              />
            </Card>
          ))}
        </Box>
      ) : !loading ? (
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          No images found. Try searching something else!
        </Typography>
      ) : null}

      {/* Skeletons for initial load (4 in one row) */}
      {loading && data.length === 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={250} animation="wave" />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Skeletons when fetching more pages (infinite scroll) */}
      {loading && data.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={`s-${i}`}>
              <Skeleton variant="rectangular" height={250} animation="wave" />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} />

      {/* Image preview modal */}
      <ImageModal
        open={openModal}
        handleClose={handleCloseModal}
        image={selectedImage}
      />
    </Box>
  );
};

export default Gallery;
