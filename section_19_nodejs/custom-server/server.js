const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8000;

const server = http.createServer((req, res) => {
   const filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
});

server.listen(port, () => `Server running at http://localhost:${port}`);