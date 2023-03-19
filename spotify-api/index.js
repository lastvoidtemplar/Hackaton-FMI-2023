const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();
const router = require('./routes/spotify-oauth');
const {router : queueRouter } = require('./routes/queue_manager')
const cors = require('cors')
const {auth} = require('express-oauth2-jwt-bearer')
const io = require("./socket/socket-io");
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
io.listen(process.env.PORT_SOCKET);

app.listen(port, () => {
  console.log(`server is runing on port ${port}`);
});

module.exports = app;
