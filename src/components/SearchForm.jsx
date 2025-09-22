import React, { useState } from "react";
import { useGlobalContext } from "../Context";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const SearchForm = () => {
  const { setSearch } = useGlobalContext();
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(value);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Unsplash Image Search
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          mt: 2,
        }}
      >
        <TextField
          label="Search images..."
          variant="outlined"
          color="secondary"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ px: 4, fontWeight: "bold" }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default SearchForm;
