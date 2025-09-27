const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3003

let counter = 0

const dir = '/tmp/kube'
const filePath = path.join(dir, 'log.txt')

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

function writeToFile(filePath, counter) {
  fs.writeFile(filePath, counter.toString(), (err) => {
    if (err) throw err
    console.log('Log saved!')
  })
}

app.get('/pingpong', (req, res) => {
    counter++
    // writeToFile(filePath, counter)
    res.json({counter : 'pong / pongs ' + counter})
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
});