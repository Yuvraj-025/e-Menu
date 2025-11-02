const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const MENU_FILE = path.join(__dirname, "menu.json");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/menu", (req, res) => {
  fs.readFile(MENU_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading menu");
    res.json(JSON.parse(data));
  });
});

app.post("/api/menu", (req, res) => {
  fs.writeFile(MENU_FILE, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).send("Error saving menu");
    res.send({ message: "Menu updated successfully" });
  });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
module.exports = app;

