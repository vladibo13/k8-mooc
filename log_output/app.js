const crypto = require('crypto')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const randomString = crypto.randomUUID()

console.log("App started. Random string:", randomString)

setInterval(() => {
  const timestamp = new Date().toISOString()
  console.log(`${timestamp}: ${randomString}`)
}, 5000);

app.get('/', (req, res) => {
  res.json('Log Output app running. See <a href="/status">/status</a>.')
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