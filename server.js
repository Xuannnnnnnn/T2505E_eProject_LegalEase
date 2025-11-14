// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Thư mục uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// ===========================
// Fake Upload Endpoint
// ===========================
app.post("/upload", (req, res) => {
  // Chỉ trả về tên file giả, không lưu file thật
  // Bạn sẽ copy file thật vào thư mục /uploads theo tên này
  const timestamp = Date.now();
  const fakeFileName = `uploads/${timestamp}.placeholder`;
  res.json({
    filePath: fakeFileName,
    originalName: "your-file.ext",
  });
});

// ===========================
// JSON Server fake API
// ===========================
const router = jsonServer.router("db.json"); // cần có file db.json trong cùng folder
const middlewares = jsonServer.defaults();
app.use(middlewares);
app.use("/api", router);

// ===========================
// Start server
// ===========================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
