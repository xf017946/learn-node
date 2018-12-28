let http = require('http')
const fs = require('fs')

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'})
//   res.end('Hello World\n')
// }).listen(3000)

// console.log('Server running at http://localhost:3000/')

const server = http.createServer()

// server.on('request', (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain'})
//   res.end('Hello World\n')
// })

server.on('request', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/png'})
  fs.createReadStream('./1.jpg').pipe(res)
})

server.listen(3000)