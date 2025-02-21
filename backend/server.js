require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to Railway MySQL database.");
});
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM TasksTables", (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
});
app.post("/tasks", (req, res) => {
  const { id, task } = req.body;

  if (!id || !task) {
    return res.status(400).json({ error: "ID and Task are required" });
  }

  db.query("INSERT INTO TasksTables (id, task) VALUES (?, ?)", [id, task], (err, result) => {
    if (err) {
      console.error("Database Insert Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json({ id, task });
  });
});
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  
  db.query("DELETE FROM TasksTables WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database Delete Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted", id });
  });
});
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
