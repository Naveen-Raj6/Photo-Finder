import React, { useState } from "react";
import { useGlobalContext } from "../Context";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const SearchForm = () => {
  const { setSearch, setFilters } = useGlobalContext();
  const [value, setValue] = useState("");
  const [orientation, setOrientation] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(value);
    setFilters({ orientation, color });
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

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Orientation</InputLabel>
          <Select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            label="Orientation"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="landscape">Landscape</MenuItem>
            <MenuItem value="portrait">Portrait</MenuItem>
            <MenuItem value="squarish">Square</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Color</InputLabel>
          <Select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            label="Color"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="black_and_white">Black & White</MenuItem>
            <MenuItem value="black">Black</MenuItem>
            <MenuItem value="white">White</MenuItem>
            <MenuItem value="yellow">Yellow</MenuItem>
            <MenuItem value="orange">Orange</MenuItem>
            <MenuItem value="red">Red</MenuItem>
            <MenuItem value="purple">Purple</MenuItem>
            <MenuItem value="magenta">Magenta</MenuItem>
            <MenuItem value="green">Green</MenuItem>
            <MenuItem value="teal">Teal</MenuItem>
            <MenuItem value="blue">Blue</MenuItem>
          </Select>
        </FormControl>

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
