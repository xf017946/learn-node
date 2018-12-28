const socketio = require('socket.io')
let io,
    guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {}

exports.listen = function (server) {
  io = socketio.listen(server)
  io.set('log level', 1)

  io.sockets.on('connection', function (socket) {
    // 分配昵称
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
    joinRoom(socket, 'Lobby')

    handleMessageBroadcasting(socket, nickNames)
    handleNameChangeAttempts(socket, nickNames, namesUsed)
    handleRoomJoining(socket)

    socket.on('rooms', function () {
      socket.emit('rooms', io.sockets.manager.rooms)
    })

    handleClientDisconnection(socket, nickNames, namesUsed)
  })
}

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  let name = 'Guest' + guestNumber
  nickNames[socket.id] = name
  socket.emit('nameResult', {
    success: true,
    name: name
  })
  namesUsed.push(name)
  return guestNumber + 1
}

function joinRoom(socket, room) {
  socket.join(room)
  currentRoom[socket.id] = room
  socket.emit('joinResult', { room: room })
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + 'has joined' + room + '.'
  })

  let usersInRoom = io.sockets.clients(room)
  if (usersInRoom.length > 1) {
    let usersInRoomSummary = 'Users currently in ' + room + ': '
    for (let index in usersInRoom) {
      let userSocketId = usersInRoom[index].id
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += nickNames[userSocketId]
        }
      }

      usersInRoomSummary += '.'
      socket.emit('message', { text: usersInRoomSummary })
    }

    usersInRoomSummay += '.'
    socket.emit('message', {text: usersInRoomSummary})
  }
}