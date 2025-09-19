const crypto = require('crypto')
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const randomString = crypto.randomUUID()

const dir = '/logs'
const filePath = path.join(dir, 'log.txt')

const pong_dir = '/tmp/kube'
const filePathPong = path.join(pong_dir, 'log.txt')
doesDirExist(dir)

function doesDirExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function writeToFile(filePath, timestamp, randomString) {
  fs.appendFile(filePath, `${timestamp}: ${randomString} \n`, (err) => {
    if (err) throw err
    console.log('Log saved!')
  })
}


console.log("App started. Random string:", randomString)

setInterval(() => {
  const timestamp = new Date().toISOString()
  console.log(`${timestamp}: ${randomString}`)
  // writeToFile(filePath, timestamp, randomString)
}, 5000);

app.get('/log-output', (req, res) => {
   fs.readFile(filePathPong, 'utf8', (err, data) => {
     if (err) {
       if (err.code === 'ENOENT') return res.status(200).send('(empty)')
       return res.status(500).send('read error')
     }
     res.type('text/plain').send(new Date().toISOString() + ` ${randomString} ` + data)
   })
})

app.get('/status', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    randomString
  })
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
});