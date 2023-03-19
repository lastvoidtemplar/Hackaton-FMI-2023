require("dotenv").config();
const querystring = require("querystring");
const bodyParser = require('body-parser');
const express = require("express");
const axios = require("axios");
const { createParty, getAccessToken,isUserInTheParty } = require("../services/partyService");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize?";
const FRONTEND_REDIRECT_URL = process.env.FRONTEND_REDIRECT_URL

let party_id = 0;

const stateKey = "spotify_auth_state";
router.get("/createParty", (req, res) => {
  const state = req.query.owner_id;
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
    console.log(redirect);
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
        const dto = await createParty(response.data,state);
        res.redirect(`${FRONTEND_REDIRECT_URL}${dto.code}?party_id=${dto.id}&owner_id=${dto.owner_id}`);
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
   res.json(await getAccessToken("6415f33edba4b61aadf9fccf"));
});

router.get('/check',async(req,res)=>{
  res.json(await isUserInTheParty("6416031b407f5e174ce739ab","1234567"))
})

module.exports = router;
