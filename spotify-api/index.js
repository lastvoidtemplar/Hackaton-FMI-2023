const express = require("express");
const app = express();
const port = 5000;
const router = require('./routes/spotify-oauth')
app.use('/',router)
app.get('/', (req, res) => {
  res.send('hello world')
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

// app.use("/home", express.static('../client/'));
