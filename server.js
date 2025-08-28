require("dotenv").config()
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.static("public")); 

app.get("/", (req, res) => {
  res.send("Cafe Finder Backend is running 🚀");
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
