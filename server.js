const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function initDB() {
  db = await open({
    filename: path.join(__dirname, "backend.db"),
    driver: sqlite3.Database,
  });
  console.log("Connected to backend.db!");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS farms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      field_size_ha REAL
    );
    CREATE TABLE IF NOT EXISTS weather (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farm_id INTEGER,
      temperature REAL,
      rainfall REAL,
      humidity REAL,
      recorded_at TEXT,
      FOREIGN KEY (farm_id) REFERENCES farms(id)
    );
    CREATE TABLE IF NOT EXISTS risk (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farm_id INTEGER,
      risk_score REAL,
      risk_level TEXT,
      calculated_at TEXT,
      FOREIGN KEY (farm_id) REFERENCES farms(id)
    );
  `);
  console.log("Tables created!");

  await db.exec(`
    INSERT OR IGNORE INTO farms (id, name, lat, lng, field_size_ha) VALUES
    (1, 'Green Acres Farm', 53.8008, -1.5491, 45.5),
    (2, 'Moorland Farm', 54.3781, -2.9079, 32.0),
    (3, 'Valley View Farm', 51.8787, -2.0732, 28.0),
    (4, 'Hillside Farm', 55.9533, -3.1883, 60.0),
    (5, 'Riverside Farm', 52.6309, -1.1398, 38.5);
  `);
  console.log("Sample farms inserted!");

  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("Tables found:", tables.map((t) => t.name));
}

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.get("/api/farms", async (req, res) => {
  try {
    const farms = await db.all("SELECT * FROM farms");
    res.json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/weather/fetch", async (req, res) => {
  try {
    const farms = await db.all("SELECT * FROM farms");
    for (const farm of farms) {
      const url = "https://api.open-meteo.com/v1/forecast?latitude="
        + farm.lat
        + "&longitude="
        + farm.lng
        + "&current=temperature_2m,relative_humidity_2m,precipitation&forecast_days=1";
      const response = await axios.get(url);
      const current = response.data.current;
      const temperature = current.temperature_2m;
      const humidity = current.relative_humidity_2m;
      const rainfall = current.precipitation;
      await db.run(
        "INSERT INTO weather (farm_id, temperature, rainfall, humidity, recorded_at) VALUES (?, ?, ?, ?, datetime('now'))",
        [farm.id, temperature, rainfall, humidity]
      );
      console.log("Weather saved for " + farm.name);
    }
    res.json({ message: "Weather data fetched and saved for all farms!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/weather", async (req, res) => {
  try {
    const weather = await db.all("SELECT * FROM weather");
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/risk", async (req, res) => {
  try {
    const risk = await db.all("SELECT * FROM risk");
    res.json(risk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initDB()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });