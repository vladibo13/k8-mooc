const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express();
const PORT = process.env.PORT || 3001;

const dir = '/logs'
const filePath = path.join(dir, 'log.txt')

app.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return res.status(200).send('(empty)')
      return res.status(500).send('read error')
    }
    res.type('text/plain').send(data)
  })
})

app.listen(PORT, () => console.log(`Reader on ${PORT}`))