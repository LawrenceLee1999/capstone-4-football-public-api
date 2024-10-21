import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://www.scorebat.com/video-api/v3";
const token =
  "MTgwODEyXzE3Mjg1NTQ0NzJfNjdjZTE2ZGEzZDRlZTJkMTQwYTY5MTA5NzgwYjc1OTk2M2RhN2RhOQ==";

app.use(express.static("public"));

// gets home page initially
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// gets a random video from scorebat passing data to the index.ejs
app.get("/feed", async (req, res) => {
  try {
    const result = await axios.get(API_URL + `/feed?token=${token}`);

    const randomVideo =
      result.data.response[
        Math.floor(Math.random() * result.data.response.length)
      ];

    const embedString = randomVideo.videos[0].embed;
    const srcMatch = embedString.match(/src='([^']+)'/);
    const videoSrc = srcMatch ? srcMatch[1] : "";

    console.log(randomVideo);

    res.render("index.ejs", {
      content: randomVideo,
      videoSrc: videoSrc,
    });
  } catch (error) {
    console.error("Error fetching data from ScoreBat API: ", error.message);
    res.status(500).send("An error occured while fetching the data");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
