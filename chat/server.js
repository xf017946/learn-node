const http = require('http')
const fs = require('fs')
const Path = require('path')
const mime = require('mime')

let cache = {}

function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.write('Error 404: resource not found.')
  res.end()
}

function sendFile(res, filePath, fileContents) {
  console.log('Path.basename(filePath)', Path.basename(filePath))
  res.writeHead(
    200,
    {"content-type": mime.getType(Path.basename(filePath))}
  )

  res.end(fileContents)
}

function serveStatic(res, cache, absPath) {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath])
  } else {
    fs.access(Path.resolve(__dirname, absPath), fs.constants.F_OK, function (errs) {
      if (!errs) {
        fs.readFile(Path.resolve(__dirname, absPath), function (err, data) {
          if (err) {
            send404(res)
          } else {
            cache[absPath] = data
            sendFile(res, absPath, cache[absPath])
          }
        })
      } else {
        send404(res)
      }
    })
  }
}

const server = http.createServer(function (req, res) {
  let filePath = false

  if (req.url == '/') {
    filePath = 'public/index.html'
  } else {
    filePath = 'public' + req.url
  }

  let absPath = './' + filePath
  serveStatic(res, cache, absPath)
})

server.listen(3000, function () {
  console.log("Server listening on port 3000.")
})