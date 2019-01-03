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
  console.log('in join')
  this.clients[id] = client
  this.subscriptions[id] = function (senderId, message) {
    console.log('in broadcast')
    // if (id != senderId) {
    //   this.clients[id].write(message)
    // }
    this.clients[id].write(message)
  }
  this.on('broadcast', this.subscriptions[id])
})

let server = net.createServer(function (client) {
  let id = client.remoteAddress + ':' + client.remotePort
  // console.log(client, 'client')
  // client.on('connect', function () {
  //   console.log('emit join')
  //   channel.emit('join', id, client)
  // })
  channel.emit('join', id, client)

  client.on('close', function () {
    channel.emit('leave', id)
  })

  client.on('data', function (data) {
    data = data.toString()
    console.log('emit broadcast')
    channel.emit('broadcast', id, data)
  })
})

channel.on('leave', function (id) {
  console.log('in leave')
  channel.removeListener('broadcast', this.subscriptions[id])
  console.log('after remove')
  let testb = channel.emit('broadcast', id, id + " has left the chat.\n")
  console.log('textb', testb)
})

server.listen(8888)