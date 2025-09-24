const express = require("express");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const axios = require("axios");

const app = express();

// Where your PV/volume is mounted inside the container:
const DATA_DIR = process.env.DATA_DIR || "/tmp/kube";
const CACHE_DIR = path.join(DATA_DIR, "cache");
const CACHE_FILE = path.join(CACHE_DIR, "image.jpg");

// Source + TTL (10 minutes = 600_000 ms)
const REMOTE_URL = process.env.REMOTE_URL || "https://picsum.photos/1200";
const TTL_MS = Number(process.env.TTL_MS || 600_000);

async function ensureDir() {
  await fsp.mkdir(CACHE_DIR, { recursive: true });
}

async function fileAgeMs(file) {
  try {
    const st = await fsp.stat(file);
    return Date.now() - st.mtimeMs;
  } catch {
    return Number.POSITIVE_INFINITY; // “doesn’t exist” -> force fetch
  }
}

async function downloadToFile(url, dest) {
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
  const tmp = dest + ".tmp-" + process.pid + "-" + Date.now();
  await fsp.writeFile(tmp, res.data);
  await fsp.rename(tmp, dest); // atomic swap
}

let refreshing = false;
async function maybeRefreshInBackground() {
  if (refreshing) return;
  refreshing = true;
  try {
    await downloadToFile(REMOTE_URL, CACHE_FILE);
    console.log("Background refresh: new image saved");
  } catch (e) {
    console.error("Background refresh failed:", e.message);
  } finally {
    refreshing = false;
  }
}

// Serve the cached image. If > TTL, serve old once and refresh in background.
app.get("/image.jpg", async (req, res) => {
  await ensureDir();

  if (!fs.existsSync(CACHE_FILE)) {
    try {
      await downloadToFile(REMOTE_URL, CACHE_FILE);
      console.log("Initial fetch complete");
    } catch (e) {
      console.error("Initial fetch failed:", e.message);
      return res.status(502).send("Failed to fetch image");
    }
  }

  const age = await fileAgeMs(CACHE_FILE);
  if (age > TTL_MS) {
    // Serve stale once, then refresh (SWR behavior)
    maybeRefreshInBackground();
  }

  res.setHeader("Content-Type", "image/jpeg");
  fs.createReadStream(CACHE_FILE).pipe(res);
});

// Simple page to view it
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <body style="font-family: system-ui; margin: 2rem;">
        <h2>Hourly image w/ 10-min cache (PV-backed)</h2>
        <p>Old image may serve once after 10 min, then refreshes in background.</p>
        <img src="/image.jpg" width="600" height="400" />
        <div style="margin-top:1rem;">
          <a href="/crash">Crash container</a> (for testing PV persistence)
        </div>
      </body>
    </html>
  `);
});

// Crash endpoint to simulate container death
app.get("/crash", (_req, res) => {
  res.end("Crashing now…");
  setTimeout(() => process.exit(1), 50);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on", PORT));
