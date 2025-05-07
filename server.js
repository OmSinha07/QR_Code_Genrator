import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // Serves index.html and CSS

app.post("/generate", (req, res) => {
  const url = req.body.url;
  const qr_svg = qr.image(url, { type: "png" });

  // Save QR image as qr_img.png
  const filePath = "public/qr_img.png"; // Save inside public/ so frontend can access
  const output = fs.createWriteStream(filePath);
  qr_svg.pipe(output);

  // Save URL to file
  fs.writeFile("URL.txt", url, (err) => {
    if (err) console.error("Error saving URL:", err);
    else console.log("✅ URL saved to URL.txt");
  });

  output.on("finish", () => {
    // Send only the file name (frontend can access it via /qr_img.png)
    res.json({ imagePath: "qr_img.png" });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
