require("dotenv").config();
const http = require("http");
const {Server} = require('socket.io')
const {getQueue} = require('../routes/queue_manager')
const app = require('../index')


const server = http.createServer(app);
const io = new Server(server,{
  cors:{
      origin:process.env.FRONTEND_BASE_URL,
  }
});

io.on("connection", (socket) => {
    console.log('conn');
  socket.on("join", ({ user_id, party_id }) => {
    console.log(party_id);
    socket.join(party_id);
    console.log(`User ${user_id} joined ${party_id}`);
  });
  socket.on("vote",({party_id,track_id,user_id,vote})=>{
    console.log(`${vote} ${user_id} ${track_id} ${party_id}`);
    //const queue = {"tracks":[{"track":{"name":"Rocket Man (I Think It's Going To Be A Long, Long Time)","artists":["Elton John"],"album":"Honky Chateau","duration_ms":281613,"id":"3gdewACMIVMEWVbyb8O9sY","image":{"height":64,"url":"https://i.scdn.co/image/ab67616d000048513009007708ab5134936a58b3","width":64}},"score":0,"votes":{}},{"track":{"name":"Black Summer","artists":["Red Hot Chili Peppers"],"album":"Black Summer","duration_ms":232412,"id":"3a94TbZOxhkI9xuNwYL53b","image":{"height":64,"url":"https://i.scdn.co/image/ab67616d00004851579b9602ae484950d95d0ab8","width":64}},"score":0,"votes":{}}],"playlistid":"3gj9UZ88r3rEh6eV809APB","lastSyncTime":1679209028049,"nowPlaying":{"name":"Онзи","artists":["Руши"],"album":"Best of РУШИ","duration_ms":269573,"id":"2Bpu1SDNVLOMILOh2tYKxL","image":{"height":64,"url":"https://i.scdn.co/image/ab67616d00004851d0968244dbb8fc68a6abb036","width":64}}}
    //const tracks = {tracks: queue, nowPlaying: queue[0]};
    socket.to(party_id).emit('queue', "mam")
  })
  socket.on("leave", () => {});
});

module.exports = io