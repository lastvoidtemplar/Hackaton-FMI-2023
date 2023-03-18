const express = require("express");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const app = express();
const port = 5000;
const router = require('./routes/spotify-oauth')
app.use('/',router)

const spotify_token = "BQCLkKyD6I90DwyKuCqJPaDeBZpKnRc_usLxZYfSWP7YBTBJ0PTMegM1N0_KXV5PkXqrEC0TGl0FPm33biP1OL0MdT0E9IueWpqDQE1otQ6UdAhDKBK4IwnW3CnvCG9BeAx11gW1-hS8kv6Srwf1D8WXO-OB2rXlBGmj1Yot5tc--s5NR2YlGPdPq-CCJSeO68H8Q6G8YN_yDbc6AvX79do4DOhrhpJkC9cmyB-ZxOxm-NugXvQv99BBib4d8jdDqjQmnRZnE5a0cdl0ni2SOxt3mcmA3CMyuF26S7AHZk9-u_oNJDBbi54n-v3A_PkLX-IG06aOg1xT7A"

require('dotenv').config()

app.get('/', (req, res) => {
  res.send('hello world')
});

app.get('/search/', (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const market = "BG";
  const q = req.query.q ? req.query.q : "never gonna give you up";
  axios({
    method: "get",
    url: `https://api.spotify.com/v1/search?q=${q}&type=track&market=${market}&limit=${limit}&offset=0`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${spotify_token}`
    }
  }).then((response) => {
    let items = response.data.tracks.items;
    const ret = [];
    console.log(`query: ${q} response: ${response.status}`);
    for(const item of items) {
      const artists = [];
      for(const artist of item.artists) {
        artists.push(artist.name);
      }
      ret.push({
        name: item.name,
        artists: artists,
        album: item.album.name,
        duration_ms: item.duration_ms,
        id: item.id,
        image: item.album.images[2]
      });
    }
    res.send(ret);
  }).catch((response) => {
    res.send(response);
    console.log("ERROR: " + response.status);
  }); 
});


https.createServer(
  {
    key: fs.readFileSync("../key.pem"),
    cert: fs.readFileSync("../cert.pem")
  },
  app
).listen(port, () =>{
  console.log(`server is runing on port ${port}`);
});

