require("dotenv").config()
const axios = require("axios");

const express = require("express");

const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.static("public")); 

app.get("/", (req, res) => {
  res.send("Cafe Finder Backend is running 🚀");
});

app.get("/cafes", async(req,res)=>{
    try{
        const { lat , lng } = req.query;
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        const response = await axios.get(url);
        res.json(response.data);

    }catch(error){
        console.error(error); 
         res.status(500).json({ error: "Something went wrong!" });
    }
})



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
