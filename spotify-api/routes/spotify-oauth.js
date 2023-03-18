require("dotenv").config();
const querystring = require("querystring");
const express = require("express");
const axios = require("axios");
const { addToken, getToken } = require("../services/userService");
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize?";

let party_id = 0;

const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
const stateKey = "spotify_auth_state";
router.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = "user-read-private user-read-email";
  const redirect =
    SPOTIFY_AUTH_URL +
    querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: scope,
      state: state,
      redirect_uri: REDIRECT_URI,
    });
  res.redirect(redirect);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    try {
      const response = await axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: querystring.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${new Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      });
      if (response.status === 200) {
        party_id++;
        addToken(response.data, party_id);
        res.json("Succ");
      } else {
        console.log(response);
        res.json(response);
      }
    } catch (error) {
      res.send(error);
    }
  }
});

router.get("/token", async (req, res) => {
   res.json(await getToken(1));
});

module.exports = router;
