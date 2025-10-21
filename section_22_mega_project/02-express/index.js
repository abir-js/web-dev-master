import express from "express";
import dotenv from "dotenv";
import logger from "./logger.js";
import morgan from "morgan";

dotenv.config({
  path: "./.env",
});

const app = express();

const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello ice tea");
});

app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
