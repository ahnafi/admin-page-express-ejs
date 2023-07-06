const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "images/" });

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render("index.ejs", {});
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  const tempPath = req.file.path;
  const targetPath = `images/${req.file.originalname}`;

  // Pindahkan file sementara ke lokasi tujuan
  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error while saving the image.");
      return;
    }

    res.status(200).send("Image uploaded successfully.");
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
