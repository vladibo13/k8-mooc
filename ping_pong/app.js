const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const { Pool } = require('pg')
const PORT = process.env.PORT || 3003

let counter = 0

const dir = '/tmp/kube'
const filePath = path.join(dir, 'log.txt')

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const pool = new Pool({
  host: process.env.PGHOST || 'postgres-svc',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || '123',
  database: process.env.POSTGRES_DB || 'pingpongdb',
  port: Number(process.env.PGPORT || 5432),
  max: 5,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS counter (
      id INTEGER PRIMARY KEY,
      value INTEGER NOT NULL
    );
  `);
  await pool.query(`
    INSERT INTO counter (id, value)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING;
  `);
}
init().catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});

function writeToFile(filePath, counter) {
  fs.writeFile(filePath, counter.toString(), (err) => {
    if (err) throw err
    console.log('Log saved!')
  })
}

app.get('/pingpong', async (req, res) => {
    // counter++
    // writeToFile(filePath, counter)
    // res.json({counter : 'pong / pongs ' + counter})

      try {
      const { rows } = await pool.query(
        'UPDATE counter SET value = value + 1 WHERE id = 1 RETURNING value'
      );
      res.json({ counter: 'pong / pongs ' + rows[0].value });
    } catch (e) {
      console.error('DB error:', e);
      res.status(500).json({ error: 'database error' });
    }
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
});