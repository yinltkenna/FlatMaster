require("dotenv").config("../frontend/node_modules");
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
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

const addTask = async () => {
  if (newTask.trim() !== "") {
    try {
      console.log("Adding task:", newTask);
    
      const response = await axios.post("http://localhost:5000/tasks", { task: newTask });

      console.log("Response:", response.data);
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error.response ? error.response.data : error.message);
    }
  }
};
app.post("/tasks", (req, res) => {
  const { id, task } = req.body;

  if (!id || !task) {
    return res.status(400).json({ error: "ID and Task are required" });
  }

  db.query("INSERT INTO TasksTables (id, task) VALUES (?, ?)", [id, task], (err, result) => {
    if (err) {
      console.error("Database Insert Error:", err);
      res.status(500).json({ error: "Database error", details: err });
    } else {
      res.json({ id, task });
    }
  });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM TasksTables WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json({ message: "Task deleted", id });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
