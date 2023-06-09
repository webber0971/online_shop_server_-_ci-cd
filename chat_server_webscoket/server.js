
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server,{
        cors:{
                origin: '*',
                }
        })
const { v4: uuidV4 } = require('uuid')
const port = process.env.PORT || 3001;

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/new_room', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/new_room/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      console.log("join-room = 成功")
      console.log("room_id = ",roomId)
      console.log("user_id = ",userId)
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId)
      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
      })
    })
  
    console.log("有人加入連線")
      socket.on("enter_room",(client_id)=>{
          console.log(client_id)
          console.log("kkk")
          socket.join(client_id)
          io.emit('chat message', client_id);
          // socket.to(client_id).emit('chat message', client_id);
          socket.on("user_entered",(client_id)=>{
              io.emit("user_entered",client_id)
          })
  
          socket.on('chat message', (msg) => {
              console.log(msg)
              io.emit('chat message', msg);
          });
      })
  
      socket.on("disconnect",()=>{
          console.log("有人離線")
          socket.emit("user_left")
      })
      // 監聽連接 video 聊天
      socket.on('join-room', (roomId, userId) => {
          console.log("join-room = 成功")
          console.log("room_id = ",roomId)
          console.log("user_id = ",userId)
          socket.join(roomId)
          socket.broadcast.to(roomId).emit('user-connected', userId)
  
          socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
