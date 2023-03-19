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
  socket.on("join", ({ user, room }) => {
    socket.join(room);
    console.log(`User ${user} joined ${room}`);
  });
  socket.on('vote',(party_id,track_id,user_id,value)=>{
    console.log(`${value} ${user_id} ${track_id} ${party_id}`);
    const queue = getQueue(party_id);
    const tracks = {tracks:queue,nowPlaying: queue[0]};
    socket.emit(party_id.toString(),tracks)
  })
  socket.on("disconnected", ({ user, room }) => {
    console.log(`User ${user} left ${room}`);
  });
});

module.exports = io