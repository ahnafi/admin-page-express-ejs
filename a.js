const fs = require("fs");

// Membaca file gambar menjadi buffer
const imageBuffer = fs.readFileSync("./petrik.jpg");

// Menyimpan file gambar
fs.writeFile("./public/a.jpg", imageBuffer, (err) => {
  if (err) {
    console.error("Terjadi kesalahan saat menyimpan file:", err);
    return;
  }
  console.log("File gambar berhasil disimpan.");
});
// Membaca file gambar
fs.readFile("./public/a.jpg", (err, data) => {
  if (err) {
    console.error("Terjadi kesalahan saat membaca file:", err);
    return;
  }
  console.log(data)
  // `data` berisi buffer dari gambar
  // Gunakan `data` sesuai kebutuhan Anda
});
