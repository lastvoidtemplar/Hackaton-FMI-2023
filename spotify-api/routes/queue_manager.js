const express = require("express");
const axios = require("axios");
const router = express.Router();

const {createParty, getAccessToken} = require('../services/partyService');

async function getSpotifyToken(party) {
  //return "BQDhyxxc_6AhjLZdHnCTmWtUfo2Q8nF9OKKaCSwi9B8XWdxxaRfKOt78iOHQ4tmLwI-ySJJbneh4veFgzESCgzSMwvwDeaSfhIkiXM2LKMyzj1NaZcEn81td05XahwM-V2ncbs9UNHo5lvYRp2NTcx3Zbt410zpFzx0zZFB82ZkSoObqmVoK89VfDW9EyaO7wTGhU9fQdUSbZYSzFKBixKu0MjjGhn7w-MTakdPKlExGHy8IqUup8CHtuz8iKNv4Vo59462mxhtTgHjxUKawWlqc4dFYWGVJ23Qm16EoMdxmNCocbyqxyGkHUWg6mg18s2O-dU9_9mYvYQ";
  return getAccessToken("6415f33edba4b61aadf9fccf");
}

function songFromResponse(item) {
  const artists = [];
  for(const artist of item.artists) {
    artists.push(artist.name);
  }
  return {
    name: item.name,
    artists: artists,
    album: item.album.name,
    duration_ms: item.duration_ms,
    id: item.id,
    image: item.album.images[2]
  }; 
}

const queues = [];

router.get('/', (req, res) => {
  res.send("Hello, queue");
});

router.get('/create', (req, res) => {
  if(!req.query.id) {
    res.status(400);
    res.send("no party id");
    return;
  }
  // TODO: check party id validity
  const id = req.query.id;
  queues[id] = [];
  res.send("created queue");
  console.log(queues);
});

router.get('/add', async (req, res) => {
  const partyid = req.query.id;
  const songid = req.query.trackid;
  // check arguments
  if(!partyid || !songid) {
    res.status(400);
    res.send("partyid and songid needed");
    return;
  }
  if(queues[partyid] === undefined) {
    res.status(400);
    res.send("partyid invalid");
    return;
  }  

  // get data for song on spotify
  const spotify_token = await getSpotifyToken(partyid);
  const song = await axios({
    method: "get",
    url: `https://api.spotify.com/v1/tracks/${songid}`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${spotify_token}`
    }
  }).then((response) => {
    // if success, parse and return
    let track = response.data;
    const song = songFromResponse(track);
    console.log(song);
    return song;
  }).catch((error) => {
    // if not, undefined
    console.log(error.response.data);
    return undefined;
  });

  if(song) {
    queues[partyid].push({track: song, votes: 0});
  }
  res.send(queues[partyid]);
});

router.get('/get', (req, res) => {
  console.log("get queue");
  const partyid = req.query.id;
  if(!partyid) {
    res.status(400);
    res.send("no party id");
    return;
  }
  if(queues[partyid] === undefined) {
    res.status(400);
    res.send("invalid party id");
    return;
  }
  res.send(queues[partyid]);
});

// requires ?party=...?user=...?q=...?limit=...
// limit is optional
router.get('/search/', async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const market = "BG";
  const q = req.query.q ? req.query.q : "never gonna give you up";
  const party = req.query.party;

  if(!party) {
    res.status(401)
    res.send("invalid query");
    return;
  }
  
  const spotify_token = await getSpotifyToken(party);
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
    console.log("ERROR: " + response);
    res.send(response);
  }); 
});

async function getDevices(token) {
  const devices = 
  await axios({
    method: "get",
    url: "https://api.spotify.com/v1/me/player/devices",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${spotify_token}`,
      "Content-Type": "application/json",
    }
  }).then((response) => {
    return response.data.devices;
  }).catch((response) => {
    console.log("getting devices failed");
    return [];
  });
  return devices;
}

async function getActiveDevice(token) {
  let activeDevice = undefined;
  const devices = await getDevices(token);
  if(devices.length == 0) return undefined;
  for(const device of devices) {
    if(device.is_active) {
      activeDevice = device;
      break;
    }
  }
  if(!activeDevice) return devices[0];
  return activeDevice;
}

module.exports = router;
