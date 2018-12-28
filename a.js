const fs = require('fs')

// fs.readFile('./a.json', (err, data) => {
//   console.log(data.toString())
// })

const stream = fs.createReadStream('./a.json')
stream.on('data', function (chunk) {
  console.log(chunk.toString())
})

stream.on('end', function () {
  console.log('finished')
})