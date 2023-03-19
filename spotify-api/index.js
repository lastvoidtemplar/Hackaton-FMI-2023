const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();
const router = require('./routes/spotify-oauth');
const {router : queueRouter } = require('./routes/queue_manager')
const cors = require('cors')
const {getQueue} = require('./routes/queue_manager')
const {auth} = require('express-oauth2-jwt-bearer')
const port = process.env.PORT_HTTPS;

app.use(cors());

const jwtCheck = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER,
  tokenSigningAlg: process.env.TOKEN_SIGNING_ALG,
});

app.use("/", router);

app.use("/queue", queueRouter);

app.get("/", jwtCheck, (req, res) => {
  res.json("hello world");
});

app.listen(port, () => {
  console.log(`server is runing on port ${port}`);
});

module.exports = app;
