import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files (html, css, js, images, etc.)
app.use(express.static(path.join(__dirname, "..")));

// API route
app.get("/api/menu", (req, res) => {
  const menuData = fs.readFileSync(path.join(__dirname, "../menu.json"));
  res.setHeader("Content-Type", "application/json");
  res.send(menuData);
});

// fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // <-- important for Vercel
