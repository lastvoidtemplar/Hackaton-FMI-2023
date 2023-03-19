const express = require("express");
const axios = require("axios");
const router = express.Router();
const {createParty, getAccessToken} = require('../services/partyService');

require('dotenv').config()

const SPOTIFY_PLAYLIST_NAME = process.env.SPAPI_SPOTIFY_PLAYLIST_NAME
const PLAYLIST_REFRESH_TIME_MIN = Number(process.env.SPAPI_PLAYLIST_REFRESH_TIME_MIN);
const PLAYLIST_REFRESH_TIME_MAX = Number(process.env.SPAPI_PLAYLIST_REFRESH_TIME_MAX);
const queues = [];

async function getSpotifyToken(party) {
  return getAccessToken(party);
}

function existsParty(partyid) {
  return partyid && queues[partyid] !== undefined;
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

async function getUser(token) {
  const user = await axios({
    method: "get",
    url: `https://api.spotify.com/v1/me`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }).then((response) => {
    // if success, parse and return
    const profile = response.data;
    return profile;
  }).catch((error) => {
    // if not, undefined
    console.log(error.response.data);
    return undefined;
  });
  return user; 
}

router.get('/user', async (req, res) => {
  res.send(await getUser(await getSpotifyToken(req.query.id)));
});

async function createPlaylist(token, partyid) {
  if(queues[partyid].playlistid) return;
  const user = await getUser(token);
  const playlist = await axios({
    method: "post",
    url: `https://api.spotify.com/v1/users/${user.id}/playlists`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    },
    data: {
      name: SPOTIFY_PLAYLIST_NAME + " - " + partyid,
      description: "New playlist description",
      public: false
    }
  }).then((response) => {
    // if success, parse and return
    return response.data;
  }).catch((error) => {
    // if not, undefined
    console.log(error.response.data);
    return undefined;
  });

  queues[partyid].playlistid = playlist.id;
  queues[partyid].syncIntervalId = setInterval(() => syncSpotifyQueue(partyid), PLAYLIST_REFRESH_TIME_MAX);
  return playlist;
}

router.get('/playlist', async (req, res) => {
  const partyid = req.query.id;
  if(!existsParty(partyid)) {
    res.status(400);
    res.send("invalid party id");
    return;
  }
  if(queues[partyid].playlistid) {
    res.status(400);
    res.send("playlist already created");
  }

  const result = await createPlaylist(await getSpotifyToken(req.query.id), req.query.id);

  res.send(result);
});

router.get('/', (req, res) => {
  res.send("Hello, queue");
});

function createQueue(partyid) {
  queues[partyid] = {
    tracks: [],
    playlistid: null,
    lastSyncTime: Date.now(),
    nowPlaying: null,
    syncIntervalId: null
  };
  console.log(queues[partyid]);
  return queues[partyid];
}

router.get('/create', (req, res) => {
  const partyid = req.query.id;
  if(!partyid) {
    res.status(400);
    res.send("invalid party id");
    return;
  }
  if(queues[partyid]) {
    res.status(400);
    res.send("party already created")
    return;
  }
  // TODO: check party id validity
  const result = createQueue(partyid);
  res.send(result);
});

router.get('/add', async (req, res) => {
  const partyid = req.query.id;
  const songid = req.query.trackid;
  // check arguments
  if(!existsParty(partyid) || !songid) {
    res.status(400);
    res.send("valid partyid and songid needed");
    return;
  }
  const items = queues[partyid].tracks;
  for(const item of items) {
    if(item.track.id == songid) {
      res.status(400);
      res.send("song is already in there!!");
      return;
    }
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
    return song;
  }).catch((error) => {
    // if not, undefined
    console.log(error.response.data);
    return undefined;
  });

  if(song) {        
    queues[partyid].tracks.push({track: song, score: 0, votes: {}});
  }
  res.send({
    tracks: queues[partyid].tracks
  });
});

function getQueue(partyid) {
  return {tracks: queues[partyid].tracks};
}

router.get('/get', (req, res) => {
  const partyid = req.query.id;
  if(!existsParty(partyid)) {
    res.status(400);
    res.send("invalid party id");
    return;
  }
  res.send(getQueue(partyid));
});

