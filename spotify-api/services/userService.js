require("dotenv").config();
const axios = require("axios");
const querystring = require("querystring");
const db = require("../db/mongodb");
const collection = db.collection("OAUTH");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getToken(party_id) {
  try {
    const doc = await collection.findOne({
      party_id: party_id,
    });
    if (doc.expire_at < Date.now()) {
      return refreshToken(doc);
    }
    return doc;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function addToken(token, party_id) {
  const party_id_doc = await collection.findOne({
    party_id: party_id,
  });
  if (party_id_doc !== null) {
    const token1 = {
      ...token,
      party_id,
    };
    await refreshToken(token1);
  } else {
    const doc = {
      ...token,
      party_id,
      expire_at: token.expires_in * 1000 + Date.now(),
    };
    try {
      const res = await collection.insertOne(doc);
    } catch (error) {
      console.log(error);
    }
  }
}
async function refreshToken(doc) {
  try {
    const res = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: doc.refresh_token,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });
    if (res.status === 200) {
      try {
        const update = {
          ...doc,
          ...res.data,
          expire_at: res.data.expires_in * 1000 + Date.now(),
        };
        const command = await collection.replaceOne(
          {
            _id: doc._id,
          },
          update
        );
        return res.data.access_token;
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  addToken,
  getToken,
};
