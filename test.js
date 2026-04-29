console.log("TEST FILE RUNNING");

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("test.db", (err) => {
  if (err) {
    console.log("ERROR:", err);
  } else {
    console.log("✅ DB CONNECTED");
  }
});