// requires ?id=...?user=...?q=...?limit=...
// limit is optional
router.get('/search/', async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const market = "BG";
  const q = req.query.q ? req.query.q : "never gonna give you up";
  const party = req.query.id;

  if(!existsParty(party)) {
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
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      return response.data.devices;
    }).catch((error) => {
      console.log("getting devices failed");
      console.log(error.response.data);
      return [];
    });
  return devices;
}

async function getActiveDevice(devices) {
  if(devices.length == 0) return undefined;
  let activeDevice = undefined;
  for(const device of devices) {
    if(device.is_active) {
      activeDevice = device;
      break;
    }
  }
  if(!activeDevice) return devices[0];
  return activeDevice;
}

router.get('/devices', async (req, res) => {
  const partyid = req.query.id;
  if(!partyid) {
    res.status(400);
    res.send("no party id");
  }
  const spotify_token = await getSpotifyToken(partyid);
  res.send(await getDevices(spotify_token));
});

async function addVote(partyid, userid, songid, direction) {
  const items = queues[partyid].tracks;
  for(const item of items) {
    if(item.track.id == songid) {
      if(item.votes[userid]) return;
      if(direction > 0) item.score ++;
      else if(direction < 0) item.score --;
      else return;
      item.votes[userid] = direction;
      break;
    }
  }
  sortQueue(partyid);
}

async function removeVote(partyid, userid, songid) {
  const items = queues[partyid].tracks;
  for(const item of items) {
    if(item.track.id == songid) {
      if(!item.votes[userid]) return
      item.score -= item.votes[userid];
      delete item.votes[userid];
      break;
    }
  }
  sortQueue(partyid);
}

async function getNowPlaying(partyid) {
  const token = await getSpotifyToken(partyid);

  const song = 
    await axios({
      method: "get",
      url: "https://api.spotify.com/v1/me/player/currently-playing",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      const playing = response.data;
      if(playing.item)
        return songFromResponse(playing.item);
      else return null;
    }).catch((error) => {
      console.log("getting now playing failed");
      console.log(error);
      return null;
    });

  return song;
}

router.get('/np', async (req, res) => {
  const partyid = req.query.id;
  if(!existsParty(partyid)) {
    res.status(400);
    res.send("invalid party id");
  }
  const result = await getNowPlaying(partyid);

  res.send(result);
});

async function setPlaylistSongs(partyid, songs) {
  const playlistid  = queues[partyid].playlistid;
  const token = await getSpotifyToken(partyid);
  const uriArray = songs.filter(x=>x).filter(x => x.track).map((song) => {
    return `spotify:track:${song.track.id}`;
  });
  const str = uriArray.join(',');
  console.log(`set playlist: ${str}`);

  await axios({
    method: "put",
    url: `https://api.spotify.com/v1/playlists/${playlistid}/tracks?uris=${str}`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }).then((response) => {
    console.log(response.data);
  }).catch((error) => {
    console.log("setting playlist songs failed");
    console.log(error.response.data);
    return null;
  });
}

async function syncSpotifyQueue(partyid) {
  const nowPlaying = await getNowPlaying(partyid);
  const queue = queues[partyid];
  let playlist;
  const nowid = nowPlaying ? nowPlaying.id : null;
  const queueid = queue.nowPlaying ? queue.nowPlaying.id : null;
  if(!nowid) {
    queue.nowPlaying = queue.tracks[0].track;
    playlist = [
      queue.tracks[0], queue.tracks[1], queue.tracks[2]
    ];
  } else 
  if(nowid !== queueid) {
    queue.tracks.shift();
    queue.nowPlaying = queue.tracks[0].track;
    playlist = [
      queue.tracks[0], queue.tracks[1], queue.tracks[2]
    ];
  } else {
    playlist = [
      {track: nowPlaying}, queue.tracks[1], queue.tracks[2]
    ];
  }
  await setPlaylistSongs(partyid,playlist);
  console.log(`syncing playlist ${queue.playlistid} for party: ${partyid}`);
}

router.get('/sync', async (req, res) => {
  const partyid = req.query.id;
  if(!existsParty(partyid)) {
    res.status(400);
    res.send("invalid party id");
    return;
  }
  await syncSpotifyQueue(partyid);
  res.send("done");
});

async function sortQueue(partyid) {
  queues[partyid].tracks.sort((a, b) => {
    return a.votes - b.votes;
  });
  const now = Date.now();
  const time = now - queues[partyid].lastSyncTime;
  console.log(`update: time passed: ${time}`);
  if(time > PLAYLIST_REFRESH_TIME_MIN) {
    queues[partyid].lastSyncTime = now;
    await syncSpotifyQueue(partyid);
  }
}

router.get('/vote', async (req, res) => {
  const partyid = req.query.id;
  const songid = req.query.song;
  const userid = req.query.user;
  const direction = req.query.dir;
  console.log(`vote: ${partyid}, ${songid}, ${userid}, ${direction}`);
  if(!existsParty(partyid) || !songid || !userid || !direction) {
    res.status(400);
    res.send("invalid params");
    return;
  }

  await addVote(partyid, userid, songid, direction);
  res.send("success");
});

router.get('/unvote', async (req, res) => {
  const partyid = req.query.id;
  const songid = req.query.song;
  const userid = req.query.user;
  console.log(`unvote: ${partyid}, ${songid}, ${userid}`);
  if(!existsParty(partyid) || !songid || !userid) {
    res.status(400);
    res.send("invalid params");
  }

  await removeVote(partyid, userid, songid);
  sortQueue(partyid);
  res.send("success");
});

async function playPlaylist(partyid) {
  const token = await getSpotifyToken(partyid);
  const devices = await getDevices(token);
  const device = await getActiveDevice(devices);
  if(!device) device = devices[0];
  if(!device) return;
  const playlistid = queues[partyid].playlistid;
  console.log(`play playlist: ${partyid}, ${device.id}, ${playlistid}`);
  axios({
    method: "put",
    url: `https://api.spotify.com/v1/me/player/play?device_id=${device.id}`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: {
      "context_uri": `spotify:playlist:${playlistid}`,
      "offset": {
        "position": 0
      },
      "position_ms": 0
    }
  }).then((response) => {
    console.log(response.data);
  }).catch((error) => {
    console.log("playing failed");
    console.log(error.response.data);
  });
  queues[partyid].nowPlaying = queues[partyid].tracks[0].track;
}

router.get('/play', async (req, res) => {
  const partyid = req.query.id;
  if(!existsParty(partyid)) {
    res.status(400);
    res.send("invalid party id");
    return;
  }
  await playPlaylist(partyid);  
  res.send("done");
});

async function deletePlaylist(token, partyid) {
  const playlistid = queues[partyid].playlistid;
  await axios({
    method: "delete",
    url: `https://api.spotify.com/v1/playlists/${playlistid}/followers`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }).then((response) => {
    console.log(response.data);
  }).catch((error) => {
    console.log("deleting playlist failed");
    console.log(error.response.data);
  }); 
}

async function pausePlayback(token, device) {
  await axios({
    method: "put",
    url: `https://api.spotify.com/v1/me/player/pause`,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }).then((response) => {
    console.log(response.data);
  }).catch((error) => {
    console.log("pausing failed");
    console.log(error.response.data);
  });
}

async function deleteParty(partyid) {
  const queue = queues[partyid];
  const token = await getSpotifyToken(partyid);
  deletePlaylist(token, partyid);
  clearInterval(queue.syncIntervalId);

  const devices = await getDevices(token);
  const device = await getActiveDevice(devices);
  if(!device) device = devices[0];
  if(!device) return;
  pausePlayback(token, device);
}

router.get('/delete', async (req, res) => {
  const partyid = req.query.id;
  if(!existsParty(partyid)) {
    res.status(400);
    res.send("invalid party id");
    return;
  }
  await deleteParty(partyid);  
  res.send("done");
});

module.exports = {
  router,
  createPlaylist,
  createQueue,
  getQueue,
  addVote,
  removeVote,
  getNowPlaying,
};
