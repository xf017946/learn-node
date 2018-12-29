// var net = require('net')

// var server = net.createServer(function (socket) {
//   console.log(socket)
//   socket.once('data', function (data) {
//     console.log(data.toString())
//     socket.write(data)
//   })
// })

// server.listen(8888)

// var EventEmitter = require('events').EventEmitter
// var channel = new EventEmitter()
// channel.on('join', function () {
//   console.log('Welcome')
// })

// console.log('to do emit')
// channel.emit('join')

let events = require('events')
let net = require('net')

let channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

channel.on('join', function (id, client) {
  this.clients[id] = client
  this.subscriptions[id] = function (senderId, message) {
    if (id != senderId) {
      this.clients[id].write(message)
    }
  }
  this.on('broadcast', this.subscriptions[id])
})

let server = net.createServer(function (client) {
  let id = client.remoteAddress + ':' + client.remotePort
  client.on('connect', function () {
    channel.emit('join', id, client)
  })

  client.on('data', function (data) {
    data = data.toString()
    channel.emit('broadcast', id, data)
  })
})

server.listen(8888)