import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello ice tea");
});

app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
