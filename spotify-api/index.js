const express = require("express");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const app = express();
const port = 5000;
const router = require('./routes/spotify-oauth');
const queueRouter = require('./routes/queue_manager')
const cors = require('cors')
const {auth} = require('express-oauth2-jwt-bearer')

app.use(cors())

const jwtCheck = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL:process.env.ISSUER,
  tokenSigningAlg:process.env.TOKEN_SIGNING_ALG
})
app.use('/',router)

app.use('/queue', queueRouter);

app.get('/',jwtCheck, (req, res) => {
  res.json('hello world')
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

