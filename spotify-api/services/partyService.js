require("dotenv").config();
const axios = require("axios");
const { ObjectId } = require("mongodb");
const querystring = require("querystring");
const db = require("../db/mongodb");
const collection = db.collection("parties");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let code = 100000;
function generateCode() {
  return code++;
}

async function createParty(spotify_data, owner_id) {
  try {
    const do_exist_party_with_the_same_owner = await collection.findOne({
      owner_id: owner_id,
    });
    if (do_exist_party_with_the_same_owner !== null) {
      await collection.deleteOne({_id: do_exist_party_with_the_same_owner._id});
    }
    spotify_data = {
      ...spotify_data,
      expires_in: spotify_data.expires_in * 1000 + Date.now(),
    };
    const code = generateCode()
    const party = {
      code,
      owner_id,
      guest: [owner_id],
      spotify_data,
    };
    const res = await collection.insertOne(party);
    return {
      id:res.insertedId.toString(),
      code,
      owner_id
    }

  } catch (error) {
    console.log(error);
    return null
  }
}

async function getAccessToken(id) {
  try {
    const party = await collection.findOne({
      _id: new ObjectId(id),
    });
    if (party.spotify_data.expires_in < Date.now()) {
      return refreshToken(party);
    }
    return party.spotify_data.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function refreshToken(party) {
  try {
    const res = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: party.spotify_data.refresh_token,
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
          ...party,
          spotify_data: {
            ...party.spotify_data,
            access_token: res.data.access_token,
            expires_in: res.data.expires_in *1000 + Date.now(),
          },
        };
        const command = await collection.replaceOne(
          {
            _id: party._id,
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
async function isUserInTheParty(party_id_str,guest_id){
  const party_id = new ObjectId(party_id_str)
  const party = await collection.findOne({_id:party_id})
  if(party===null){
    console.log('Null party');
    return false;
  }
  return party.guest.filter(guest=>guest===guest_id).length !== 0

}
module.exports = {
  createParty,
  getAccessToken,
  isUserInTheParty
};
