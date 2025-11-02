const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// ✅ Use absolute path for menu.json
const MENU_FILE = path.join(process.cwd(), "menu.json");

app.use(cors());
app.use(express.json());

// ✅ Serve static files from root (your HTML, CSS, JS)
app.use(express.static(path.join(process.cwd())));

// API route
app.get("/api/menu", (req, res) => {
  fs.readFile(MENU_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading menu.json:", err);
      return res.status(500).send("Error reading menu file");
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).send("Invalid JSON format in menu.json");
    }
  });
});

// API write route
app.post("/api/menu", (req, res) => {
  fs.writeFile(MENU_FILE, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.error("Error saving menu.json:", err);
      return res.status(500).send("Error saving menu");
    }
    res.send({ message: "Menu updated successfully" });
  });
});

// ✅ Serve index.html for any unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

// ✅ Required for Vercel
module.exports = app;
