const express = require("express");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const app = express();
const port = 5000;
const router = require('./routes/spotify-oauth');
const queueRouter = require('./routes/queue_manager')
const cors = require('cors')
app.use(cors())
app.use('/',router)

app.use('/queue', queueRouter);

app.get('/', (req, res) => {
  res.send('hello world')
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

