const express = require('express')

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>My Page</title></head>
      <body>
        <h1>Hello from Node.js!</h1>
        <p>This is a raw HTML response.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});