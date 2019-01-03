let http = require('http')
let url = require('url')
let items = []

let server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST':
      let item = ''
      req.setEncoding('utf8')
      req.on('data', function (chunk) {
        item += chunk
      })

      req.on('end', function () {
        items.push(item)
        res.end('OK\n')
      })
      break
    
    case 'GET':
      let body = items.map(function(item, i) {
        return `${i}) ${item}`
      }).join('\n')
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
      res.end(body)
      break  
    
    case 'DELETE':
      let path = url.parse(req.url).pathname
      let i = parseInt(path.slice(1), 10)

      if (isNaN(i)) {
        res.statusCode = 400
        res.end('Invalid item id')
      } else if (!items[i]) {
        res.status = 404
        res.end('Item not found')
      } else {
        items.splice(i, 1)
        res.end('OK\n')
      }
      break
  }
})

server.listen(3000)